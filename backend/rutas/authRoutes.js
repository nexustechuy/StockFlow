const express = require("express");
const { rateLimit } = require("express-rate-limit");
const authController = require("../controllers/authController");
const { verificarSesion } = require("../middleware/auth");

const router = express.Router();

//LÍMITE DE INTENTOS: 5 logins fallidos cada 5 minutos por IP
const limiteLogin = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 5,
    skipSuccessfulRequests: true,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { error: "Demasiados intentos fallidos. Probá de nuevo en unos minutos." }
});

router.post("/login", limiteLogin, authController.login);
router.post("/cambiar-rol", verificarSesion, authController.cambiarRol);

module.exports = router;
