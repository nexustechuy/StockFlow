const pool = require("../config/db");
const Model = require("./Model");

class GastoModel extends Model {
    // Los gastos solo provienen de una compra de productos (id_compra).
    // La fecha se devuelve como texto para que no se corra un día por la zona horaria
    async listar() {
        return await this.db.query(
            `SELECT
                id_gastos,
                id_compra,
                descripcion,
                monto,
                DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha
             FROM gastos
             ORDER BY fecha DESC, id_gastos DESC`
        );
    }

    async crearPorCompra(conn, idCompra, monto) {
        await conn.query(
            `INSERT INTO gastos (id_compra, descripcion, monto, fecha)
             VALUES (?, ?, ?, CURDATE())`,
            [idCompra, `Compra #${idCompra}`, monto]
        );
    }
}

module.exports = new GastoModel(pool);
