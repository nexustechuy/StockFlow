const express = require("express");
const usuarioController = require("../controllers/usuarioController");
const { verificarSesion } = require("../middleware/auth");

const router = express.Router();

// Todavía no hay rutas de usuarios, cuando se hagan van acá

module.exports = router;
