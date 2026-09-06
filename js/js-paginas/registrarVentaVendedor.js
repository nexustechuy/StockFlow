/**
 * Logica de la pantalla Registrar Venta (Vendedor):
 *  - Búsqueda en vivo dentro del catálogo de productos.
 *  - Agregar productos al carrito ("Productos en Venta") desde el catálogo.
 *  - Editar cantidad o quitar un producto directamente desde la tabla del carrito.
 *  - Recalcular Subtotal / Total del resumen en cada cambio.
 *  - Confirmar venta: valida que haya al menos un producto y limpia el carrito
 *    (no persiste en ningún backend; es solo para la maqueta).
 */

document.addEventListener('DOMContentLoaded', function () {

  const listaProductos = document.getElementById('listaProductos');
  const buscador = document.getElementById('buscadorCatalogo');
  const sinResultadosCatalogo = document.getElementById('sinResultadosCatalogo');

  const cuerpoCarrito = document.getElementById('cuerpoCarrito');
  const tablaVentaWrapper = document.querySelector('.tabla-venta-wrapper');

  const resumenSubtotal = document.getElementById('resumenSubtotal');
  const resumenTotal = document.getElementById('resumenTotal');
  const btnConfirmarVenta = document.getElementById('btnConfirmarVenta');

  const mensajeExito = document.getElementById('mensajeExito');

  // Carrito en memoria: clave = id del producto, valor = { nombre, precio, stock, cantidad }
  const carrito = {};

  function formatearPrecio(numero) {
    return '$' + numero.toLocaleString('es-AR');
  }

  /* ===== Búsqueda en el catálogo ===== */
  buscador.addEventListener('input', function () {
    const texto = buscador.value.trim().toLowerCase();
    const items = listaProductos.querySelectorAll('.producto-item');
    let hayVisibles = false;

    items.forEach(function (item) {
      const nombre = item.dataset.nombre.toLowerCase();
      const coincide = nombre.includes(texto);
      item.style.display = coincide ? '' : 'none';
      if (coincide) hayVisibles = true;
    });

    sinResultadosCatalogo.style.display = hayVisibles ? 'none' : 'block';
  });

  /* ===== Agregar un producto al carrito desde el catálogo ===== */
  listaProductos.addEventListener('click', function (evento) {
    const boton = evento.target.closest('.btn-agregar');
    if (!boton) return;

    const item = boton.closest('.producto-item');
    if (item.classList.contains('sin-stock')) return;

    const id = item.dataset.id;
    const stock = parseInt(item.dataset.stock, 10);
    const cantidadActual = carrito[id] ? carrito[id].cantidad : 0;

    // No se puede agregar más unidades que el stock disponible
    if (cantidadActual >= stock) return;

    carrito[id] = {
      nombre: item.dataset.nombre,
      precio: parseFloat(item.dataset.precio),
      stock: stock,
      cantidad: cantidadActual + 1
    };

    renderizarCarrito();
  });

  /* ===== Cambiar cantidad o quitar un producto desde la tabla del carrito ===== */
  cuerpoCarrito.addEventListener('input', function (evento) {
    if (evento.target.matches('input[type="number"]')) {
      const fila = evento.target.closest('tr');
      const id = fila.dataset.id;
      let cantidad = parseInt(evento.target.value, 10);

      if (isNaN(cantidad) || cantidad < 1) cantidad = 1;
      if (cantidad > carrito[id].stock) cantidad = carrito[id].stock;

      evento.target.value = cantidad;
      carrito[id].cantidad = cantidad;
      renderizarCarrito();
    }
  });

  cuerpoCarrito.addEventListener('click', function (evento) {
    const boton = evento.target.closest('.btn-quitar');
    if (!boton) return;

    const fila = boton.closest('tr');
    delete carrito[fila.dataset.id];
    renderizarCarrito();
  });

  /* ===== Volver a dibujar la tabla del carrito + el resumen ===== */
  function renderizarCarrito() {
    const ids = Object.keys(carrito);
    cuerpoCarrito.innerHTML = '';

    let subtotal = 0;

    ids.forEach(function (id) {
      const producto = carrito[id];
      const subtotalFila = producto.precio * producto.cantidad;
      subtotal += subtotalFila;

      const fila = document.createElement('tr');
      fila.dataset.id = id;
      fila.innerHTML =
        '<td>' + producto.nombre + '</td>' +
        '<td>' + formatearPrecio(producto.precio) + '</td>' +
        '<td><input type="number" min="1" max="' + producto.stock + '" value="' + producto.cantidad + '"></td>' +
        '<td>' + formatearPrecio(subtotalFila) + '</td>' +
        '<td><button type="button" class="btn-quitar" title="Quitar"><i class="bi bi-trash"></i></button></td>';

      cuerpoCarrito.appendChild(fila);
    });

    // Muestra la tabla o el mensaje de "carrito vacio" según corresponda
    tablaVentaWrapper.classList.toggle('con-productos', ids.length > 0);

    // Por ahora Subtotal y Total son iguales (no hay descuentos/impuestos en la maqueta)
    resumenSubtotal.textContent = formatearPrecio(subtotal);
    resumenTotal.textContent = formatearPrecio(subtotal);

    btnConfirmarVenta.disabled = ids.length === 0;

    // Actualiza el stock visible en el catalogo (por si quedo en 0)
    Object.keys(carrito).forEach(function (id) {
      const item = listaProductos.querySelector('.producto-item[data-id="' + id + '"]');
      if (item) {
        item.classList.toggle('sin-stock', carrito[id].cantidad >= carrito[id].stock);
      }
    });
    listaProductos.querySelectorAll('.producto-item').forEach(function (item) {
      if (!carrito[item.dataset.id]) {
        item.classList.remove('sin-stock');
      }
    });
  }

  /* ===== Confirmar venta ===== */
  btnConfirmarVenta.addEventListener('click', function () {
    if (Object.keys(carrito).length === 0) return;

    // Aca, cuando haya backend, se mandaria el carrito al servidor.
    // Por ahora solo mostramos el mensaje de éxito y limpiamos todo.
    mensajeExito.style.display = 'block';
    setTimeout(function () {
      mensajeExito.style.display = 'none';
    }, 3500);

    Object.keys(carrito).forEach(function (id) { delete carrito[id]; });
    renderizarCarrito();
    buscador.value = '';
    buscador.dispatchEvent(new Event('input'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  renderizarCarrito();
});
