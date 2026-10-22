const pool = require("../config/db");

const SELECT_PRODUCTO = `
    SELECT
        p.id_producto,
        p.nombre,
        p.descripcion,
        p.precio_compra,
        p.precio_venta,
        p.stock,
        p.stock_minimo,
        p.estado_producto,
        p.id_categoria,
        c.nombre AS categoria
     FROM producto p
     INNER JOIN categoria c
         ON p.id_categoria = c.id_categoria`;

// PRODUCTOS
async function listar() {
    return await pool.query(SELECT_PRODUCTO);
}

async function obtenerPorId(id) {
    const productos = await pool.query(`${SELECT_PRODUCTO} WHERE p.id_producto = ?`, [id]);
    return productos[0];
}

async function crear({ nombre, descripcion, precio_compra, precio_venta, stock, stock_minimo, id_categoria }) {
    const resultado = await pool.query(
        `INSERT INTO producto
            (nombre, descripcion, precio_compra, precio_venta, stock, stock_minimo, estado_producto, id_categoria)
         VALUES (?, ?, ?, ?, ?, ?, 1, ?)`,
        [nombre, descripcion || null, precio_compra, precio_venta, stock, stock_minimo, id_categoria]
    );

    return Number(resultado.insertId);
}

// Devuelve cuántas filas se borraron
async function eliminar(id) {
    const resultado = await pool.query(
        `DELETE FROM producto WHERE id_producto = ?`,
        [id]
    );

    return Number(resultado.affectedRows);
}

async function buscarPorIds(conn, ids) {
    return await conn.query(
        `SELECT id_producto, nombre, precio_venta, stock
         FROM producto
         WHERE id_producto IN (${ids.map(() => "?").join(",")})`,
        ids
    );
}

async function restarStock(conn, idProducto, cantidad) {
    await conn.query(
        `UPDATE producto SET stock = stock - ? WHERE id_producto = ?`,
        [cantidad, idProducto]
    );
}

async function sumarStock(conn, idProducto, cantidad) {
    await conn.query(
        `UPDATE producto SET stock = stock + ? WHERE id_producto = ?`,
        [cantidad, idProducto]
    );
}

// VARIANTES
async function listarVariantes() {
    return await pool.query(
        `SELECT id_variante, tipo, valor, id_producto FROM variante`
    );
}

async function crearVariante(tipo, valor, idProducto) {
    const resultado = await pool.query(
        `INSERT INTO variante (tipo, valor, id_producto) VALUES (?, ?, ?)`,
        [tipo, valor, idProducto]
    );

    return Number(resultado.insertId);
}

module.exports = {
    listar,
    obtenerPorId,
    crear,
    eliminar,
    buscarPorIds,
    restarStock,
    sumarStock,
    listarVariantes,
    crearVariante
};
