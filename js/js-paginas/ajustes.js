document.addEventListener('DOMContentLoaded', function () {

  const botonesTema = document.querySelectorAll('[data-tema]');
  const botonesIdioma = document.querySelectorAll('[data-idioma]');

  let temaGuardado = localStorage.getItem('tema');
  let idiomaGuardado = localStorage.getItem('idioma');

  if (temaGuardado === null) {
    temaGuardado = 'claro';
  }
  if (idiomaGuardado === null) {
    idiomaGuardado = 'es';
  }

  // Botón activo
  function marcarActivo(botones, atributo, valor) {
    for (let i = 0; i < botones.length; i++) {
      if (botones[i].getAttribute(atributo) === valor) {
        botones[i].classList.add('activo');
      } else {
        botones[i].classList.remove('activo');
      }
    }
  }

  // Agrega o quita la clase del modo oscuro en el body
  function aplicarTema(tema) {
    if (tema === 'oscuro') {
      document.body.classList.add('tema-oscuro');
    } else {
      document.body.classList.remove('tema-oscuro');
    }
    marcarActivo(botonesTema, 'data-tema', tema);
  }

  aplicarTema(temaGuardado);
  marcarActivo(botonesIdioma, 'data-idioma', idiomaGuardado);

  for (let i = 0; i < botonesTema.length; i++) {
    botonesTema[i].addEventListener('click', function () {
      const tema = this.getAttribute('data-tema');
      localStorage.setItem('tema', tema);
      aplicarTema(tema);
    });
  }

  for (let i = 0; i < botonesIdioma.length; i++) {
    botonesIdioma[i].addEventListener('click', function () {
      const idioma = this.getAttribute('data-idioma');
      localStorage.setItem('idioma', idioma);
      marcarActivo(botonesIdioma, 'data-idioma', idioma);
    });
  }

});
