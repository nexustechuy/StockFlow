const pool = require("../config/db");

class UsuarioDAO {
    constructor(db) {
        this.db = db;
    }

    async buscarPorMail(mail) {
        return await this.db.query(
            `SELECT
                u.id_usuario,
                u.mail,
                u.nombre,
                u.password,
                u.activo,
                r.nombre AS rol
             FROM usuarios u
             INNER JOIN usuario_rol ur
                 ON u.id_usuario = ur.id_usuario
             INNER JOIN rol r
                 ON ur.id_rol = r.id_rol
             WHERE BINARY u.mail = BINARY ?`,
            [mail]
        );
    }

    async buscarSesion(idUsuario) {
        return await this.db.query(
            `SELECT u.activo, r.nombre AS rol
             FROM usuarios u
             LEFT JOIN usuario_rol ur ON u.id_usuario = ur.id_usuario
             LEFT JOIN rol r ON ur.id_rol = r.id_rol
             WHERE u.id_usuario = ?`,
            [idUsuario]
        );
    }
}

module.exports = new UsuarioDAO(pool);
