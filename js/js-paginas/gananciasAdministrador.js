document.addEventListener('DOMContentLoaded', function () {

  const contenedorCategorias = document.getElementById('graficoCategorias');
  const cuerpoProductos = document.getElementById('cuerpoProductosMasVendidos');

  let ventas = [];
  let detalleVentas = [];
  let filtroPeriodo = 'hoy';

  function formatearMoneda(valor) {
    return '$' + Number(valor).toLocaleString('es-UY');
  }

  function estaEnPeriodo(fechaHora, periodo) {
    const fecha = new Date(fechaHora);
    const ahora = new Date();

    if (periodo === 'hoy') {
      return fecha.toDateString() === ahora.toDateString();
    }
    if (periodo === 'semana') {
      const inicioSemana = new Date(ahora);
      inicioSemana.setDate(ahora.getDate() - ahora.getDay());
      inicioSemana.setHours(0, 0, 0, 0);
      return fecha >= inicioSemana;
    }
    if (periodo === 'mes') {
      return fecha.getFullYear() === ahora.getFullYear() && fecha.getMonth() === ahora.getMonth();
    }
    if (periodo === 'anio') {
      return fecha.getFullYear() === ahora.getFullYear();
    }
    return true;
  }

  function detalleEnPeriodo() {
    const idsVentasPeriodo = new Set(
      ventas.filter(v => estaEnPeriodo(v.fecha_hora, filtroPeriodo)).map(v => Number(v.id_venta))
    );
    return detalleVentas.filter(d => idsVentasPeriodo.has(Number(d.id_venta)));
  }

  function renderizarTarjetas(detalle) {
    const totalVendido = detalle.reduce((acc, d) => acc + Number(d.subtotal), 0);
    const costoTotal = detalle.reduce((acc, d) => acc + Number(d.precio_compra) * Number(d.cantidad), 0);
    const rentabilidad = totalVendido - costoTotal;
    const ventasRealizadas = new Set(detalle.map(d => d.id_venta)).size;

    document.getElementById('totalVendidoValor').textContent = formatearMoneda(totalVendido);
    document.getElementById('costoTotalValor').textContent = formatearMoneda(costoTotal);
    document.getElementById('rentabilidadValor').textContent = formatearMoneda(rentabilidad);
    document.getElementById('ventasRealizadasValor').textContent = ventasRealizadas;
  }

  function renderizarGraficoCategorias(detalle) {
    const porCategoria = {};

    detalle.forEach(d => {
      const nombre = d.categoria || 'Sin categoría';
      const ganancia = (Number(d.precio_unitario) - Number(d.precio_compra)) * Number(d.cantidad);
      porCategoria[nombre] = (porCategoria[nombre] || 0) + ganancia;
    });

    const categorias = Object.entries(porCategoria).sort((a, b) => b[1] - a[1]);
    const maximo = categorias.length ? Math.max(...categorias.map(([, ganancia]) => Math.abs(ganancia))) : 0;

    contenedorCategorias.innerHTML = categorias.length
      ? categorias.map(([nombre, ganancia]) => {
        const ancho = maximo > 0 ? (Math.abs(ganancia) / maximo) * 100 : 0;
        return `
          <div class="fila-barra">
            <span class="etiqueta-barra">${nombre}</span>
            <div class="barra-fondo">
              <div class="barra-relleno" style="width: ${ancho}%;"></div>
            </div>
            <span class="valor-barra">${formatearMoneda(ganancia)}</span>
          </div>
        `;
      }).join('')
      : `<p>No hay ganancias registradas en este período.</p>`;
  }

  function renderizarProductosMasVendidos(detalle) {
    const porProducto = {};

    detalle.forEach(d => {
      const id = d.id_producto;
      if (!porProducto[id]) {
        porProducto[id] = {
          nombre: d.producto_nombre,
          precioCompra: Number(d.precio_compra),
          vendidos: 0,
          ganancia: 0
        };
      }
      porProducto[id].vendidos += Number(d.cantidad);
      porProducto[id].ganancia += (Number(d.precio_unitario) - Number(d.precio_compra)) * Number(d.cantidad);
    });

    const productos = Object.values(porProducto).sort((a, b) => b.vendidos - a.vendidos);

    cuerpoProductos.innerHTML = productos.length
      ? productos.map(p => `
        <tr>
          <td>${p.nombre}</td>
          <td>${p.vendidos}</td>
          <td>${formatearMoneda(p.precioCompra)}</td>
          <td class="ingreso">${formatearMoneda(p.ganancia)}</td>
        </tr>
      `).join('')
      : `<tr><td colspan="4">No hay productos vendidos en este período.</td></tr>`;
  }

  function actualizarVista() {
    const detalle = detalleEnPeriodo();
    renderizarTarjetas(detalle);
    renderizarGraficoCategorias(detalle);
    renderizarProductosMasVendidos(detalle);
  }

  document.querySelectorAll('.filtro-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      document.querySelectorAll('.filtro-chip').forEach(function (c) {
        c.classList.remove('activo');
      });
      chip.classList.add('activo');
      filtroPeriodo = chip.dataset.filtro;
      actualizarVista();
    });
  });

  function cargarVentas() {
    return fetch('http://localhost:3000/ventas')
      .then(res => res.json())
      .then(data => { ventas = data; })
      .catch(error => console.error('Error al cargar ventas:', error));
  }

  function cargarDetalleVentas() {
    return fetch('http://localhost:3000/detalle-ventas')
      .then(res => res.json())
      .then(data => { detalleVentas = data; })
      .catch(error => console.error('Error al cargar el detalle de ventas:', error));
  }

  Promise.all([cargarVentas(), cargarDetalleVentas()]).then(actualizarVista);

});
