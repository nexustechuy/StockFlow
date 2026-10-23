const pool = require("../config/db");

// Busca el usuario con su rol según mail y contraseña
async function buscarPorCredenciales(mail, password) {
    return await pool.query(
        `SELECT
            u.id_usuario,
            u.mail,
            u.password,
            r.nombre AS rol
         FROM usuarios u
         INNER JOIN usuario_rol ur
             ON u.id_usuario = ur.id_usuario
         INNER JOIN rol r
             ON ur.id_rol = r.id_rol
         WHERE BINARY u.mail = BINARY ?
        AND BINARY u.password = BINARY ?`,
        [mail, password]
    );
}

module.exports = { buscarPorCredenciales };
