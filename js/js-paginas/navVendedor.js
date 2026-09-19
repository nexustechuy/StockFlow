/* Configuración del menú móvil para el rol Vendedor */
document.addEventListener('DOMContentLoaded', function () {
  inicializarMenuMovil({
    paginaDefault: 'dashboardVendedor.html',
    links: [
      { texto: 'Dashboard', href: 'dashboardVendedor.html' },
      { texto: 'Registrar venta', href: 'registrarVentaVendedor.html' },
      { texto: 'Productos', href: 'productosVendedor.html' },
      { texto: 'Historial', href: 'historialVendedor.html' },
      { texto: 'Ajustes', href: '#' },
      { texto: 'Cerrar sesión', href: 'login.html', cerrarSesion: true }
    ]
  });
});
