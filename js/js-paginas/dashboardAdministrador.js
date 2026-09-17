document.addEventListener('DOMContentLoaded', function () {

  const cuerpoHistorial = document.getElementById('cuerpoHistorialVentas');

  function formatearMoneda(valor) {
    return '$' + Number(valor).toLocaleString('es-UY');
  }

  function nombreCliente(venta) {
    if (venta.cliente_nombre) {
      return `${venta.cliente_nombre} ${venta.cliente_apellido ?? ''}`.trim();
    }
    return venta.nombre_cliente || 'Sin cliente';
  }

  function renderizarFila(venta, detalleVentas) {
    const fecha = new Date(venta.fecha_hora);
    const horaTexto = fecha.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' });
    const cantidadTotal = detalleVentas
      .filter(d => Number(d.id_venta) === Number(venta.id_venta))
      .reduce((acc, d) => acc + Number(d.cantidad), 0);

    return `
      <tr>
        <td>${horaTexto}</td>
        <td>${nombreCliente(venta)}</td>
        <td>${cantidadTotal}</td>
        <td class="ingreso">${formatearMoneda(venta.total)}</td>
      </tr>
    `;
  }

  function cargarHistorialVentas() {
    Promise.all([
      fetch('http://localhost:3000/ventas').then(res => res.json()),
      fetch('http://localhost:3000/detalle-ventas').then(res => res.json())
    ])
      .then(([ventas, detalleVentas]) => {
        const ultimasVentas = ventas.slice(0, 4);

        cuerpoHistorial.innerHTML = ultimasVentas.length
          ? ultimasVentas.map(v => renderizarFila(v, detalleVentas)).join('')
          : `<tr><td colspan="4">Todavía no hay ventas registradas.</td></tr>`;
      })
      .catch(error => {
        console.error('Error al cargar el historial de ventas:', error);
        cuerpoHistorial.innerHTML = `<tr><td colspan="4">Error al cargar las ventas.</td></tr>`;
      });
  }

  cargarHistorialVentas();

});
