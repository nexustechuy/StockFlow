const express = require("express");
const categoriaController = require("../controllers/categoriaController");
const { verificarSesion } = require("../middleware/auth");

const router = express.Router();

router.get("/categorias", verificarSesion, categoriaController.listar);
router.post("/categorias", verificarSesion, categoriaController.crear);
router.delete("/categorias/:id", verificarSesion, categoriaController.eliminar);

module.exports = router;
