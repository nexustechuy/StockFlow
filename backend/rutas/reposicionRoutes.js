const express = require("express");
const reposicionController = require("../controllers/reposicionController");
const { verificarSesion } = require("../middleware/auth");

const router = express.Router();

router.get("/reposiciones", verificarSesion, reposicionController.listar);
router.post("/reposiciones", verificarSesion, reposicionController.crear);

module.exports = router;
