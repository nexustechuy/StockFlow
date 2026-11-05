const pool = require("../config/db");
const Model = require("./Model");

// Usuario con sus roles juntos en un solo texto ("administrador,vendedor").
// Nunca devuelve la contraseña.
const SELECT_USUARIO = `
    SELECT
        u.id_usuario,
        u.mail,
        u.nombre,
        u.activo,
        GROUP_CONCAT(r.nombre ORDER BY r.id_rol SEPARATOR ',') AS roles
     FROM usuarios u
     LEFT JOIN usuario_rol ur ON u.id_usuario = ur.id_usuario
     LEFT JOIN rol r ON ur.id_rol = r.id_rol`;

class UsuarioModel extends Model {
    // Busca el usuario con su rol según el mail.
    // La contraseña se verifica aparte, con bcrypt (en authController).
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

    async listar() {
        return await this.db.query(`${SELECT_USUARIO} GROUP BY u.id_usuario ORDER BY u.id_usuario`);
    }

    async obtenerPorId(id, conn = this.db) {
        const usuarios = await conn.query(
            `${SELECT_USUARIO} WHERE u.id_usuario = ? GROUP BY u.id_usuario`,
            [id]
        );
        return usuarios[0];
    }

    // ¿Ya hay otro usuario con ese mail? (excluirId sirve al editar)
    async mailEnUso(mail, excluirId = null) {
        const filas = await this.db.query(
            `SELECT id_usuario FROM usuarios WHERE mail = ? AND id_usuario <> ?`,
            [mail, excluirId ?? 0]
        );
        return filas.length > 0;
    }

    // Devuelve [{ id_rol, nombre }] de los roles que existen entre los pedidos
    async buscarRoles(nombres) {
        return await this.db.query(
            `SELECT id_rol, nombre FROM rol WHERE nombre IN (${nombres.map(() => "?").join(",")})`,
            nombres
        );
    }

    async crear(conn, { mail, passwordHash, nombre, activo }) {
        const resultado = await conn.query(
            `INSERT INTO usuarios (mail, password, nombre, activo) VALUES (?, ?, ?, ?)`,
            [mail, passwordHash, nombre, activo]
        );

        return Number(resultado.insertId);
    }

    // Si passwordHash es null, la contraseña no se toca
    async actualizar(conn, id, { mail, passwordHash, nombre, activo }) {
        if (passwordHash) {
            await conn.query(
                `UPDATE usuarios SET mail = ?, nombre = ?, activo = ?, password = ? WHERE id_usuario = ?`,
                [mail, nombre, activo, passwordHash, id]
            );
        } else {
            await conn.query(
                `UPDATE usuarios SET mail = ?, nombre = ?, activo = ? WHERE id_usuario = ?`,
                [mail, nombre, activo, id]
            );
        }
    }

    async reemplazarRoles(conn, idUsuario, idsRol) {
        await conn.query(`DELETE FROM usuario_rol WHERE id_usuario = ?`, [idUsuario]);

        for (const idRol of idsRol) {
            await conn.query(
                `INSERT INTO usuario_rol (id_usuario, id_rol) VALUES (?, ?)`,
                [idUsuario, idRol]
            );
        }
    }

    // Devuelve cuántas filas se modificaron
    async cambiarEstado(id, activo) {
        const resultado = await this.db.query(
            `UPDATE usuarios SET activo = ? WHERE id_usuario = ?`,
            [activo, id]
        );

        return Number(resultado.affectedRows);
    }
}

module.exports = new UsuarioModel(pool);
