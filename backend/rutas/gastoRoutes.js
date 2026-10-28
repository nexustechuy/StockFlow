const express = require("express");
const gastoController = require("../controllers/gastoController");
const { verificarSesion, permitirRoles } = require("../middleware/auth");

const router = express.Router();

router.get("/gastos", verificarSesion, permitirRoles("administrador"), gastoController.listar);

module.exports = router;