document.addEventListener('DOMContentLoaded', function () {

  const nav = document.querySelector('.sidebar nav');
  if (!nav) return;

  const activo = nav.querySelector('a.activo');
  if (!activo) return;

  nav.classList.add('nav-animada');

  const indicador = document.createElement('span');
  indicador.className = 'indicador-sidebar';
  nav.appendChild(indicador);

  function ubicar(link) {
    indicador.style.top = link.offsetTop + 'px';
    indicador.style.height = link.offsetHeight + 'px';
  }

  const links = Array.from(nav.querySelectorAll('a'));

  let anterior = null;
  try {
    const posicionAnterior = sessionStorage.getItem('sidebarAnterior');
    sessionStorage.removeItem('sidebarAnterior');
    if (posicionAnterior !== null) {
      anterior = links[Number(posicionAnterior)] || null;
    }
  } catch (error) {
    anterior = null;
  }

  ubicar(anterior && anterior !== activo ? anterior : activo);

  setTimeout(function () {
    indicador.classList.add('listo');
    ubicar(activo);
  }, 50);

  links.forEach(function (link) {
    link.addEventListener('click', function () {
      try {
        sessionStorage.setItem('sidebarAnterior', links.indexOf(activo));
      } catch (error) {
        return;
      }
    });
  });

  window.addEventListener('resize', function () {
    ubicar(activo);
  });
});
