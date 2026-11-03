const express = require("express");
const { rateLimit } = require("express-rate-limit");
const authController = require("../controllers/authController");

const router = express.Router();

// Límite de intentos: 10 logins fallidos cada 15 minutos por IP.
// Los logins correctos no cuentan.
const limiteLogin = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    skipSuccessfulRequests: true,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { error: "Demasiados intentos fallidos. Probá de nuevo en unos minutos." }
});

router.post("/login", limiteLogin, authController.login);

module.exports = router;
