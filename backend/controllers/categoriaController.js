const Controller = require("./Controller");
const categoriaModel = require("../models/categoriaModel");

class CategoriaController extends Controller {
    constructor(categoriaModel) {
        super();
        this.categoriaModel = categoriaModel;
    }

    // CATEGORIAS - LISTAR
    async listar(req, res) {
        try {
            const categorias = await this.categoriaModel.listar();

            res.json(categorias);

        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: "Error al obtener las categorías."
            });
        }
    }

    // CATEGORIAS - CREAR
    async crear(req, res) {
        try {
            const { nombre, descripcion } = req.body;

            if (!nombre || !nombre.trim()) {
                return res.status(400).json({
                    error: "El nombre de la categoría es obligatorio."
                });
            }

            const nuevoId = await this.categoriaModel.crear(nombre.trim(), descripcion || null);

            res.status(201).json({
                id_categoria: nuevoId,
                nombre: nombre.trim(),
                descripcion: descripcion || null
            });

        } catch (error) {
            console.error(error);

            if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
                return res.status(409).json({
                    error: "Ya existe una categoría con ese nombre."
                });
            }

            res.status(500).json({
                error: "Error al crear la categoría."
            });
        }
    }

    // CATEGORIAS - ELIMINAR
    async eliminar(req, res) {
        try {
            const { id } = req.params;

            const filasBorradas = await this.categoriaModel.eliminar(id);

            if (filasBorradas === 0) {
                return res.status(404).json({
                    error: "La categoría no existe."
                });
            }

            res.json({ mensaje: "Categoría eliminada correctamente." });

        } catch (error) {
            console.error(error);

            if (error.code === "ER_ROW_IS_REFERENCED_2" || error.errno === 1451) {
                return res.status(409).json({
                    error: "No se puede eliminar: hay productos que usan esta categoría."
                });
            }

            res.status(500).json({
                error: "Error al eliminar la categoría."
            });
        }
    }
}

module.exports = new CategoriaController(categoriaModel);
