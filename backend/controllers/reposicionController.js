const pool = require("../config/db");
const reposicionModel = require("../models/reposicionModel");
const productoModel = require("../models/productoModel");

// REPOSICIONES - LISTAR
async function listar(req, res) {
    try {
        const reposiciones = await reposicionModel.listar();

        res.json(reposiciones);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Error al obtener las reposiciones."
        });
    }
}

// REPOSICIONES - CREAR
async function crear(req, res) {
    let conn;

    try {
        const { id_producto, cantidad } = req.body;

        if (!id_producto || !cantidad || Number(cantidad) < 1) {
            return res.status(400).json({
                error: "Faltan datos obligatorios para registrar la reposición."
            });
        }

        conn = await pool.getConnection();
        await conn.beginTransaction();

        const nuevoId = await reposicionModel.crear(conn, req.body);
        await productoModel.sumarStock(conn, id_producto, cantidad);

        await conn.commit();

        const reposicionCreada = await reposicionModel.obtenerPorId(conn, nuevoId);

        res.status(201).json(reposicionCreada);

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
            error: "Error al registrar la reposición."
        });

    } finally {
        if (conn) {
            conn.release();
        }
    }
}

module.exports = { listar, crear };
