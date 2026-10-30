
document.addEventListener('DOMContentLoaded', function () {

  const botonesTema = document.querySelectorAll('[data-tema]');
  let temaGuardado = localStorage.getItem('tema') || 'claro';

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

  for (let i = 0; i < botonesTema.length; i++) {
    botonesTema[i].addEventListener('click', function () {
      const tema = this.getAttribute('data-tema');

      localStorage.setItem('tema', tema);
      aplicarTema(tema);
    });
  }

});
