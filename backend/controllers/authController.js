const usuarioModel = require("../models/usuarioModel");

// LOGIN
async function login(req, res) {
    try {
        const { mail, password } = req.body;

        console.log("LOGIN RECIBIDO:", mail);

        const usuarios = await usuarioModel.buscarPorCredenciales(mail, password);

        if (usuarios.length === 0) {
            return res.status(401).json({
                error: "El correo o la contraseña son incorrectos."
            });
        }

        const usuario = usuarios[0];

        res.json({
            id_usuario: usuario.id_usuario,
            mail: usuario.mail,
            rol: usuario.rol
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Error al conectar con la base de datos."
        });
    }
}

module.exports = { login };
