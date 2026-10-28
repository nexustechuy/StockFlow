const express = require("express");
const categoriaController = require("../controllers/categoriaController");
const { verificarSesion, permitirRoles } = require("../middleware/auth");

const router = express.Router();

router.get("/categorias", verificarSesion, categoriaController.listar);
router.post("/categorias", verificarSesion, permitirRoles("administrador"), categoriaController.crear);
router.delete("/categorias/:id", verificarSesion, permitirRoles("administrador"), categoriaController.eliminar);

module.exports = router;
