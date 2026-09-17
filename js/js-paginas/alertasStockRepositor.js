document.addEventListener('DOMContentLoaded', function () {

  const cuerpoTabla = document.getElementById('cuerpoTablaAlertas');

  function renderizarFila(producto) {
    return `
      <tr>
        <td>${producto.nombre}</td>
        <td>${producto.categoria}</td>
        <td>${producto.stock_minimo}</td>
        <td>
          <button class="btn-accion btn-reponer" data-id="${producto.id_producto}"
            data-nombre="${producto.nombre}">Reponer</button>
        </td>
      </tr>
    `;
  }

  function renderizar(productos) {
    const sinStock = productos.filter(p => Number(p.stock) === 0);
    const criticos = productos.filter(p => Number(p.stock) > 0 && Number(p.stock) <= Number(p.stock_minimo));
    const aReponer = [...sinStock, ...criticos];

    document.getElementById('sinStockValor').textContent = sinStock.length;
    document.getElementById('stockCriticoValor').textContent = criticos.length;
    document.getElementById('aReponerValor').textContent = aReponer.length;

    document.getElementById('alertaTexto').textContent =
      `Tienes ${criticos.length} producto${criticos.length === 1 ? '' : 's'} con bajo stock y ${sinStock.length} sin stock`;

    cuerpoTabla.innerHTML = aReponer.length
      ? aReponer.map(renderizarFila).join('')
      : `<tr><td colspan="4">No hay productos para reponer.</td></tr>`;
  }

  cuerpoTabla.addEventListener('click', function (evento) {
    const boton = evento.target.closest('.btn-reponer');
    if (!boton) return;

    const parametros = new URLSearchParams({
      id_producto: boton.dataset.id,
      nombre: boton.dataset.nombre
    });

    window.location.href = 'reposicionesRepositor.html?' + parametros.toString();
  });

  fetch('http://localhost:3000/productos')
    .then(res => res.json())
    .then(renderizar)
    .catch(error => {
      console.error('Error al cargar productos:', error);
      cuerpoTabla.innerHTML = `<tr><td colspan="4">Error al cargar los productos.</td></tr>`;
    });

});
