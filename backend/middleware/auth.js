// VERIFICACIÓN DE SESIÓN
// Todavía no hay sesiones, cuando existan, acá se chequea antes de entrar a las rutas
function verificarSesion(req, res, next) {
    next();
}

module.exports = { verificarSesion };
