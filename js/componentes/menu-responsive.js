/**
 * Componente reutilizable: menú móvil (navbar hamburguesa) para todos los dashboards.
 *
 * Cómo se usa desde cada página:
 *   1. Este archivo se incluye SIEMPRE (es genérico, no sabe nada de roles).
 *   2. Cada página define ANTES su propia configuración (ver js/js-paginas/nav*.js),
 *      llamando a inicializarMenuMovil(config) con sus links y su página por defecto.
 *
 * Esto reemplaza la lógica que antes estaba copiada y pegada en
 * navAdministrador.js, navRepositor.js y navVendedor.js.
 */

function inicializarMenuMovil(config) {
  // config = {
  //   paginaDefault: 'dashboardAdministrador.html',
  //   links: [
  //     { texto: 'Dashboard', href: 'dashboardAdministrador.html' },
  //     { texto: 'Usuarios',  href: '#' },
  //     ...
  //   ]
  // }

  const paginaActual = window.location.pathname.split('/').pop() || config.paginaDefault;

  const linksHTML = config.links.map(link => {
    // El link de "Cerrar sesión" se distingue por convención (lo marcamos en la config)
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

  // Marca como "activo" el link que coincide con la página actual
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
