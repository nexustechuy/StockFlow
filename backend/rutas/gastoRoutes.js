const express = require("express");
const gastoController = require("../controllers/gastoController");
const { verificarSesion } = require("../middleware/auth");

const router = express.Router();

router.get("/gastos", verificarSesion, gastoController.listar);

module.exports = router;
