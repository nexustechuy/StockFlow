document.addEventListener('DOMContentLoaded', function () {

  const grupos = [];

  document.querySelectorAll('.filtro-chip, .btn-filtro').forEach(function (chip) {
    const grupo = chip.parentElement;
    if (grupos.includes(grupo)) return;

    grupo.classList.add('filtros-animados');

    const indicador = document.createElement('span');
    indicador.className = 'indicador-filtro';
    grupo.appendChild(indicador);

    grupos.push(grupo);
  });

  function moverIndicadores() {
    grupos.forEach(function (grupo) {
      const indicador = grupo.querySelector('.indicador-filtro');
      const activo = grupo.querySelector('.filtro-chip.activo, .btn-filtro.activo');

      if (!activo || activo.offsetWidth === 0) return;

      indicador.style.left = activo.offsetLeft + 'px';
      indicador.style.top = activo.offsetTop + 'px';
      indicador.style.width = activo.offsetWidth + 'px';
      indicador.style.height = activo.offsetHeight + 'px';

      if (!indicador.classList.contains('listo')) {
        setTimeout(function () {
          indicador.classList.add('listo');
        }, 50);
      }
    });
  }

  moverIndicadores();
  document.fonts.ready.then(moverIndicadores);
  window.addEventListener('load', moverIndicadores);
  window.addEventListener('resize', moverIndicadores);

  document.addEventListener('click', function () {
    setTimeout(moverIndicadores, 0);
  });
});
