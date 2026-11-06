const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { rateLimit } = require("express-rate-limit");
const Controller = require("../controllers/Controller");
const usuarioDAO = require("../dao/UsuarioDAO");
const { verificarSesion } = require("../middleware/auth");

const limiteLogin = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 5,
    skipSuccessfulRequests: true,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { error: "Demasiados intentos fallidos. Probá de nuevo en unos minutos." }
});

class AuthApi extends Controller {
    constructor(usuarioDAO) {
        super();
        this.usuarioDAO = usuarioDAO;
    }

    mensajeConIntentos(req) {
        const mensaje = "El correo o la contraseña son incorrectos.";
        const restantes = req.rateLimit?.remaining;

        if (restantes === undefined) {
            return mensaje;
        }
        if (restantes === 0) {
            return mensaje + " No te quedan más intentos, probá de nuevo en unos minutos.";
        }
        return mensaje + (restantes === 1 ? " 1 intento restante." : ` ${restantes} intentos restantes.`);
    }

    crearToken(idUsuario, mail, rol) {
        return jwt.sign(
            { id_usuario: idUsuario, mail, rol },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );
    }

    async login(req, res) {
        try {
            const { mail, password } = req.body || {};

            if (typeof mail !== "string" || typeof password !== "string") {
                return res.status(400).json({ error: "Datos inválidos." });
            }

            const usuarios = await this.usuarioDAO.buscarPorMail(mail);

            const credencialesOk =
                usuarios.length > 0 &&
                await bcrypt.compare(password, usuarios[0].password);

            if (!credencialesOk) {
                return res.status(401).json({
                    error: this.mensajeConIntentos(req)
                });
            }

            if (Number(usuarios[0].activo) !== 1) {
                return res.status(403).json({
                    error: "Tu usuario está desactivado. Pedile al administrador que lo active."
                });
            }

            const usuario = usuarios[0];
            const roles = usuarios.map(u => u.rol);
            const token = this.crearToken(usuario.id_usuario, usuario.mail, usuario.rol);

            res.json({
                id_usuario: usuario.id_usuario,
                mail: usuario.mail,
                nombre: usuario.nombre,
                rol: usuario.rol,
                roles,
                token
            });

        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: "Error al conectar con la base de datos."
            });
        }
    }

    cambiarRol(req, res) {
        const { rol } = req.body || {};

        if (typeof rol !== "string" || !req.usuario.rolesAsignados.includes(rol)) {
            return res.status(403).json({ error: "No tenés asignado ese rol." });
        }

        const token = this.crearToken(req.usuario.id_usuario, req.usuario.mail, rol);

        res.json({ rol, token });
    }

    rutas() {
        const router = express.Router();

        router.post("/login", limiteLogin, this.login);
        router.post("/cambiar-rol", verificarSesion, this.cambiarRol);

        return router;
    }
}

module.exports = new AuthApi(usuarioDAO).rutas();
