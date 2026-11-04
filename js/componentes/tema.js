/* Aplica el tema guardado en Ajustes en todas las páginas */
try {
  if (localStorage.getItem('tema') === 'oscuro') {
    document.body.classList.add('tema-oscuro');
  }

  if (localStorage.getItem('idioma') === 'en') {
    document.body.style.visibility = 'hidden';
    setTimeout(function () {
      document.body.style.visibility = '';
    }, 2000);
  }
} catch (error) {
  document.body.style.visibility = '';
}
