const jwt = require("jsonwebtoken");

// Verifica que el pedido traiga un token válido (header Authorization: Bearer <token>).
// Si es válido, deja los datos del usuario en req.usuario.
function verificarSesion(req, res, next) {
    const header = req.headers.authorization || "";
    const [tipo, token] = header.split(" ");

    if (tipo !== "Bearer" || !token) {
        return res.status(401).json({ error: "Necesitás iniciar sesión." });
    }

    try {
        req.usuario = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({ error: "Sesión inválida o vencida." });
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

module.exports = { verificarSesion, permitirRoles, usarUsuarioDelToken };
