/**
 * Lógica de la pantalla Reposiciones (Repositor):
 *  - Buscador de productos con lista desplegable de sugerencias.
 *  - Validación de los campos obligatorios (Producto y Cantidad).
 *  - Al registrar, se agrega una fila nueva arriba del historial con la fecha actual
 *    y se limpia el formulario (no hay backend, es solo para la maqueta).
 */

document.addEventListener('DOMContentLoaded', function () {

  // Productos mock para el buscador (mismos que usa el resto del proyecto)
  const productos = ['Mouse inalámbrico', 'Teclado USB', 'Monitor 24"', 'Auriculares Bluetooth', 'Cable HDMI'];

  const campoProducto = document.getElementById('campoProducto');
  const inputProducto = document.getElementById('inputProducto');
  const listaSugerencias = document.getElementById('listaSugerenciasProducto');

  const campoCantidad = document.getElementById('campoCantidad');
  const inputCantidad = document.getElementById('inputCantidad');

  const inputComentario = document.getElementById('inputComentario');

  const btnRegistrar = document.getElementById('btnRegistrarReposicion');
  const cuerpoHistorial = document.getElementById('cuerpoHistorial');

  /* ===== Mostrar / limpiar errores de un campo ===== */
  function mostrarErrorCampo(campo, mensaje) {
    campo.classList.add('campo-invalido');
    campo.querySelector('.error-campo').textContent = mensaje;
  }

  function limpiarErrorCampo(campo) {
    campo.classList.remove('campo-invalido');
    campo.querySelector('.error-campo').textContent = '';
  }

  /* ===== Buscador de productos con lista desplegable ===== */
  inputProducto.addEventListener('input', function () {
    limpiarErrorCampo(campoProducto);

    const texto = inputProducto.value.trim().toLowerCase();
    listaSugerencias.innerHTML = '';

    if (texto === '') {
      listaSugerencias.style.display = 'none';
      return;
    }

    const coincidencias = productos.filter(function (nombre) {
      return nombre.toLowerCase().includes(texto);
    });

    if (coincidencias.length === 0) {
      listaSugerencias.style.display = 'none';
      return;
    }

    coincidencias.forEach(function (nombre) {
      const item = document.createElement('li');
      item.textContent = nombre;
      item.addEventListener('click', function () {
        inputProducto.value = nombre;
        listaSugerencias.innerHTML = '';
        listaSugerencias.style.display = 'none';
      });
      listaSugerencias.appendChild(item);
    });

    listaSugerencias.style.display = 'block';
  });

  // Cierra la lista de sugerencias al hacer clic fuera del buscador
  document.addEventListener('click', function (evento) {
    if (!campoProducto.contains(evento.target)) {
      listaSugerencias.style.display = 'none';
    }
  });

  inputCantidad.addEventListener('input', function () {
    limpiarErrorCampo(campoCantidad);
  });

  /* ===== Fecha actual con formato DD/MM/AAAA ===== */
  function obtenerFechaActual() {
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0');
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    return dia + '/' + mes + '/' + hoy.getFullYear();
  }

  /* ===== Registrar una reposición nueva ===== */
  btnRegistrar.addEventListener('click', function () {
    const producto = inputProducto.value.trim();
    const cantidad = inputCantidad.value.trim();
    const comentario = inputComentario.value.trim();

    let hayError = false;

    if (producto === '') {
      mostrarErrorCampo(campoProducto, 'Ingresá el producto a reponer.');
      hayError = true;
    }

    if (cantidad === '' || parseInt(cantidad, 10) < 1) {
      mostrarErrorCampo(campoCantidad, 'Ingresá una cantidad válida.');
      hayError = true;
    }

    if (hayError) return;

    const fila = document.createElement('tr');
    fila.innerHTML =
      '<td>' + producto + '</td>' +
      '<td>' + cantidad + '</td>' +
      '<td>' + obtenerFechaActual() + '</td>' +
      '<td>' + (comentario === '' ? '-' : comentario) + '</td>';

    cuerpoHistorial.insertBefore(fila, cuerpoHistorial.firstChild);

    inputProducto.value = '';
    inputCantidad.value = '';
    inputComentario.value = '';
  });

});
