document.addEventListener('DOMContentLoaded', function () {

  const campoProducto = document.getElementById('campoProducto');
  const inputProducto = document.getElementById('inputProducto');
  const listaSugerencias = document.getElementById('listaSugerenciasProducto');

  const campoCantidad = document.getElementById('campoCantidad');
  const inputCantidad = document.getElementById('inputCantidad');

  const inputComentario = document.getElementById('inputComentario');

  const btnRegistrar = document.getElementById('btnRegistrarReposicion');
  const cuerpoHistorial = document.getElementById('cuerpoHistorial');

  let productos = [];
  let productoSeleccionado = null;

  function mostrarErrorCampo(campo, mensaje) {
    campo.classList.add('campo-invalido');
    campo.querySelector('.error-campo').textContent = mensaje;
  }

  function limpiarErrorCampo(campo) {
    campo.classList.remove('campo-invalido');
    campo.querySelector('.error-campo').textContent = '';
  }

  function seleccionarProducto(producto) {
    productoSeleccionado = producto;
    inputProducto.value = producto.nombre;
    listaSugerencias.innerHTML = '';
    listaSugerencias.style.display = 'none';
  }

  inputProducto.addEventListener('input', function () {
    limpiarErrorCampo(campoProducto);
    productoSeleccionado = null;

    const texto = inputProducto.value.trim().toLowerCase();
    listaSugerencias.innerHTML = '';

    if (texto === '') {
      listaSugerencias.style.display = 'none';
      return;
    }

    const coincidencias = productos.filter(function (producto) {
      return producto.nombre.toLowerCase().includes(texto) || String(producto.codigo || '').includes(texto);
    });

    if (coincidencias.length === 0) {
      listaSugerencias.style.display = 'none';
      return;
    }

    coincidencias.forEach(function (producto) {
      const item = document.createElement('li');
      item.textContent = producto.nombre;
      item.addEventListener('click', function () {
        seleccionarProducto(producto);
      });
      listaSugerencias.appendChild(item);
    });

    listaSugerencias.style.display = 'block';
  });

  document.addEventListener('click', function (evento) {
    if (!campoProducto.contains(evento.target)) {
      listaSugerencias.style.display = 'none';
    }
  });

  inputCantidad.addEventListener('input', function () {
    limpiarErrorCampo(campoCantidad);
  });

  function formatearFecha(fechaHora) {
    const fecha = new Date(fechaHora);
    return fecha.toLocaleDateString('es-UY');
  }

  function renderizarFilaHistorial(reposicion) {
    return `
      <tr>
        <td>${escaparHTML(reposicion.producto_nombre)}</td>
        <td>${escaparHTML(reposicion.cantidad)}</td>
        <td>${formatearFecha(reposicion.fecha_hora)}</td>
        <td>${escaparHTML(reposicion.comentario ?? '-')}</td>
      </tr>
    `;
  }

  btnRegistrar.addEventListener('click', function () {
    const cantidad = inputCantidad.value.trim();
    const comentario = inputComentario.value.trim();

    let hayError = false;

    if (!productoSeleccionado) {
      mostrarErrorCampo(campoProducto, 'Seleccioná un producto de la lista.');
      hayError = true;
    }

    if (cantidad === '' || parseInt(cantidad, 10) < 1) {
      mostrarErrorCampo(campoCantidad, 'Ingresá una cantidad válida.');
      hayError = true;
    }

    if (hayError) return;

    btnRegistrar.disabled = true;

    fetch('/reposiciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_producto: productoSeleccionado.id_producto,
        cantidad: Number(cantidad),
        comentario: comentario === '' ? null : comentario
      })
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error al registrar la reposición.');
        return data;
      })
      .then(reposicionCreada => {
        cuerpoHistorial.insertAdjacentHTML('afterbegin', renderizarFilaHistorial(reposicionCreada));

        const producto = productos.find(p => Number(p.id_producto) === Number(productoSeleccionado.id_producto));
        if (producto) {
          producto.stock = Number(producto.stock) + Number(cantidad);
        }

        productoSeleccionado = null;
        inputProducto.value = '';
        inputCantidad.value = '';
        inputComentario.value = '';
      })
      .catch(error => {
        console.error('Error al registrar la reposición:', error);
        alert(error.message);
      })
      .finally(() => {
        btnRegistrar.disabled = false;
      });
  });

  function cargarProductos() {
    return fetch('/productos')
      .then(res => res.json())
      .then(data => {
        productos = data;

        const parametros = new URLSearchParams(window.location.search);
        const idProductoPrellenado = parametros.get('id_producto');

        if (idProductoPrellenado) {
          const producto = productos.find(p => String(p.id_producto) === String(idProductoPrellenado));
          if (producto) seleccionarProducto(producto);
        }
      })
      .catch(error => console.error('Error al cargar productos:', error));
  }

  function cargarHistorial() {
    return fetch('/reposiciones')
      .then(res => res.json())
      .then(data => {
        cuerpoHistorial.innerHTML = data.length
          ? data.map(renderizarFilaHistorial).join('')
          : `<tr><td colspan="4">Todavía no se registraron reposiciones.</td></tr>`;
      })
      .catch(error => {
        console.error('Error al cargar el historial de reposiciones:', error);
        cuerpoHistorial.innerHTML = `<tr><td colspan="4">Error al cargar el historial.</td></tr>`;
      });
  }

  const avisoCompras = document.getElementById('avisoCompras');
  const textoAvisoCompras = document.getElementById('textoAvisoCompras');
  const panelComprasPendientes = document.getElementById('panelComprasPendientes');
  const cuerpoComprasPendientes = document.getElementById('cuerpoComprasPendientes');
  const errorComprasPendientes = document.getElementById('errorComprasPendientes');
  const mensajeExitoReposicion = document.getElementById('mensajeExitoReposicion');

  function actualizarAvisoCompras() {
    const cantidad = cuerpoComprasPendientes.querySelectorAll('tr').length;

    textoAvisoCompras.textContent = cantidad === 1
      ? 'Tenés 1 compra pendiente de reposición'
      : `Tenés ${cantidad} compras pendientes de reposición`;

    avisoCompras.classList.toggle('oculto', cantidad === 0);
    panelComprasPendientes.classList.toggle('oculto', cantidad === 0);
  }

  function renderizarCompraPendiente(compra) {
    return `
      <tr data-id="${compra.id_compra}">
        <td>${formatearFecha(compra.fecha_hora)}</td>
        <td>${escaparHTML(compra.productos)}</td>
        <td>${escaparHTML(compra.total_unidades)}</td>
        <td><button type="button" class="btn-accion btn-marcar-repuesta">Reponer</button></td>
      </tr>
    `;
  }

  function cargarComprasPendientes() {
    return fetch('/compras/pendientes')
      .then(res => res.json())
      .then(data => {
        cuerpoComprasPendientes.innerHTML = data.map(renderizarCompraPendiente).join('');
        actualizarAvisoCompras();
      })
      .catch(error => console.error('Error al cargar las compras pendientes:', error));
  }

  cuerpoComprasPendientes.addEventListener('click', function (evento) {
    const boton = evento.target.closest('.btn-marcar-repuesta');
    if (!boton) return;

    const fila = boton.closest('tr');
    boton.disabled = true;
    errorComprasPendientes.textContent = '';

    fetch(`/compras/${fila.dataset.id}/repuesta`, { method: 'PATCH' })
      .then(async res => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Error al marcar la compra como repuesta.');
        return data;
      })
      .then(data => {
        fila.remove();
        actualizarAvisoCompras();

        data.reposiciones.forEach(function (reposicion) {
          cuerpoHistorial.insertAdjacentHTML('afterbegin', renderizarFilaHistorial(reposicion));
        });

        mensajeExitoReposicion.classList.remove('saliendo');
        mensajeExitoReposicion.style.display = 'block';
        setTimeout(function () {
          mensajeExitoReposicion.classList.add('saliendo');
          setTimeout(function () {
            mensajeExitoReposicion.style.display = 'none';
            mensajeExitoReposicion.classList.remove('saliendo');
          }, 250);
        }, 3500);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch(error => {
        console.error('Error al marcar la compra como repuesta:', error);
        errorComprasPendientes.textContent = error.message;
        boton.disabled = false;
      });
  });

  Promise.all([cargarProductos(), cargarHistorial(), cargarComprasPendientes()]);

});
