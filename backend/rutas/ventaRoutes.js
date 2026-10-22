const express = require("express");
const ventaController = require("../controllers/ventaController");
const { verificarSesion } = require("../middleware/auth");

const router = express.Router();

router.get("/ventas", verificarSesion, ventaController.listar);
router.post("/ventas", verificarSesion, ventaController.crear);
router.get("/detalle-ventas", verificarSesion, ventaController.listarDetalle);

module.exports = router;
