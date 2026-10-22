const pool = require("../config/db");

async function listar() {
    return await pool.query(
        `SELECT id_categoria, nombre, descripcion
         FROM categoria
         ORDER BY nombre`
    );
}

async function crear(nombre, descripcion) {
    const resultado = await pool.query(
        `INSERT INTO categoria (nombre, descripcion) VALUES (?, ?)`,
        [nombre, descripcion]
    );

    return Number(resultado.insertId);
}

// Devuelve cuántas filas se borraron
async function eliminar(id) {
    const resultado = await pool.query(
        `DELETE FROM categoria WHERE id_categoria = ?`,
        [id]
    );

    return Number(resultado.affectedRows);
}

module.exports = { listar, crear, eliminar };
