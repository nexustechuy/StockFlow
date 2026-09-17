document.addEventListener('DOMContentLoaded', function () {

  const cuerpoTabla = document.getElementById('cuerpoTablaVentas');
  const inputBusqueda = document.getElementById('buscarVenta');
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

  function rentabilidadDeVenta(idVenta) {
    return detalleDeVenta(idVenta)
      .reduce((acc, d) => acc + (Number(d.precio_unitario) - Number(d.precio_compra)) * Number(d.cantidad), 0);
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
    const productos = productosDeVenta(venta.id_venta);
    const rentabilidad = rentabilidadDeVenta(venta.id_venta);
    const cliente = nombreCliente(venta);
    const vendedor = venta.vendedor || 'Sin asignar';

    return `
      <tr data-fecha="${fechaTexto}" data-hora="${horaTexto}" data-vendedor="${vendedor}"
        data-cliente="${cliente}" data-productos="${productos}" data-total="${venta.total}"
        data-rentabilidad="${rentabilidad}" data-numero="${venta.id_venta}">
        <td>${venta.id_venta}</td>
        <td>${horaTexto}</td>
        <td>${vendedor}</td>
        <td>${cliente}</td>
        <td>${productos}</td>
        <td>${formatearMoneda(venta.total)}</td>
        <td>
          <a href="#" class="ver-detalle-venta" data-bs-toggle="modal" data-bs-target="#modalDetalleVenta">Ver
            detalle</a>
        </td>
      </tr>
    `;
  }

  function aplicarFiltros() {
    let lista = ventas.filter(v => estaEnPeriodo(v.fecha_hora, filtroPeriodo));

    if (textoBusqueda.trim() !== '') {
      const texto = textoBusqueda.toLowerCase();
      lista = lista.filter(v => {
        const cliente = nombreCliente(v).toLowerCase();
        const vendedor = (v.vendedor || '').toLowerCase();
        return cliente.includes(texto) || vendedor.includes(texto);
      });
    }

    cuerpoTabla.innerHTML = lista.length
      ? lista.map(renderizarFila).join('')
      : `<tr><td colspan="7">No se encontraron ventas.</td></tr>`;

    renderizarTarjetas();
  }

  function renderizarTarjetas() {
    const ventasHoy = ventas.filter(v => estaEnPeriodo(v.fecha_hora, 'hoy'));
    const ingresosHoy = ventasHoy.reduce((acc, v) => acc + Number(v.total), 0);
    const gananciaBrutaHoy = ventasHoy.reduce((acc, v) => acc + rentabilidadDeVenta(v.id_venta), 0);
    const vendedoresActivos = new Set(ventasHoy.map(v => v.id_usuario).filter(Boolean)).size;

    document.getElementById('ventasHoyValor').textContent = ventasHoy.length;
    document.getElementById('ingresosHoyValor').textContent = formatearMoneda(ingresosHoy);
    document.getElementById('gananciaBrutaValor').textContent = formatearMoneda(gananciaBrutaHoy);
    document.getElementById('vendedoresActivosValor').textContent = vendedoresActivos;
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

      document.getElementById('detalleNumero').textContent = fila.dataset.numero;
      document.getElementById('detalleFecha').textContent = fila.dataset.fecha;
      document.getElementById('detalleHora').textContent = fila.dataset.hora;
      document.getElementById('detalleVendedor').textContent = fila.dataset.vendedor;
      document.getElementById('detalleCliente').textContent = fila.dataset.cliente;
      document.getElementById('detalleProductos').textContent = fila.dataset.productos;
      document.getElementById('detalleTotal').textContent = formatearMoneda(fila.dataset.total);
      document.getElementById('detalleRentabilidad').textContent = formatearMoneda(fila.dataset.rentabilidad);
    });
  }

  Promise.all([cargarVentas(), cargarDetalleVentas()]).then(aplicarFiltros);

});
