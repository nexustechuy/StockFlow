/**
 * Configuración del menú móvil para el rol Administrador.
 * La lógica genérica (abrir/cerrar, HTML del menú, marcar link activo)
 * vive en js/componentes/menu-responsive.js — este archivo solo declara
 * qué links le corresponden a este rol.
 *
 * Debe reflejar los mismos links que el <nav> del sidebar de escritorio
 * en cada página (ver dashboardAdministrador.html / usuariosAdministrador.html).
 */
document.addEventListener('DOMContentLoaded', function () {
  inicializarMenuMovil({
    paginaDefault: 'dashboardAdministrador.html',
    links: [
      { texto: 'Dashboard',  href: 'dashboardAdministrador.html' },
      { texto: 'Ventas',     href: '#' },
      { texto: 'Inventario', href: '#' },
      { texto: 'Ganancias',  href: '#' },
      { texto: 'Usuarios',   href: 'usuariosAdministrador.html' },
      { texto: 'Ajustes',    href: '#' },
      { texto: 'Cerrar sesión', href: 'login.html', cerrarSesion: true }
    ]
  });
});
