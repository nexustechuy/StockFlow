/**
 * Configuración del menú móvil para el rol Repositor.
 * La lógica genérica vive en js/componentes/menu-responsive.js.
 */
document.addEventListener('DOMContentLoaded', function () {
  inicializarMenuMovil({
    paginaDefault: 'dashboardRepositor.html',
    links: [
      { texto: 'Dashboard', href: 'dashboardRepositor.html' },
      { texto: 'Productos', href: '#' },
      { texto: 'Reposiciones', href: '#' },
      { texto: 'Alerta de Stock', href: '#' },
      { texto: 'Ajustes', href: '#' },
      { texto: 'Cerrar sesión', href: 'login.html', cerrarSesion: true }
    ]
  });
});
