const productoModel = require("../models/productoModel");

// PRODUCTOS - LISTAR
async function listar(req, res) {
    try {
        const productos = await productoModel.listar();

        res.json(productos);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Error al obtener los productos."
        });
    }
}

// PRODUCTOS - CREAR
async function crear(req, res) {
    try {
        const {
            nombre,
            precio_compra,
            precio_venta,
            stock,
            stock_minimo,
            id_categoria
        } = req.body;

        // Validación de campos obligatorios
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

        const nuevoId = await productoModel.crear(req.body);
        const productoCreado = await productoModel.obtenerPorId(nuevoId);

        res.status(201).json(productoCreado);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Error al guardar el producto."
        });
    }
}

// PRODUCTOS - ELIMINAR
async function eliminar(req, res) {
    try {
        const { id } = req.params;

        const filasBorradas = await productoModel.eliminar(id);

        if (filasBorradas === 0) {
            return res.status(404).json({
                error: "El producto no existe."
            });
        }

        res.json({ mensaje: "Producto eliminado correctamente." });

    } catch (error) {
        console.error(error);

        if (error.code === "ER_ROW_IS_REFERENCED_2" || error.errno === 1451) {
            return res.status(409).json({
                error: "No se puede eliminar: el producto tiene ventas, reposiciones o variantes asociadas."
            });
        }

        res.status(500).json({
            error: "Error al eliminar el producto."
        });
    }
}

// VARIANTES - LISTAR
async function listarVariantes(req, res) {
    try {
        const variantes = await productoModel.listarVariantes();

        res.json(variantes);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Error al obtener las variantes."
        });
    }
}

// VARIANTES - CREAR
async function crearVariante(req, res) {
    try {
        const { tipo, valor, id_producto } = req.body;

        if (!tipo || !valor || !id_producto) {
            return res.status(400).json({
                error: "Faltan datos obligatorios para crear la variante."
            });
        }

        const nuevoId = await productoModel.crearVariante(tipo, valor, id_producto);

        res.status(201).json({
            id_variante: nuevoId,
            tipo,
            valor,
            id_producto
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Error al guardar la variante."
        });
    }
}

module.exports = { listar, crear, eliminar, listarVariantes, crearVariante };
