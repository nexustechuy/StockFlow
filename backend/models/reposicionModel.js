const pool = require("../config/db");
const Model = require("./Model");

const SELECT_REPOSICION = `
    SELECT
        r.id_reposicion,
        r.fecha_hora,
        r.comentario,
        r.cantidad,
        r.id_producto,
        p.nombre AS producto_nombre,
        r.id_usuario,
        u.nombre AS usuario_nombre
     FROM reposicion r
     LEFT JOIN producto p ON r.id_producto = p.id_producto
     LEFT JOIN usuarios u ON r.id_usuario = u.id_usuario`;

class ReposicionModel extends Model {
    async listar() {
        return await this.db.query(`${SELECT_REPOSICION} ORDER BY r.fecha_hora DESC`);
    }

    async crear(conn, { comentario, cantidad, id_producto, id_usuario }) {
        const resultado = await conn.query(
            `INSERT INTO reposicion (fecha_hora, comentario, cantidad, id_producto, id_usuario)
             VALUES (NOW(), ?, ?, ?, ?)`,
            [comentario || null, cantidad, id_producto, id_usuario || null]
        );

        return Number(resultado.insertId);
    }

    async obtenerPorId(conn, id) {
        const reposiciones = await conn.query(`${SELECT_REPOSICION} WHERE r.id_reposicion = ?`, [id]);
        return reposiciones[0];
    }
}

module.exports = new ReposicionModel(pool);
