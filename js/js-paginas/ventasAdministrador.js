/**
 * Lógica específica de la pantalla Ventas (Administrador):
 *  - Búsqueda en vivo por cliente o vendedor.
 *  - Chips de período (Hoy / Esta semana / Este mes): por ahora solo
 *    cambian visualmente cuál está seleccionado, ya que la maqueta no
 *    tiene ventas de más de un día para filtrar de verdad todavía.
 *    Cuando el backend traiga ventas reales con fecha, este es el
 *    lugar para comparar fila.dataset.fecha contra el rango elegido.
 *  - Modal "Detalle de venta": se completa con los datos de la fila
 *    (incluyendo fecha y rentabilidad) usando el evento nativo de
 *    Bootstrap show.bs.modal, que entrega el link que abrió el modal
 *    en evento.relatedTarget.
 */

document.addEventListener('DOMContentLoaded', function () {

  /* ===== Búsqueda por cliente o vendedor ===== */
  const inputBusqueda = document.getElementById('buscarVenta');

  function aplicarBusqueda() {
    const texto = inputBusqueda.value.trim().toLowerCase();
    const filas = document.querySelectorAll('#cuerpoTablaVentas tr');

    filas.forEach(function (fila) {
      const cliente = fila.dataset.cliente.toLowerCase();
      const vendedor = fila.dataset.vendedor.toLowerCase();
      const coincide = cliente.includes(texto) || vendedor.includes(texto);
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

      document.getElementById('detalleNumero').textContent = fila.dataset.numero;
      document.getElementById('detalleFecha').textContent = fila.dataset.fecha;
      document.getElementById('detalleHora').textContent = fila.dataset.hora;
      document.getElementById('detalleVendedor').textContent = fila.dataset.vendedor;
      document.getElementById('detalleCliente').textContent = fila.dataset.cliente;
      document.getElementById('detalleProductos').textContent = fila.dataset.productos;
      document.getElementById('detalleTotal').textContent = formatearMoneda(fila.dataset.total);
      document.getElementById('detalleRentabilidad').textContent = formatearMoneda(fila.dataset.rentabilidad);

      const estadoEl = document.getElementById('detalleEstado');
      estadoEl.textContent = fila.dataset.estado;
      estadoEl.className = 'detalle-venta-valor ' +
        (fila.dataset.estado === 'Completada' ? 'ingreso' : 'alerta');
    });
  }

});
