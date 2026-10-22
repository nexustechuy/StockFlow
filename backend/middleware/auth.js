// VERIFICACIÓN DE SESIÓN
// Todavía no hay sesiones, así que deja pasar todo.
// Cuando exista la sesión, acá se chequea antes de entrar a las rutas protegidas.
function verificarSesion(req, res, next) {
    next();
}

module.exports = { verificarSesion };
