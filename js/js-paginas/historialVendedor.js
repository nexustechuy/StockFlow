/**
 * Lógica de la pantalla Historial (Vendedor):
 *  - Búsqueda en vivo por cliente o producto.
 *  - Chips de período (Hoy / Semana / Mes): por ahora solo cambian
 *    visualmente cuál está seleccionado, como en la pantalla de Ventas
 *    del Administrador, ya que todavía no hay ventas de más de un día.
 *  - Modal "Detalle de venta": se completa con los datos de la fila
 *    usando el evento show.bs.modal de Bootstrap.
 */

document.addEventListener('DOMContentLoaded', function () {

  /* ===== Búsqueda por cliente o producto ===== */
  const inputBusqueda = document.getElementById('buscarHistorial');

  function aplicarBusqueda() {
    const texto = inputBusqueda.value.trim().toLowerCase();
    const filas = document.querySelectorAll('#cuerpoTablaHistorial tr');

    filas.forEach(function (fila) {
      const cliente = fila.dataset.cliente.toLowerCase();
      const productos = fila.children[3].textContent.toLowerCase();
      const coincide = cliente.includes(texto) || productos.includes(texto);
      fila.style.display = coincide ? '' : 'none';
    });
  }

  if (inputBusqueda) {
    inputBusqueda.addEventListener('input', aplicarBusqueda);
  }

  /* ===== Chips de período ===== */
  document.querySelectorAll('.filtro-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      document.querySelectorAll('.filtro-chip').forEach(function (c) {
        c.classList.remove('activo');
      });
      chip.classList.add('activo');
      // TODO: cuando existan ventas de más de un día, filtrar acá por
      // fila.dataset.fecha según chip.dataset.filtro ('hoy' | 'semana' | 'mes').
    });
  });

  /* ===== Modal: Detalle de venta ===== */
  const modalDetalleVenta = document.getElementById('modalDetalleVenta');

  function formatearMoneda(valor) {
    return '$' + Number(valor).toLocaleString('es-UY');
  }

  if (modalDetalleVenta) {
    modalDetalleVenta.addEventListener('show.bs.modal', function (evento) {
      const disparador = evento.relatedTarget; // el link "Ver detalle" clickeado
      const fila = disparador.closest('tr');

      const productos = fila.dataset.productos.split(';');
      const cuerpoProductos = document.getElementById('detalleProductosBody');
      cuerpoProductos.innerHTML = '';

      let cantidadTotal = 0;
      let totalVenta = 0;

      productos.forEach(function (productoTexto) {
        const datos = productoTexto.split('|');
        const codigo = datos[0];
        const nombre = datos[1];
        const cantidad = Number(datos[2]);
        const precioUnitario = Number(datos[3]);
        const subtotalProducto = cantidad * precioUnitario;

        cantidadTotal += cantidad;
        totalVenta += subtotalProducto;

        const filaProducto = document.createElement('tr');
        filaProducto.innerHTML =
          '<td>' + codigo + '</td>' +
          '<td>' + nombre + '</td>' +
          '<td>' + cantidad + '</td>' +
          '<td>' + formatearMoneda(precioUnitario) + '</td>' +
          '<td>' + formatearMoneda(subtotalProducto) + '</td>';
        cuerpoProductos.appendChild(filaProducto);
      });

      document.getElementById('detalleNumero').textContent = '#' + fila.dataset.numero;
      document.getElementById('detalleCliente').textContent = fila.dataset.cliente;
      document.getElementById('detalleFecha').textContent = fila.dataset.fecha;
      document.getElementById('detalleHora').textContent = fila.dataset.hora;
      document.getElementById('detalleCantidad').textContent = cantidadTotal + ' un.';
      document.getElementById('detalleSubtotal').textContent = formatearMoneda(totalVenta);
      document.getElementById('detalleTotal').textContent = formatearMoneda(totalVenta);

      const estadoEl = document.getElementById('detalleEstado');
      estadoEl.textContent = fila.dataset.estado;
      estadoEl.className = 'badge-estado ' +
        (fila.dataset.estado === 'Completada' ? 'completada' : 'pendiente');
    });
  }

});
