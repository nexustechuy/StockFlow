const pool = require("../config/db");
const Model = require("./Model");

const SELECT_PRODUCTO = `
    SELECT
        p.id_producto,
        p.codigo,
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

class ProductoModel extends Model {
    // PRODUCTOS
    async listar() {
        return await this.db.query(SELECT_PRODUCTO);
    }

    async obtenerPorId(id) {
        const productos = await this.db.query(`${SELECT_PRODUCTO} WHERE p.id_producto = ?`, [id]);
        return productos[0];
    }

    async crear({ codigo, nombre, descripcion, precio_compra, precio_venta, stock, stock_minimo, id_categoria }) {
        const resultado = await this.db.query(
            `INSERT INTO producto
                (codigo, nombre, descripcion, precio_compra, precio_venta, stock, stock_minimo, estado_producto, id_categoria)
             VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)`,
            [codigo, nombre, descripcion || null, precio_compra, precio_venta, stock, stock_minimo, id_categoria]
        );

        return Number(resultado.insertId);
    }

    // Actualiza los datos editables del producto (no toca estado_producto)
    async actualizar(id, { codigo, nombre, descripcion, precio_compra, precio_venta, stock, stock_minimo, id_categoria }) {
        await this.db.query(
            `UPDATE producto
             SET codigo = ?,
                 nombre = ?,
                 descripcion = ?,
                 precio_compra = ?,
                 precio_venta = ?,
                 stock = ?,
                 stock_minimo = ?,
                 id_categoria = ?
             WHERE id_producto = ?`,
            [codigo, nombre, descripcion || null, precio_compra, precio_venta, stock, stock_minimo, id_categoria, id]
        );
    }

    // Devuelve cuántas filas se borraron
    async eliminar(id) {
        const resultado = await this.db.query(
            `DELETE FROM producto WHERE id_producto = ?`,
            [id]
        );

        return Number(resultado.affectedRows);
    }

    async buscarPorIds(conn, ids) {
        return await conn.query(
            `SELECT id_producto, nombre, precio_compra, precio_venta, stock
             FROM producto
             WHERE id_producto IN (${ids.map(() => "?").join(",")})`,
            ids
        );
    }

    async restarStock(conn, idProducto, cantidad) {
        await conn.query(
            `UPDATE producto SET stock = stock - ? WHERE id_producto = ?`,
            [cantidad, idProducto]
        );
    }

    async sumarStock(conn, idProducto, cantidad) {
        await conn.query(
            `UPDATE producto SET stock = stock + ? WHERE id_producto = ?`,
            [cantidad, idProducto]
        );
    }

    // VARIANTES
    // En la base cada fila tiene un solo valor y el tipo está en tipo_variante.
    // Al listar se juntan los valores del mismo tipo ("Blanco, Negro") para que el front los reciba como antes.
    async listarVariantes() {
        return await this.db.query(
            `SELECT
                MIN(v.id_variante) AS id_variante,
                t.nombre AS tipo,
                GROUP_CONCAT(v.valor ORDER BY v.id_variante SEPARATOR ', ') AS valor,
                v.id_producto
             FROM variante v
             INNER JOIN tipo_variante t ON v.id_tipo_variante = t.id_tipo_variante
             GROUP BY v.id_producto, t.id_tipo_variante, t.nombre`
        );
    }

    // Busca el tipo (o lo crea si no existe) y guarda una fila por cada valor separado por coma
    async crearVariante(tipo, valor, idProducto) {
        const tipoGuardado = await this.db.query(
            `INSERT INTO tipo_variante (nombre) VALUES (?)
             ON DUPLICATE KEY UPDATE id_tipo_variante = LAST_INSERT_ID(id_tipo_variante)`,
            [tipo.trim()]
        );
        const idTipo = Number(tipoGuardado.insertId);

        const valores = valor.split(",").map(v => v.trim()).filter(v => v !== "");
        let primerId = null;

        for (const unValor of valores) {
            const resultado = await this.db.query(
                `INSERT INTO variante (valor, id_producto, id_tipo_variante) VALUES (?, ?, ?)`,
                [unValor, idProducto, idTipo]
            );
            if (primerId === null) primerId = Number(resultado.insertId);
        }

        return primerId;
    }
}

module.exports = new ProductoModel(pool);
