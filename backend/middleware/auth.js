const jwt = require("jsonwebtoken");
const pool = require("../config/db");

async function verificarSesion(req, res, next) {
    const header = req.headers.authorization || "";
    const [tipo, token] = header.split(" ");

    if (tipo !== "Bearer" || !token) {
        return res.status(401).json({ error: "Necesitás iniciar sesión." });
    }

    let datos;

    try {
        datos = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
    } catch (error) {
        return res.status(401).json({ error: "Sesión inválida o vencida." });
    }

    try {
        const filas = await pool.query(
            `SELECT u.activo, r.nombre AS rol
             FROM usuarios u
             LEFT JOIN usuario_rol ur ON u.id_usuario = ur.id_usuario
             LEFT JOIN rol r ON ur.id_rol = r.id_rol
             WHERE u.id_usuario = ?`,
            [datos.id_usuario]
        );

        if (filas.length === 0 || Number(filas[0].activo) !== 1) {
            return res.status(401).json({ error: "Tu usuario está desactivado o ya no existe." });
        }

        const rolesAsignados = filas.map(f => f.rol).filter(Boolean);

        if (!rolesAsignados.includes(datos.rol)) {
            return res.status(401).json({ error: "Sesión inválida o vencida." });
        }

        req.usuario = { ...datos, roles: [datos.rol], rolesAsignados };
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al verificar la sesión." });
    }
}

// Deja pasar solo a los roles indicados. Se usa DESPUÉS de verificarSesion.
// Ejemplo: permitirRoles("administrador", "vendedor")
function permitirRoles(...rolesPermitidos) {
    const permitidos = rolesPermitidos.map(r => r.toLowerCase());

    return (req, res, next) => {
        const roles = (req.usuario?.roles || []).map(r => String(r).toLowerCase());

        if (!roles.some(r => permitidos.includes(r))) {
            return res.status(403).json({ error: "No tenés permiso para hacer esto." });
        }
        next();
    };
}

// El id del usuario que registra una venta o reposición sale del token,
// no de lo que mande el front (así nadie puede registrar a nombre de otro).
function usarUsuarioDelToken(req, res, next) {
    req.body = req.body || {};
    req.body.id_usuario = req.usuario.id_usuario;
    next();
}

// ¿El usuario del pedido tiene rol de administrador? (req.usuario lo arma verificarSesion)
function esAdministrador(req) {
    return Array.isArray(req.usuario?.roles) && req.usuario.roles.includes("administrador");
}

module.exports = { esAdministrador, verificarSesion, permitirRoles, usarUsuarioDelToken };
