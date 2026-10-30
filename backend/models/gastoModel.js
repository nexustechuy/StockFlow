const pool = require("../config/db");

// Los gastos solo provienen de una compra de productos (id_compra).
// La fecha se devuelve como texto para que no se corra un día por la zona horaria
async function listar() {
    return await pool.query(
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

module.exports = { listar };
