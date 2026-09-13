/**
 * Lógica de la pantalla Productos (Repositor):
 *  - Buscador que filtra la tabla en tiempo real por nombre de producto.
 *  - Filtros rápidos por estado (Todos / Disponible / Stock bajo / Sin stock).
 *  - Buscador y filtro se aplican juntos: cambiar uno respeta el otro.
 *  - El botón "Reponer" de cada fila lleva a la pantalla de Reposiciones.
 */

document.addEventListener('DOMContentLoaded', function () {

  const buscador = document.getElementById('buscadorProductos');
  const botonesFiltro = document.querySelectorAll('.filtro-chip');
  const filas = document.querySelectorAll('#tablaProductos tbody tr');
  const sinResultados = document.getElementById('sinResultadosProductos');

  let filtroActivo = 'todos';

  function aplicarFiltros() {
    const texto = buscador.value.trim().toLowerCase();
    let hayResultados = false;

    filas.forEach(function (fila) {
      const nombre = fila.querySelector('td').textContent.toLowerCase();
      const estado = fila.dataset.estado;

      const coincideTexto = nombre.includes(texto);
      const coincideEstado = filtroActivo === 'todos' || estado === filtroActivo;

      if (coincideTexto && coincideEstado) {
        fila.classList.remove('oculto');
        hayResultados = true;
      } else {
        fila.classList.add('oculto');
      }
    });

    sinResultados.style.display = hayResultados ? 'none' : 'block';
  }

  buscador.addEventListener('input', aplicarFiltros);

  botonesFiltro.forEach(function (boton) {
    boton.addEventListener('click', function () {
      botonesFiltro.forEach(function (b) { b.classList.remove('activo'); });
      boton.classList.add('activo');
      filtroActivo = boton.dataset.filtro;
      aplicarFiltros();
    });
  });

  // Botón "Reponer": por ahora solo redirige a la pantalla de Reposiciones
  document.querySelectorAll('.btn-reponer').forEach(function (boton) {
    boton.addEventListener('click', function () {
      window.location.href = 'reposicionesRepositor.html';
    });
  });

});
