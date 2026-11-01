const express = require("express");
const usuarioController = require("../controllers/usuarioController");
const { verificarSesion, permitirRoles } = require("../middleware/auth");

const router = express.Router();

// Solo el administrador gestiona usuarios
router.get("/usuarios", verificarSesion, permitirRoles("administrador"), usuarioController.listar);
router.post("/usuarios", verificarSesion, permitirRoles("administrador"), usuarioController.crear);
router.put("/usuarios/:id", verificarSesion, permitirRoles("administrador"), usuarioController.editar);
router.patch("/usuarios/:id/estado", verificarSesion, permitirRoles("administrador"), usuarioController.cambiarEstado);

module.exports = router;
