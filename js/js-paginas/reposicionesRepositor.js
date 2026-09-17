document.addEventListener('DOMContentLoaded', function () {

  const ID_USUARIO_REPOSITOR = 2;

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
      return producto.nombre.toLowerCase().includes(texto);
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
        <td>${reposicion.producto_nombre}</td>
        <td>${reposicion.cantidad}</td>
        <td>${formatearFecha(reposicion.fecha_hora)}</td>
        <td>${reposicion.comentario ?? '-'}</td>
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

    fetch('http://localhost:3000/reposiciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_producto: productoSeleccionado.id_producto,
        cantidad: Number(cantidad),
        comentario: comentario === '' ? null : comentario,
        id_usuario: ID_USUARIO_REPOSITOR
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
    return fetch('http://localhost:3000/productos')
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
    return fetch('http://localhost:3000/reposiciones')
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

  Promise.all([cargarProductos(), cargarHistorial()]);

});
