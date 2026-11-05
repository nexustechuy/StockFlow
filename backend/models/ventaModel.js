const pool = require("../config/db");
const Model = require("./Model");

class VentaModel extends Model {
    // Si recibe idUsuario, devuelve solo las ventas de ese usuario
    async listar(idUsuario = null) {
        const filtro = idUsuario === null ? "" : "WHERE v.id_usuario = ?";

        return await this.db.query(
            `SELECT
                v.id_venta,
                v.fecha_hora,
                v.total,
                v.id_usuario,
                u.nombre AS vendedor,
                v.nombre_cliente
             FROM venta v
             LEFT JOIN usuarios u ON v.id_usuario = u.id_usuario
             ${filtro}
             ORDER BY v.fecha_hora DESC`,
            idUsuario === null ? [] : [idUsuario]
        );
    }

    // Si recibe idUsuario, devuelve solo el detalle de las ventas de ese usuario.
    // El costo (precio_compra) se incluye solo si incluirCosto es true (administrador).
    async listarDetalle(idUsuario = null, incluirCosto = false) {
        const filtro = idUsuario === null ? "" : "WHERE v.id_usuario = ?";
        const costo = incluirCosto ? "p.precio_compra," : "";

        return await this.db.query(
            `SELECT
                dv.id_detalle_venta,
                dv.id_venta,
                dv.id_producto,
                dv.cantidad,
                dv.precio_unitario,
                dv.subtotal,
                p.nombre AS producto_nombre,
                ${costo}
                p.id_categoria,
                cat.nombre AS categoria
             FROM detalle_venta dv
             INNER JOIN venta v ON dv.id_venta = v.id_venta
             INNER JOIN producto p ON dv.id_producto = p.id_producto
             LEFT JOIN categoria cat ON p.id_categoria = cat.id_categoria
             ${filtro}`,
            idUsuario === null ? [] : [idUsuario]
        );
    }

    async crear(conn, total, idUsuario, nombreCliente) {
        const resultado = await conn.query(
            `INSERT INTO venta (fecha_hora, total, id_usuario, nombre_cliente)
             VALUES (NOW(), ?, ?, ?)`,
            [total, idUsuario, nombreCliente]
        );

        return Number(resultado.insertId);
    }

    async crearDetalle(conn, idVenta, item) {
        await conn.query(
            `INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario, subtotal)
             VALUES (?, ?, ?, ?, ?)`,
            [idVenta, item.id_producto, item.cantidad, item.precio_unitario, item.subtotal]
        );
    }
}

module.exports = new VentaModel(pool);
