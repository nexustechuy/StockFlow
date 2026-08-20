/**
 * Configuración del menú móvil para el rol Administrador.
 * La lógica genérica (abrir/cerrar, HTML del menú, marcar link activo)
 * vive en js/componentes/menu-responsive.js — este archivo solo declara
 * qué links le corresponden a este rol.
 */
document.addEventListener('DOMContentLoaded', function () {
  inicializarMenuMovil({
    paginaDefault: 'dashboardAdministrador.html',
    links: [
      { texto: 'Dashboard',     href: 'dashboardAdministrador.html' },
      { texto: 'Usuarios',      href: '#' },
      { texto: 'Categorias',    href: '#' },
      { texto: 'Productos',     href: '#' },
      { texto: 'Ajustes',       href: '#' },
      { texto: 'Cerrar sesión', href: 'login.html', cerrarSesion: true }
    ]
  });
});
