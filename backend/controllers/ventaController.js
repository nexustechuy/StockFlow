const pool = require("../config/db");
const Controller = require("./Controller");
const ventaModel = require("../models/ventaModel");
const productoModel = require("../models/productoModel");
const { esAdministrador } = require("../middleware/auth");

class VentaController extends Controller {
    constructor(db, ventaModel, productoModel) {
        super();
        this.db = db;
        this.ventaModel = ventaModel;
        this.productoModel = productoModel;
    }

    // VENTAS - LISTAR
    // El administrador ve todas; el vendedor, solo las suyas (según el token)
    async listar(req, res) {
        try {
            const ventas = await this.ventaModel.listar(
                esAdministrador(req) ? null : req.usuario.id_usuario
            );

            res.json(ventas);

        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: "Error al obtener las ventas."
            });
        }
    }

    // DETALLE DE VENTA - LISTAR
    // El administrador ve todo (con el costo); el vendedor, solo el de sus ventas y sin costos
    async listarDetalle(req, res) {
        try {
            const admin = esAdministrador(req);
            const detalle = await this.ventaModel.listarDetalle(
                admin ? null : req.usuario.id_usuario,
                admin
            );

            res.json(detalle);

        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: "Error al obtener el detalle de las ventas."
            });
        }
    }

    // VENTAS - CREAR
    async crear(req, res) {
        let conn;

        try {
            const { nombre_cliente, id_usuario, productos } = req.body;

            if (!nombre_cliente || !Array.isArray(productos) || productos.length === 0) {
                return res.status(400).json({
                    error: "Faltan datos obligatorios para registrar la venta."
                });
            }

            for (const item of productos) {
                if (!item.id_producto || !item.cantidad || Number(item.cantidad) < 1) {
                    return res.status(400).json({
                        error: "Cada producto de la venta necesita id_producto y cantidad válidos."
                    });
                }
            }

            conn = await this.db.getConnection();
            await conn.beginTransaction();

            const idsProductos = productos.map(item => item.id_producto);
            const productosDb = await this.productoModel.buscarPorIds(conn, idsProductos);

            let total = 0;
            const detalle = [];

            for (const item of productos) {
                const productoDb = productosDb.find(p => Number(p.id_producto) === Number(item.id_producto));

                if (!productoDb) {
                    throw Object.assign(new Error(`El producto ${item.id_producto} no existe.`), { status: 404 });
                }

                if (Number(productoDb.stock) < Number(item.cantidad)) {
                    throw Object.assign(new Error(`Stock insuficiente para "${productoDb.nombre}".`), { status: 409 });
                }

                const precioUnitario = Number(productoDb.precio_venta);
                const subtotal = precioUnitario * Number(item.cantidad);
                total += subtotal;

                detalle.push({
                    id_producto: productoDb.id_producto,
                    nombre: productoDb.nombre,
                    cantidad: Number(item.cantidad),
                    precio_unitario: precioUnitario,
                    subtotal
                });
            }

            const idVenta = await this.ventaModel.crear(conn, total, id_usuario || null, nombre_cliente);

            for (const item of detalle) {
                await this.ventaModel.crearDetalle(conn, idVenta, item);
                await this.productoModel.restarStock(conn, item.id_producto, item.cantidad);
            }

            await conn.commit();

            res.status(201).json({
                id_venta: idVenta,
                fecha_hora: new Date(),
                total,
                nombre_cliente,
                id_usuario: id_usuario || null,
                productos: detalle
            });

        } catch (error) {
            console.error(error);
            await this.deshacer(conn);

            // solo mostramos los errores nuestros, los de la base no
            res.status(error.status || 500).json({
                error: error.status ? error.message : "Error al registrar la venta."
            });

        } finally {
            if (conn) {
                conn.release();
            }
        }
    }
}

module.exports = new VentaController(pool, ventaModel, productoModel);
