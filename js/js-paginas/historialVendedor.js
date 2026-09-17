document.addEventListener('DOMContentLoaded', function () {

  const ID_USUARIO_VENDEDOR = 1;

  const cuerpoTabla = document.getElementById('cuerpoTablaHistorial');
  const inputBusqueda = document.getElementById('buscarHistorial');
  const modalDetalleVenta = document.getElementById('modalDetalleVenta');

  let ventas = [];
  let detalleVentas = [];
  let filtroPeriodo = 'hoy';
  let textoBusqueda = '';

  function formatearMoneda(valor) {
    return '$' + Number(valor).toLocaleString('es-UY');
  }

  function nombreCliente(venta) {
    if (venta.cliente_nombre) {
      return `${venta.cliente_nombre} ${venta.cliente_apellido ?? ''}`.trim();
    }
    return venta.nombre_cliente || 'Sin cliente';
  }

  function detalleDeVenta(idVenta) {
    return detalleVentas.filter(d => Number(d.id_venta) === Number(idVenta));
  }

  function productosDeVenta(idVenta) {
    return detalleDeVenta(idVenta)
      .map(d => `${d.producto_nombre} x${d.cantidad}`)
      .join(', ');
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
    return true;
  }

  function renderizarFila(venta) {
    const fecha = new Date(venta.fecha_hora);
    const fechaTexto = fecha.toLocaleDateString('es-UY');
    const horaTexto = fecha.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' });
    const cliente = nombreCliente(venta);
    const productos = productosDeVenta(venta.id_venta);

    return `
      <tr data-numero="${venta.id_venta}" data-fecha="${fechaTexto}" data-hora="${horaTexto}" data-cliente="${cliente}">
        <td>${fechaTexto}</td>
        <td>${horaTexto}</td>
        <td>${cliente}</td>
        <td>${productos}</td>
        <td class="ingreso">${formatearMoneda(venta.total)}</td>
        <td>
          <a href="#" class="ver-detalle-venta" data-bs-toggle="modal" data-bs-target="#modalDetalleVenta">Ver
            detalle</a>
        </td>
      </tr>
    `;
  }

  function ventasDelVendedor() {
    return ventas.filter(v => Number(v.id_usuario) === ID_USUARIO_VENDEDOR);
  }

  function aplicarFiltros() {
    let lista = ventasDelVendedor().filter(v => estaEnPeriodo(v.fecha_hora, filtroPeriodo));

    if (textoBusqueda.trim() !== '') {
      const texto = textoBusqueda.toLowerCase();
      lista = lista.filter(v => {
        const cliente = nombreCliente(v).toLowerCase();
        const productos = productosDeVenta(v.id_venta).toLowerCase();
        return cliente.includes(texto) || productos.includes(texto);
      });
    }

    cuerpoTabla.innerHTML = lista.length
      ? lista.map(renderizarFila).join('')
      : `<tr><td colspan="6">No se encontraron ventas.</td></tr>`;

    renderizarTarjetas();
  }

  function renderizarTarjetas() {
    const propias = ventasDelVendedor();
    const ventasHoy = propias.filter(v => estaEnPeriodo(v.fecha_hora, 'hoy'));
    const ventasMes = propias.filter(v => estaEnPeriodo(v.fecha_hora, 'mes'));

    const totalHoy = ventasHoy.reduce((acc, v) => acc + Number(v.total), 0);
    const totalMes = ventasMes.reduce((acc, v) => acc + Number(v.total), 0);

    document.getElementById('ventasHoyValor').textContent = ventasHoy.length;
    document.getElementById('totalHoyValor').textContent = formatearMoneda(totalHoy);
    document.getElementById('totalMesValor').textContent = formatearMoneda(totalMes);
  }

  if (inputBusqueda) {
    inputBusqueda.addEventListener('input', function (e) {
      textoBusqueda = e.target.value;
      aplicarFiltros();
    });
  }

  document.querySelectorAll('.filtro-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      document.querySelectorAll('.filtro-chip').forEach(function (c) {
        c.classList.remove('activo');
      });
      chip.classList.add('activo');
      filtroPeriodo = chip.dataset.filtro;
      aplicarFiltros();
    });
  });

  if (modalDetalleVenta) {
    modalDetalleVenta.addEventListener('show.bs.modal', function (evento) {
      const disparador = evento.relatedTarget;
      const fila = disparador.closest('tr');
      const idVenta = fila.dataset.numero;

      const detalle = detalleDeVenta(idVenta);
      const cuerpoProductos = document.getElementById('detalleProductosBody');
      cuerpoProductos.innerHTML = '';

      let cantidadTotal = 0;
      let totalVenta = 0;

      detalle.forEach(function (d) {
        const subtotal = Number(d.subtotal);
        cantidadTotal += Number(d.cantidad);
        totalVenta += subtotal;

        const filaProducto = document.createElement('tr');
        filaProducto.innerHTML =
          '<td>' + d.id_producto + '</td>' +
          '<td>' + d.producto_nombre + '</td>' +
          '<td>' + d.cantidad + '</td>' +
          '<td>' + formatearMoneda(d.precio_unitario) + '</td>' +
          '<td>' + formatearMoneda(subtotal) + '</td>';
        cuerpoProductos.appendChild(filaProducto);
      });

      document.getElementById('detalleNumero').textContent = '#' + idVenta;
      document.getElementById('detalleCliente').textContent = fila.dataset.cliente;
      document.getElementById('detalleFecha').textContent = fila.dataset.fecha;
      document.getElementById('detalleHora').textContent = fila.dataset.hora;
      document.getElementById('detalleCantidad').textContent = cantidadTotal + ' un.';
      document.getElementById('detalleSubtotal').textContent = formatearMoneda(totalVenta);
      document.getElementById('detalleTotal').textContent = formatearMoneda(totalVenta);
    });
  }

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

  Promise.all([cargarVentas(), cargarDetalleVentas()]).then(aplicarFiltros);

});
