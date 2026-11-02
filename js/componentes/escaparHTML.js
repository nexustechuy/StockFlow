// Función compartida para meter texto de la base dentro de HTML sin que se interprete como código.
// Sirve para el contenido de las etiquetas y para atributos entre comillas (data-*, title, etc.).
// Uso: `<td>${escaparHTML(producto.nombre)}</td>`
// Se carga en el <head>, justo después de sesion.js, antes del script de la página.
function escaparHTML(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, function (caracter) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[caracter];
    });
}
