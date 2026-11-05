const pool = require("../config/db");
const Controller = require("./Controller");
const reposicionModel = require("../models/reposicionModel");
const productoModel = require("../models/productoModel");

class ReposicionController extends Controller {
    constructor(db, reposicionModel, productoModel) {
        super();
        this.db = db;
        this.reposicionModel = reposicionModel;
        this.productoModel = productoModel;
    }

    // REPOSICIONES - LISTAR
    async listar(req, res) {
        try {
            const reposiciones = await this.reposicionModel.listar();

            res.json(reposiciones);

        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: "Error al obtener las reposiciones."
            });
        }
    }

    // REPOSICIONES - CREAR
    async crear(req, res) {
        let conn;

        try {
            const { id_producto, cantidad } = req.body;

            if (!id_producto || !cantidad || Number(cantidad) < 1) {
                return res.status(400).json({
                    error: "Faltan datos obligatorios para registrar la reposición."
                });
            }

            conn = await this.db.getConnection();
            await conn.beginTransaction();

            const nuevoId = await this.reposicionModel.crear(conn, req.body);
            await this.productoModel.sumarStock(conn, id_producto, cantidad);

            await conn.commit();

            const reposicionCreada = await this.reposicionModel.obtenerPorId(conn, nuevoId);

            res.status(201).json(reposicionCreada);

        } catch (error) {
            console.error(error);
            await this.deshacer(conn);

            res.status(500).json({
                error: "Error al registrar la reposición."
            });

        } finally {
            if (conn) {
                conn.release();
            }
        }
    }
}

module.exports = new ReposicionController(pool, reposicionModel, productoModel);
