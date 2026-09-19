// Menú móvil del Administrador
// La lógica está en js/componentes/menu-responsive.js, acá solo van los links
document.addEventListener('DOMContentLoaded', function () {
  inicializarMenuMovil({
    paginaDefault: 'dashboardAdministrador.html',
    links: [
      { texto: 'Dashboard', href: 'dashboardAdministrador.html' },
      { texto: 'Ventas', href: 'ventasAdministrador.html' },
      { texto: 'Inventario', href: 'inventarioAdministrador.html' },
      { texto: 'Ganancias', href: 'gananciasAdministrador.html' },
      { texto: 'Usuarios', href: 'usuariosAdministrador.html' },
      { texto: 'Ajustes', href: '#' },
      { texto: 'Cerrar sesión', href: 'login.html', cerrarSesion: true }
    ]
  });
});
