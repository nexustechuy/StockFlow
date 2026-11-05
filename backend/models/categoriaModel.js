const pool = require("../config/db");
const Model = require("./Model");

class CategoriaModel extends Model {
    async listar() {
        return await this.db.query(
            `SELECT id_categoria, nombre, descripcion
             FROM categoria
             ORDER BY nombre`
        );
    }

    async crear(nombre, descripcion) {
        const resultado = await this.db.query(
            `INSERT INTO categoria (nombre, descripcion) VALUES (?, ?)`,
            [nombre, descripcion]
        );

        return Number(resultado.insertId);
    }

    // Devuelve cuántas filas se borraron
    async eliminar(id) {
        const resultado = await this.db.query(
            `DELETE FROM categoria WHERE id_categoria = ?`,
            [id]
        );

        return Number(resultado.affectedRows);
    }
}

module.exports = new CategoriaModel(pool);
