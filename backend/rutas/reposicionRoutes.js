const express = require("express");
const reposicionController = require("../controllers/reposicionController");
const { verificarSesion, permitirRoles, usarUsuarioDelToken } = require("../middleware/auth");

const router = express.Router();

router.get("/reposiciones", verificarSesion, permitirRoles("administrador", "repositor"), reposicionController.listar);
router.post("/reposiciones", verificarSesion, permitirRoles("administrador", "repositor"), usarUsuarioDelToken, reposicionController.crear);

module.exports = router;
