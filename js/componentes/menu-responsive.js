
/* Menú móvil (navbar hamburguesa) para todos los roles */
function inicializarMenuMovil(config) {

  const paginaActual = window.location.pathname.split('/').pop() || config.paginaDefault;

  const linksHTML = config.links.map(link => {
    const estiloExtra = link.cerrarSesion
      ? ' style="margin-top:auto; color:rgba(255,255,255,0.60);"'
      : '';
    return `<a href="${link.href}" data-i18n="${link.texto}"${estiloExtra} onclick="cerrarMenuMovil()">${link.texto}</a>`;
  }).join('\n      ');

  const html = `
    <div class="navbar-movil">
      <span class="brand">StockFlow</span>
      <button type="button" onclick="abrirMenuMovil()"><i class="bi bi-list"></i></button>
    </div>

    <div class="menu-movil" id="menuMovil">
      <button type="button" class="cerrar-menu" onclick="cerrarMenuMovil()"><i class="bi bi-x"></i></button>
      ${linksHTML}
    </div>
    `;

  document.body.insertAdjacentHTML('afterbegin', html);

  document.querySelectorAll('.menu-movil a').forEach(link => {
    if (link.getAttribute('href') === paginaActual) {
      link.classList.add('activo');
    }
  });

  // "Cambiar de rol" arriba de "Cerrar sesión" (solo si sesion.js lo habilitó)
  const linkCerrarSesion = document.querySelector('.menu-movil a[href="login.html"]');

  if (typeof window.abrirCambiarRol === 'function' && linkCerrarSesion) {
    const linkCambiarRol = document.createElement('a');
    linkCambiarRol.href = '#';
    linkCambiarRol.textContent = 'Cambiar de rol';
    linkCambiarRol.setAttribute('data-i18n', 'Cambiar de rol');
    linkCambiarRol.style.marginTop = 'auto';
    linkCambiarRol.style.color = 'rgba(255,255,255,0.60)';
    linkCambiarRol.addEventListener('click', function (evento) {
      evento.preventDefault();
      cerrarMenuMovil();
      window.abrirCambiarRol();
    });

    linkCerrarSesion.style.marginTop = '0';
    linkCerrarSesion.before(linkCambiarRol);
  }

  // Aplica el idioma guardado 
  if (typeof aplicarIdioma === 'function') {
    aplicarIdioma(localStorage.getItem('idioma') || 'es');
  }
}

function abrirMenuMovil() {
  document.getElementById('menuMovil').classList.add('abierto');
}

function cerrarMenuMovil() {
  document.getElementById('menuMovil').classList.remove('abierto');
}
