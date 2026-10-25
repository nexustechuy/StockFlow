const express = require("express");
const ventaController = require("../controllers/ventaController");
const { verificarSesion, permitirRoles, usarUsuarioDelToken } = require("../middleware/auth");

const router = express.Router();

router.get("/ventas", verificarSesion, permitirRoles("administrador", "vendedor"), ventaController.listar);
router.post("/ventas", verificarSesion, permitirRoles("administrador", "vendedor"), usarUsuarioDelToken, ventaController.crear);
router.get("/detalle-ventas", verificarSesion, permitirRoles("administrador", "vendedor"), ventaController.listarDetalle);

module.exports = router;
