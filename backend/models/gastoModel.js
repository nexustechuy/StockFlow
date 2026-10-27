const pool = require("../config/db");

// La fecha se devuelve como texto para que no se corra un día por la zona horaria
async function listar() {
    return await pool.query(
        `SELECT
            id_gastos,
            descripcion,
            monto,
            DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha,
            categoria,
            id_venta
         FROM gastos
         ORDER BY fecha DESC, id_gastos DESC`
    );
}

module.exports = { listar };
