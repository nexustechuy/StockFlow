document.addEventListener('DOMContentLoaded', function () {

  const ID_USUARIO_VENDEDOR = 1;

  const listaProductos = document.getElementById('listaProductos');
  const buscador = document.getElementById('buscadorCatalogo');
  const sinResultadosCatalogo = document.getElementById('sinResultadosCatalogo');

  const cuerpoCarrito = document.getElementById('cuerpoCarrito');
  const tablaVentaWrapper = document.querySelector('.tabla-venta-wrapper');

  const resumenSubtotal = document.getElementById('resumenSubtotal');
  const resumenTotal = document.getElementById('resumenTotal');
  const btnConfirmarVenta = document.getElementById('btnConfirmarVenta');

  const mensajeExito = document.getElementById('mensajeExito');
  const textoMensajeExito = document.getElementById('textoMensajeExito');

  const campoNombreCliente = document.getElementById('campoNombreCliente');
  const nombreClienteInput = document.getElementById('nombreCliente');

  let productos = [];
  const carrito = {};

  function formatearPrecio(numero) {
    return '$' + Number(numero).toLocaleString('es-AR');
  }

  function mostrarErrorCampo(campo, mensaje) {
    campo.classList.add('campo-invalido');
    campo.querySelector('.error-campo').textContent = mensaje;
  }

  function limpiarErrorCampo(campo) {
    campo.classList.remove('campo-invalido');
    campo.querySelector('.error-campo').textContent = '';
  }

  nombreClienteInput.addEventListener('input', function () {
    limpiarErrorCampo(campoNombreCliente);
  });

  function aplicarBusquedaCatalogo() {
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
  }

  buscador.addEventListener('input', aplicarBusquedaCatalogo);

  function renderizarCatalogo() {
    listaProductos.querySelectorAll('.producto-item').forEach(function (item) {
      item.remove();
    });

    productos.forEach(function (producto) {
      const stock = Number(producto.stock);
      const item = document.createElement('div');
      item.className = 'producto-item' + (stock === 0 ? ' sin-stock' : '');
      item.dataset.id = producto.id_producto;
      item.dataset.nombre = producto.nombre;
      item.dataset.precio = producto.precio_venta;
      item.dataset.stock = stock;

      item.innerHTML = `
        <div class="icono-producto"><i class="bi bi-box-seam"></i></div>
        <div class="info-producto">
          <div class="nombre">${producto.nombre}</div>
          <div class="stock">Stock: ${stock}</div>
        </div>
        <div class="precio">${formatearPrecio(producto.precio_venta)}</div>
        <button type="button" class="btn-agregar" title="Agregar a la venta">
          <i class="bi bi-plus"></i>
        </button>
      `;

      listaProductos.insertBefore(item, sinResultadosCatalogo);
    });

    aplicarBusquedaCatalogo();
  }

  listaProductos.addEventListener('click', function (evento) {
    const boton = evento.target.closest('.btn-agregar');
    if (!boton) return;

    const item = boton.closest('.producto-item');
    if (item.classList.contains('sin-stock')) return;

    const id = item.dataset.id;
    const stock = parseInt(item.dataset.stock, 10);
    const cantidadActual = carrito[id] ? carrito[id].cantidad : 0;

    if (cantidadActual >= stock) return;

    carrito[id] = {
      nombre: item.dataset.nombre,
      precio: parseFloat(item.dataset.precio),
      stock: stock,
      cantidad: cantidadActual + 1
    };

    renderizarCarrito();
  });

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

    tablaVentaWrapper.classList.toggle('con-productos', ids.length > 0);

    resumenSubtotal.textContent = formatearPrecio(subtotal);
    resumenTotal.textContent = formatearPrecio(subtotal);

    btnConfirmarVenta.disabled = ids.length === 0;

    Object.keys(carrito).forEach(function (id) {
      const item = listaProductos.querySelector('.producto-item[data-id="' + id + '"]');
      if (item) {
        item.classList.toggle('sin-stock', carrito[id].cantidad >= carrito[id].stock);
      }
    });
    listaProductos.querySelectorAll('.producto-item').forEach(function (item) {
      if (!carrito[item.dataset.id]) {
        const producto = productos.find(p => String(p.id_producto) === item.dataset.id);
        item.classList.toggle('sin-stock', producto ? Number(producto.stock) === 0 : false);
      }
    });
  }

  btnConfirmarVenta.addEventListener('click', function () {
    if (Object.keys(carrito).length === 0) return;

    const nombreCliente = nombreClienteInput.value.trim();
    if (nombreCliente === '') {
      mostrarErrorCampo(campoNombreCliente, 'Ingresá el nombre del cliente.');
      nombreClienteInput.focus();
      return;
    }
    limpiarErrorCampo(campoNombreCliente);

    const itemsVenta = Object.keys(carrito).map(function (id) {
      return { id_producto: Number(id), cantidad: carrito[id].cantidad };
    });

    btnConfirmarVenta.disabled = true;

    fetch('http://localhost:3000/ventas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre_cliente: nombreCliente,
        id_usuario: ID_USUARIO_VENDEDOR,
        productos: itemsVenta
      })
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error al registrar la venta.');
        return data;
      })
      .then(ventaCreada => {
        ventaCreada.productos.forEach(function (item) {
          const producto = productos.find(p => Number(p.id_producto) === Number(item.id_producto));
          if (producto) {
            producto.stock = Number(producto.stock) - Number(item.cantidad);
          }
        });

        textoMensajeExito.textContent =
          'Venta registrada con éxito para ' + nombreCliente + ' (' + formatearPrecio(ventaCreada.total) + ').';
        mensajeExito.style.display = 'block';
        setTimeout(function () {
          mensajeExito.style.display = 'none';
        }, 3500);

        Object.keys(carrito).forEach(function (id) { delete carrito[id]; });
        renderizarCatalogo();
        renderizarCarrito();
        buscador.value = '';
        nombreClienteInput.value = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch(error => {
        console.error('Error al registrar la venta:', error);
        alert(error.message);
      })
      .finally(() => {
        btnConfirmarVenta.disabled = Object.keys(carrito).length === 0;
      });
  });

  function cargarProductos() {
    fetch('http://localhost:3000/productos')
      .then(res => res.json())
      .then(data => {
        productos = data;
        renderizarCatalogo();
      })
      .catch(error => {
        console.error('Error al cargar productos:', error);
        listaProductos.innerHTML = '<p class="sin-resultados">Error al cargar los productos.</p>';
      });
  }

  cargarProductos();
  renderizarCarrito();
});
