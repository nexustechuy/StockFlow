const express = require("express");
const productoController = require("../controllers/productoController");
const { verificarSesion } = require("../middleware/auth");

const router = express.Router();

// PRODUCTOS
router.get("/productos", verificarSesion, productoController.listar);
router.post("/productos", verificarSesion, productoController.crear);
router.delete("/productos/:id", verificarSesion, productoController.eliminar);

// VARIANTES
router.get("/variantes", verificarSesion, productoController.listarVariantes);
router.post("/variantes", verificarSesion, productoController.crearVariante);

module.exports = router;
