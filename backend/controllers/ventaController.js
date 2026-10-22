const pool = require("../config/db");
const ventaModel = require("../models/ventaModel");
const productoModel = require("../models/productoModel");

// VENTAS - LISTAR
async function listar(req, res) {
    try {
        const ventas = await ventaModel.listar();

        res.json(ventas);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Error al obtener las ventas."
        });
    }
}

// DETALLE DE VENTA - LISTAR
async function listarDetalle(req, res) {
    try {
        const detalle = await ventaModel.listarDetalle();

        res.json(detalle);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Error al obtener el detalle de las ventas."
        });
    }
}

// VENTAS - CREAR
async function crear(req, res) {
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

        // Se usa una sola conexión para toda la transacción
        conn = await pool.getConnection();
        await conn.beginTransaction();

        const idsProductos = productos.map(item => item.id_producto);
        const productosDb = await productoModel.buscarPorIds(conn, idsProductos);

        let total = 0;
        const detalle = [];

        for (const item of productos) {
            const productoDb = productosDb.find(p => Number(p.id_producto) === Number(item.id_producto));

            if (!productoDb) {
                throw new Error(`El producto ${item.id_producto} no existe.`);
            }

            if (Number(productoDb.stock) < Number(item.cantidad)) {
                throw new Error(`Stock insuficiente para "${productoDb.nombre}".`);
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

        const idVenta = await ventaModel.crear(conn, total, id_usuario || null, nombre_cliente);

        for (const item of detalle) {
            await ventaModel.crearDetalle(conn, idVenta, item);
            await productoModel.restarStock(conn, item.id_producto, item.cantidad);
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

        if (conn) {
            try {
                await conn.rollback();
            } catch (rollbackError) {
                console.error(rollbackError);
            }
        }

        res.status(400).json({
            error: error.message || "Error al registrar la venta."
        });

    } finally {
        if (conn) {
            conn.release();
        }
    }
}

module.exports = { listar, listarDetalle, crear };
