const pool = require("../config/db");
const Model = require("./Model");

class CompraModel extends Model {
    async listarPendientes() {
        return await this.db.query(
            `SELECT
                c.id_compra,
                c.fecha_hora,
                GROUP_CONCAT(CONCAT(p.nombre, ' x', dc.cantidad) SEPARATOR ', ') AS productos,
                SUM(dc.cantidad) AS total_unidades
             FROM compra c
             JOIN detalle_compra dc ON dc.id_compra = c.id_compra
             JOIN producto p ON p.id_producto = dc.id_producto
             WHERE c.estado = 'pendiente'
             GROUP BY c.id_compra, c.fecha_hora
             ORDER BY c.fecha_hora ASC`
        );
    }

    async buscarPendiente(conn, id) {
        const compras = await conn.query(
            `SELECT id_compra FROM compra WHERE id_compra = ? AND estado = 'pendiente' FOR UPDATE`,
            [id]
        );
        return compras[0];
    }

    async listarDetalle(conn, id) {
        return await conn.query(
            `SELECT id_producto, cantidad FROM detalle_compra WHERE id_compra = ?`,
            [id]
        );
    }

    async marcarRepuesta(conn, id) {
        await conn.query(
            `UPDATE compra SET estado = 'repuesta' WHERE id_compra = ?`,
            [id]
        );
    }

    async crear(conn, total, idUsuario) {
        const resultado = await conn.query(
            `INSERT INTO compra (id_usuario, fecha_hora, total)
             VALUES (?, NOW(), ?)`,
            [idUsuario, total]
        );

        return Number(resultado.insertId);
    }

    async crearDetalle(conn, idCompra, item) {
        await conn.query(
            `INSERT INTO detalle_compra (id_compra, id_producto, cantidad, costo_unitario, subtotal)
             VALUES (?, ?, ?, ?, ?)`,
            [idCompra, item.id_producto, item.cantidad, item.costo_unitario, item.subtotal]
        );
    }
}

module.exports = new CompraModel(pool);
