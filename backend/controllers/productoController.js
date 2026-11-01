const productoModel = require("../models/productoModel");
const { esAdministrador } = require("../middleware/auth");

// PRODUCTOS - LISTAR
async function listar(req, res) {
    try {
        const productos = await productoModel.listar();

        // El costo de compra lo ve solo el administrador
        if (!esAdministrador(req)) {
            return res.json(productos.map(({ precio_compra, ...producto }) => producto));
        }

        res.json(productos);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Error al obtener los productos."
        });
    }
}

// Límites de las columnas de la tabla producto
const MAX_CODIGO = 50;
const MAX_NOMBRE = 100;
const MAX_DESCRIPCION = 600;

function esNumero(valor) {
    return valor !== undefined && valor !== null && String(valor).trim() !== "" && Number.isFinite(Number(valor));
}

// Valida los datos de un producto (sirve para crear y para editar).
// Devuelve { error } si algo está mal, o { datos } con los valores ya limpios.
function validarProducto(body) {
    const { codigo, nombre, descripcion, precio_compra, precio_venta, stock, stock_minimo, id_categoria } = body || {};

    const codigoLimpio = String(codigo ?? "").trim();
    const nombreLimpio = String(nombre ?? "").trim();
    const descripcionLimpia = String(descripcion ?? "").trim();

    if (!codigoLimpio) {
        return { error: "Ingresá el código de barras." };
    }
    if (!/^[0-9]+$/.test(codigoLimpio)) {
        return { error: "El código de barras solo puede tener números." };
    }
    if (codigoLimpio.length > MAX_CODIGO) {
        return { error: `El código de barras no puede superar los ${MAX_CODIGO} dígitos.` };
    }

    if (!nombreLimpio) {
        return { error: "Ingresá el nombre del producto." };
    }
    if (nombreLimpio.length > MAX_NOMBRE) {
        return { error: `El nombre no puede superar los ${MAX_NOMBRE} caracteres.` };
    }
    if (descripcionLimpia.length > MAX_DESCRIPCION) {
        return { error: `La descripción no puede superar los ${MAX_DESCRIPCION} caracteres.` };
    }

    if (![precio_compra, precio_venta, stock, stock_minimo, id_categoria].every(esNumero)) {
        return { error: "Faltan datos obligatorios del producto." };
    }

    if (Number(precio_compra) < 0 || Number(precio_venta) < 0) {
        return { error: "Los precios no pueden ser negativos." };
    }
    if (Number(precio_venta) < Number(precio_compra)) {
        return { error: "El precio de venta no puede ser menor al de compra." };
    }
    if (!Number.isInteger(Number(stock)) || !Number.isInteger(Number(stock_minimo))
        || Number(stock) < 0 || Number(stock_minimo) < 0) {
        return { error: "El stock y el stock mínimo tienen que ser números enteros, sin negativos." };
    }
    if (!Number.isInteger(Number(id_categoria)) || Number(id_categoria) < 1) {
        return { error: "Seleccioná una categoría." };
    }

    return {
        datos: {
            codigo: codigoLimpio,
            nombre: nombreLimpio,
            descripcion: descripcionLimpia || null,
            precio_compra: Number(precio_compra),
            precio_venta: Number(precio_venta),
            stock: Number(stock),
            stock_minimo: Number(stock_minimo),
            id_categoria: Number(id_categoria)
        }
    };
}

// Errores de la base al guardar un producto (crear o editar)
function responderErrorGuardado(error, res, mensajeGenerico) {
    console.error(error);

    // La única columna UNIQUE de producto (además de la clave) es codigo
    if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
        return res.status(409).json({
            error: "Ya existe un producto con ese código de barras."
        });
    }

    if (error.code === "ER_NO_REFERENCED_ROW_2" || error.errno === 1452) {
        return res.status(400).json({
            error: "La categoría seleccionada no existe."
        });
    }

    res.status(500).json({ error: mensajeGenerico });
}

// PRODUCTOS - CREAR
async function crear(req, res) {
    try {
        const { error, datos } = validarProducto(req.body);

        if (error) {
            return res.status(400).json({ error });
        }

        const nuevoId = await productoModel.crear(datos);
        const productoCreado = await productoModel.obtenerPorId(nuevoId);

        res.status(201).json(productoCreado);

    } catch (error) {
        responderErrorGuardado(error, res, "Error al guardar el producto.");
    }
}

// PRODUCTOS - EDITAR
async function editar(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({ error: "Producto inválido." });
        }

        const { error, datos } = validarProducto(req.body);

        if (error) {
            return res.status(400).json({ error });
        }

        const existente = await productoModel.obtenerPorId(id);

        if (!existente) {
            return res.status(404).json({ error: "El producto no existe." });
        }

        await productoModel.actualizar(id, datos);

        const productoEditado = await productoModel.obtenerPorId(id);

        res.json(productoEditado);

    } catch (error) {
        responderErrorGuardado(error, res, "Error al editar el producto.");
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

module.exports = { listar, crear, editar, eliminar, listarVariantes, crearVariante };
