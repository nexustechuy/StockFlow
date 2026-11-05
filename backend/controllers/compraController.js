const pool = require("../config/db");
const compraModel = require("../models/compraModel");
const gastoModel = require("../models/gastoModel");
const productoModel = require("../models/productoModel");
const reposicionModel = require("../models/reposicionModel");

async function crear(req, res) {
    let conn;

    try {
        const { id_usuario, productos } = req.body;

        if (!Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({
                error: "Agregá al menos un producto a la compra."
            });
        }

        for (const item of productos) {
            if (!item.id_producto || !Number.isInteger(Number(item.cantidad)) || Number(item.cantidad) < 1) {
                return res.status(400).json({
                    error: "Cada producto de la compra necesita id_producto y una cantidad entera mayor a 0."
                });
            }
        }

        conn = await pool.getConnection();
        await conn.beginTransaction();

        const idsProductos = productos.map(item => item.id_producto);
        const productosDb = await productoModel.buscarPorIds(conn, idsProductos);

        let total = 0;
        const detalle = [];

        for (const item of productos) {
            const productoDb = productosDb.find(p => Number(p.id_producto) === Number(item.id_producto));

            if (!productoDb) {
                throw Object.assign(new Error(`El producto ${item.id_producto} no existe.`), { status: 404 });
            }

            const costoUnitario = Number(productoDb.precio_compra);
            const subtotal = costoUnitario * Number(item.cantidad);
            total += subtotal;

            detalle.push({
                id_producto: productoDb.id_producto,
                nombre: productoDb.nombre,
                cantidad: Number(item.cantidad),
                costo_unitario: costoUnitario,
                subtotal
            });
        }

        const idCompra = await compraModel.crear(conn, total, id_usuario || null);

        for (const item of detalle) {
            await compraModel.crearDetalle(conn, idCompra, item);
        }

        await gastoModel.crearPorCompra(conn, idCompra, total);

        await conn.commit();

        res.status(201).json({
            id_compra: idCompra,
            fecha_hora: new Date(),
            total,
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

        // solo mostramos los errores nuestros, los de la base no
        res.status(error.status || 500).json({
            error: error.status ? error.message : "Error al registrar la compra."
        });

    } finally {
        if (conn) {
            conn.release();
        }
    }
}

async function listarPendientes(req, res) {
    try {
        const compras = await compraModel.listarPendientes();

        res.json(compras.map(compra => ({
            ...compra,
            total_unidades: Number(compra.total_unidades)
        })));

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Error al obtener las compras pendientes."
        });
    }
}

async function marcarRepuesta(req, res) {
    let conn;

    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({ error: "Compra inválida." });
        }

        conn = await pool.getConnection();
        await conn.beginTransaction();

        const compra = await compraModel.buscarPendiente(conn, id);

        if (!compra) {
            await conn.rollback();
            return res.status(404).json({ error: "La compra no existe o ya estaba repuesta." });
        }

        const detalle = await compraModel.listarDetalle(conn, id);
        const idsReposiciones = [];

        for (const item of detalle) {
            const idReposicion = await reposicionModel.crear(conn, {
                comentario: `Compra #${id}`,
                cantidad: item.cantidad,
                id_producto: item.id_producto,
                id_usuario: req.usuario.id_usuario
            });
            await productoModel.sumarStock(conn, item.id_producto, item.cantidad);
            idsReposiciones.push(idReposicion);
        }

        await compraModel.marcarRepuesta(conn, id);
        await conn.commit();

        const reposiciones = [];
        for (const idReposicion of idsReposiciones) {
            reposiciones.push(await reposicionModel.obtenerPorId(conn, idReposicion));
        }

        res.json({ id_compra: id, estado: "repuesta", reposiciones });

    } catch (error) {
        console.error(error);

        if (conn) {
            try {
                await conn.rollback();
            } catch (rollbackError) {
                console.error(rollbackError);
            }
        }

        res.status(500).json({
            error: "Error al marcar la compra como repuesta."
        });

    } finally {
        if (conn) {
            conn.release();
        }
    }
}

module.exports = { crear, listarPendientes, marcarRepuesta };
