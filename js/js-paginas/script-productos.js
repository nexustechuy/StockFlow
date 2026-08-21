function inicializarFiltrosProductos() {
  const input = document.getElementById('buscadorProductos');
  const botones = document.querySelectorAll('.btn-filtro');
  const filas = document.querySelectorAll('#tablaProductos tbody tr');

  let filtroActivo = 'todos';

  function aplicarFiltros() {
    const texto = input.value.trim().toLowerCase();
    let hayResultados = false;

    filas.forEach(fila => {
      const nombre = fila.querySelector('td')?.textContent.toLowerCase() || '';
      const estado = fila.getAttribute('data-estado');

      const coincideTexto = nombre.includes(texto);
      const coincideEstado = filtroActivo === 'todos' || estado === filtroActivo;

      if (coincideTexto && coincideEstado) {
        fila.classList.remove('oculto');
        hayResultados = true;
      } else {
        fila.classList.add('oculto');
      }
    });

    mostrarMensajeVacio(!hayResultados);
  }

  function mostrarMensajeVacio(mostrar) {
    let mensaje = document.querySelector('.sin-resultados');
    if (mostrar && !mensaje) {
      mensaje = document.createElement('p');
      mensaje.className = 'sin-resultados';
      mensaje.textContent = 'No se encontraron productos.';
      document.getElementById('tablaProductos').insertAdjacentElement('afterend', mensaje);
    } else if (!mostrar && mensaje) {
      mensaje.remove();
    }
  }

  input.addEventListener('input', aplicarFiltros);

  botones.forEach(btn => {
    btn.addEventListener('click', () => {
      botones.forEach(b => b.classList.remove('activo'));
      btn.classList.add('activo');
      filtroActivo = btn.getAttribute('data-filtro');
      aplicarFiltros();
    });
  });
}

document.addEventListener('DOMContentLoaded', inicializarFiltrosProductos);