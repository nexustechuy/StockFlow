const express = require("express");
const productoController = require("../controllers/productoController");
const { verificarSesion, permitirRoles } = require("../middleware/auth");

const router = express.Router();

// PRODUCTOS
router.get("/productos", verificarSesion, productoController.listar);
router.post("/productos", verificarSesion, permitirRoles("administrador"), productoController.crear);
router.delete("/productos/:id", verificarSesion, permitirRoles("administrador"), productoController.eliminar);

// VARIANTES
router.get("/variantes", verificarSesion, productoController.listarVariantes);
router.post("/variantes", verificarSesion, permitirRoles("administrador"), productoController.crearVariante);

module.exports = router;
