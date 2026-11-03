const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usuarioModel = require("../models/usuarioModel");

function mensajeConIntentos(req) {
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

// LOGIN
async function login(req, res) {
    try {
        const { mail, password } = req.body;

        if (typeof mail !== "string" || typeof password !== "string") {
            return res.status(400).json({ error: "Datos inválidos." });
        }

        const usuarios = await usuarioModel.buscarPorMail(mail);

        const credencialesOk =
            usuarios.length > 0 &&
            await bcrypt.compare(password, usuarios[0].password);

        if (!credencialesOk) {
            return res.status(401).json({
                error: mensajeConIntentos(req)
            });
        }

        // Los usuarios desactivados no pueden ingresar
        if (Number(usuarios[0].activo) !== 1) {
            return res.status(403).json({
                error: "Tu usuario está desactivado. Pedile al administrador que lo active."
            });
        }

        const usuario = usuarios[0];
        // Un usuario puede tener más de un rol (tabla usuario_rol)
        const roles = usuarios.map(u => u.rol);

        const token = jwt.sign(
            { id_usuario: usuario.id_usuario, mail: usuario.mail, roles },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );

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

module.exports = { login };
