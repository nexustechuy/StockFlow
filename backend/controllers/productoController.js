const Controller = require("./Controller");
const productoModel = require("../models/productoModel");
const { esAdministrador } = require("../middleware/auth");

// Límites de las columnas de la tabla producto
const MAX_CODIGO = 50;
const MAX_NOMBRE = 100;
const MAX_DESCRIPCION = 600;

class ProductoController extends Controller {
    constructor(productoModel) {
        super();
        this.productoModel = productoModel;
    }

    esNumero(valor) {
        return valor !== undefined && valor !== null && String(valor).trim() !== "" && Number.isFinite(Number(valor));
    }

    // Valida los datos de un producto (sirve para crear y para editar).
    // Devuelve { error } si algo está mal, o { datos } con los valores ya limpios.
    validarProducto(body) {
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

        if (![precio_compra, precio_venta, stock, stock_minimo, id_categoria].every(this.esNumero)) {
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
    responderErrorGuardado(error, res, mensajeGenerico) {
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

    // PRODUCTOS - LISTAR
    async listar(req, res) {
        try {
            const productos = await this.productoModel.listar();

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

    // PRODUCTOS - CREAR
    async crear(req, res) {
        try {
            const { error, datos } = this.validarProducto(req.body);

            if (error) {
                return res.status(400).json({ error });
            }

            const nuevoId = await this.productoModel.crear(datos);
            const productoCreado = await this.productoModel.obtenerPorId(nuevoId);

            res.status(201).json(productoCreado);

        } catch (error) {
            this.responderErrorGuardado(error, res, "Error al guardar el producto.");
        }
    }

    // PRODUCTOS - EDITAR
    async editar(req, res) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id < 1) {
                return res.status(400).json({ error: "Producto inválido." });
            }

            const { error, datos } = this.validarProducto(req.body);

            if (error) {
                return res.status(400).json({ error });
            }

            const existente = await this.productoModel.obtenerPorId(id);

            if (!existente) {
                return res.status(404).json({ error: "El producto no existe." });
            }

            await this.productoModel.actualizar(id, datos);

            const productoEditado = await this.productoModel.obtenerPorId(id);

            res.json(productoEditado);

        } catch (error) {
            this.responderErrorGuardado(error, res, "Error al editar el producto.");
        }
    }

    // PRODUCTOS - ELIMINAR
    async eliminar(req, res) {
        try {
            const { id } = req.params;

            const filasBorradas = await this.productoModel.eliminar(id);

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
    async listarVariantes(req, res) {
        try {
            const variantes = await this.productoModel.listarVariantes();

            res.json(variantes);

        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: "Error al obtener las variantes."
            });
        }
    }

    // VARIANTES - CREAR
    async crearVariante(req, res) {
        try {
            const { tipo, valor, id_producto } = req.body;

            if (!tipo || !valor || !id_producto) {
                return res.status(400).json({
                    error: "Faltan datos obligatorios para crear la variante."
                });
            }

            const nuevoId = await this.productoModel.crearVariante(tipo, valor, id_producto);

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
}

module.exports = new ProductoController(productoModel);
