const express = require("express");
const compraController = require("../controllers/compraController");
const { verificarSesion, permitirRoles, usarUsuarioDelToken } = require("../middleware/auth");

const router = express.Router();

router.post("/compras", verificarSesion, permitirRoles("administrador"), usarUsuarioDelToken, compraController.crear);
router.get("/compras/pendientes", verificarSesion, permitirRoles("administrador", "repositor"), compraController.listarPendientes);
router.patch("/compras/:id/repuesta", verificarSesion, permitirRoles("administrador", "repositor"), compraController.marcarRepuesta);

module.exports = router;
