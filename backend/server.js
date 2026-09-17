const express = require("express");
const mariadb = require("mariadb");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());


// CONEXIÓN CON MARIADB
const pool = mariadb.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "stockflow",
    connectionLimit: 5
});


// RUTA DE PRUEBA PRINCIPAL
app.get("/", (req, res) => {
    res.send("StockFlow conectado correctamente a MariaDB");
});


// LOGIN
app.post("/login", async (req, res) => {
    let conn;

    try {
        const { mail, password } = req.body;

        console.log("LOGIN RECIBIDO:", mail, password);

        conn = await pool.getConnection();

        const usuarios = await conn.query(
            `SELECT 
                u.id_usuario,
                u.mail,
                u.password,
                r.nombre AS rol
             FROM usuarios u
             INNER JOIN usuario_rol ur
                 ON u.id_usuario = ur.id_usuario
             INNER JOIN rol r
                 ON ur.id_rol = r.id_rol
             WHERE u.mail = ? AND u.password = ?`,
            [mail, password]
        );

        if (usuarios.length === 0) {
            return res.status(401).json({
                error: "El correo o la contraseña son incorrectos."
            });
        }

        const usuario = usuarios[0];

        res.json({
            id_usuario: usuario.id_usuario,
            mail: usuario.mail,
            rol: usuario.rol
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Error al conectar con la base de datos."
        });

    } finally {
        if (conn) {
            conn.release();
        }
    }
});


// PRODUCTOS - LISTAR
app.get("/productos", async (req, res) => {
    let conn;

    try {
        conn = await pool.getConnection();

        const productos = await conn.query(
            `SELECT
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
                 ON p.id_categoria = c.id_categoria`
        );

        res.json(productos);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Error al obtener los productos."
        });

    } finally {
        if (conn) {
            conn.release();
        }
    }
});


// PRODUCTOS - CREAR
app.post("/productos", async (req, res) => {
    let conn;

    try {
        const {
            nombre,
            descripcion,
            precio_compra,
            precio_venta,
            stock,
            stock_minimo,
            id_categoria
        } = req.body;

        // Validación básica de campos obligatorios
        if (
            !nombre ||
            precio_compra === undefined ||
            precio_venta === undefined ||
            stock === undefined ||
            stock_minimo === undefined ||
            !id_categoria
        ) {
            return res.status(400).json({
                error: "Faltan datos obligatorios para crear el producto."
            });
        }

        conn = await pool.getConnection();

        const resultado = await conn.query(
            `INSERT INTO producto
                (nombre, descripcion, precio_compra, precio_venta, stock, stock_minimo, estado_producto, id_categoria)
             VALUES (?, ?, ?, ?, ?, ?, 1, ?)`,
            [nombre, descripcion || null, precio_compra, precio_venta, stock, stock_minimo, id_categoria]
        );

        const nuevoId = Number(resultado.insertId);

        const productoCreado = await conn.query(
            `SELECT
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
                 ON p.id_categoria = c.id_categoria
             WHERE p.id_producto = ?`,
            [nuevoId]
        );

        res.status(201).json(productoCreado[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Error al guardar el producto."
        });

    } finally {
        if (conn) {
            conn.release();
        }
    }
});


// PRODUCTOS - ELIMINAR
app.delete("/productos/:id", async (req, res) => {
    let conn;

    try {
        const { id } = req.params;

        conn = await pool.getConnection();

        const resultado = await conn.query(
            `DELETE FROM producto WHERE id_producto = ?`,
            [id]
        );

        if (Number(resultado.affectedRows) === 0) {
            return res.status(404).json({
                error: "El producto no existe."
            });
        }

        res.json({ mensaje: "Producto eliminado correctamente." });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Error al eliminar el producto."
        });

    } finally {
        if (conn) {
            conn.release();
        }
    }
});


// VARIANTES - LISTAR
app.get("/variantes", async (req, res) => {
    let conn;

    try {
        conn = await pool.getConnection();

        const variantes = await conn.query(
            `SELECT id_variante, tipo, valor, id_producto FROM variante`
        );

        res.json(variantes);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Error al obtener las variantes."
        });

    } finally {
        if (conn) {
            conn.release();
        }
    }
});


