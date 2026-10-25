const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usuarioModel = require("../models/usuarioModel");

// LOGIN
async function login(req, res) {
    try {
        const { mail, password } = req.body;

        console.log("LOGIN RECIBIDO:", mail);

        if (typeof mail !== "string" || typeof password !== "string") {
            return res.status(400).json({ error: "Datos inválidos." });
        }

        const usuarios = await usuarioModel.buscarPorMail(mail);

        const credencialesOk =
            usuarios.length > 0 &&
            await bcrypt.compare(password, usuarios[0].password);

        if (!credencialesOk) {
            return res.status(401).json({
                error: "El correo o la contraseña son incorrectos."
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