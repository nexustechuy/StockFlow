const pool = require("../config/db");

async function listar() {
    return await pool.query(
        `SELECT
            v.id_venta,
            v.fecha_hora,
            v.total,
            v.id_usuario,
            u.nombre AS vendedor,
            v.id_cliente,
            v.nombre_cliente,
            c.nombre AS cliente_nombre,
            c.apellido AS cliente_apellido
         FROM venta v
         LEFT JOIN usuarios u ON v.id_usuario = u.id_usuario
         LEFT JOIN cliente c ON v.id_cliente = c.id_cliente
         ORDER BY v.fecha_hora DESC`
    );
}

async function listarDetalle() {
    return await pool.query(
        `SELECT
            dv.id_detalle_venta,
            dv.id_venta,
            dv.id_producto,
            dv.cantidad,
            dv.precio_unitario,
            dv.subtotal,
            p.nombre AS producto_nombre,
            p.precio_compra,
            p.id_categoria,
            cat.nombre AS categoria
         FROM detalle_venta dv
         INNER JOIN producto p ON dv.id_producto = p.id_producto
         LEFT JOIN categoria cat ON p.id_categoria = cat.id_categoria`
    );
}

async function crear(conn, total, idUsuario, nombreCliente) {
    const resultado = await conn.query(
        `INSERT INTO venta (fecha_hora, total, id_usuario, id_cliente, nombre_cliente)
         VALUES (NOW(), ?, ?, NULL, ?)`,
        [total, idUsuario, nombreCliente]
    );

    return Number(resultado.insertId);
}

async function crearDetalle(conn, idVenta, item) {
    await conn.query(
        `INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario, subtotal)
         VALUES (?, ?, ?, ?, ?)`,
        [idVenta, item.id_producto, item.cantidad, item.precio_unitario, item.subtotal]
    );
}

module.exports = { listar, listarDetalle, crear, crearDetalle };