// VARIANTES - CREAR
app.post("/variantes", async (req, res) => {
    let conn;

    try {
        const { tipo, valor, id_producto } = req.body;

        if (!tipo || !valor || !id_producto) {
            return res.status(400).json({
                error: "Faltan datos obligatorios para crear la variante."
            });
        }

        conn = await pool.getConnection();

        const resultado = await conn.query(
            `INSERT INTO variante (tipo, valor, id_producto) VALUES (?, ?, ?)`,
            [tipo, valor, id_producto]
        );

        res.status(201).json({
            id_variante: Number(resultado.insertId),
            tipo,
            valor,
            id_producto
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Error al guardar la variante."
        });

    } finally {
        if (conn) {
            conn.release();
        }
    }
});


// CATEGORIAS - LISTAR
app.get("/categorias", async (req, res) => {
    let conn;

    try {
        conn = await pool.getConnection();

        const categorias = await conn.query(
            `SELECT id_categoria, nombre, descripcion
             FROM categoria
             ORDER BY nombre`
        );

        res.json(categorias);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Error al obtener las categorías."
        });

    } finally {
        if (conn) {
            conn.release();
        }
    }
});


// CATEGORIAS - CREAR
app.post("/categorias", async (req, res) => {
    let conn;

    try {
        const { nombre, descripcion } = req.body;

        if (!nombre || !nombre.trim()) {
            return res.status(400).json({
                error: "El nombre de la categoría es obligatorio."
            });
        }

        conn = await pool.getConnection();

        const resultado = await conn.query(
            `INSERT INTO categoria (nombre, descripcion) VALUES (?, ?)`,
            [nombre.trim(), descripcion || null]
        );

        const nuevoId = Number(resultado.insertId);

        res.status(201).json({
            id_categoria: nuevoId,
            nombre: nombre.trim(),
            descripcion: descripcion || null
        });

    } catch (error) {
        console.error(error);

        // La columna "nombre" es UNIQUE en la tabla categoria
        if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
            return res.status(409).json({
                error: "Ya existe una categoría con ese nombre."
            });
        }

        res.status(500).json({
            error: "Error al crear la categoría."
        });

    } finally {
        if (conn) {
            conn.release();
        }
    }
});


// CATEGORIAS - ELIMINAR
app.delete("/categorias/:id", async (req, res) => {
    let conn;

    try {
        const { id } = req.params;

        conn = await pool.getConnection();

        const resultado = await conn.query(
            `DELETE FROM categoria WHERE id_categoria = ?`,
            [id]
        );

        if (Number(resultado.affectedRows) === 0) {
            return res.status(404).json({
                error: "La categoría no existe."
            });
        }

        res.json({ mensaje: "Categoría eliminada correctamente." });

    } catch (error) {
        console.error(error);

        // Si la categoría tiene productos asociados, MariaDB rechaza el borrado
        // por la clave foránea (id_categoria en producto).
        if (error.code === "ER_ROW_IS_REFERENCED_2" || error.errno === 1451) {
            return res.status(409).json({
                error: "No se puede eliminar: hay productos que usan esta categoría."
            });
        }

        res.status(500).json({
            error: "Error al eliminar la categoría."
        });

    } finally {
        if (conn) {
            conn.release();
        }
    }
});


// VENTAS - LISTAR
app.get("/ventas", async (req, res) => {
    let conn;

    try {
        conn = await pool.getConnection();

        const ventas = await conn.query(
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

        res.json(ventas);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Error al obtener las ventas."
        });

    } finally {
        if (conn) {
            conn.release();
        }
    }
});


// DETALLE DE VENTA - LISTAR
app.get("/detalle-ventas", async (req, res) => {
    let conn;

    try {
        conn = await pool.getConnection();

        const detalle = await conn.query(
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

        res.json(detalle);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Error al obtener el detalle de las ventas."
        });

    } finally {
        if (conn) {
            conn.release();
        }
    }
});


// INICIAR SERVIDOR
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});