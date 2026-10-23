/* Menú móvil (navbar hamburguesa) para todos los roles */
function inicializarMenuMovil(config) {

  const paginaActual = window.location.pathname.split('/').pop() || config.paginaDefault;

  const linksHTML = config.links.map(link => {
    const estiloExtra = link.cerrarSesion
      ? ' style="margin-top:auto; color:rgba(255,255,255,0.60);"'
      : '';
    return `<a href="${link.href}"${estiloExtra} onclick="cerrarMenuMovil()">${link.texto}</a>`;
  }).join('\n      ');

  const html = `
    <div class="navbar-movil">
      <span class="brand">StockFlow</span>
      <button onclick="abrirMenuMovil()"><i class="bi bi-list"></i></button>
    </div>

    <div class="menu-movil" id="menuMovil">
      <button class="cerrar-menu" onclick="cerrarMenuMovil()"><i class="bi bi-x"></i></button>
      ${linksHTML}
    </div>
    `;

  document.body.insertAdjacentHTML('afterbegin', html);

  document.querySelectorAll('.menu-movil a').forEach(link => {
    if (link.getAttribute('href') === paginaActual) {
      link.classList.add('activo');
    }
  });
}

function abrirMenuMovil() {
  document.getElementById('menuMovil').classList.add('abierto');
}

function cerrarMenuMovil() {
  document.getElementById('menuMovil').classList.remove('abierto');
}
