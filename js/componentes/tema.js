/* Aplica el tema guardado en Ajustes en todas las páginas */
document.addEventListener('DOMContentLoaded', function () {
  if (localStorage.getItem('tema') === 'oscuro') {
    document.body.classList.add('tema-oscuro');
  }
});
