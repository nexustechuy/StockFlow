document.addEventListener('DOMContentLoaded', function () {

  const buscador = document.getElementById('buscadorProductos');
  const botonesFiltro = document.querySelectorAll('.filtro-chip');
  const cuerpoTabla = document.getElementById('cuerpoTablaProductos');
  const sinResultados = document.getElementById('sinResultadosProductos');

  let productos = [];
  let filtroActivo = 'todos';
  let textoBusqueda = '';

  function calcularEstado(producto) {
    const stock = Number(producto.stock);
    const minimo = Number(producto.stock_minimo);

    if (stock === 0) {
      return { estado: 'Sin stock', clase: 'sinstock', claseSpan: 'alerta' };
    }
    if (stock <= minimo) {
      return { estado: 'Stock bajo', clase: 'bajo', claseSpan: 'atencion' };
    }
    return { estado: 'Disponible', clase: 'disponible', claseSpan: 'ingreso' };
  }

  function renderizarFila(producto) {
    const { estado, clase, claseSpan } = calcularEstado(producto);

    return `
      <tr data-estado="${clase}">
        <td>${producto.nombre}</td>
        <td>${producto.categoria}</td>
        <td>${producto.stock}</td>
        <td>${producto.stock_minimo}</td>
        <td><span class="${claseSpan}">${estado}</span></td>
        <td>
          <button type="button" class="btn-accion btn-reponer" data-id="${producto.id_producto}"
            data-nombre="${producto.nombre}">Reponer</button>
        </td>
      </tr>
    `;
  }

  function aplicarFiltros() {
    let lista = productos;

    if (filtroActivo !== 'todos') {
      lista = lista.filter(p => calcularEstado(p).clase === filtroActivo);
    }

    if (textoBusqueda.trim() !== '') {
      const texto = textoBusqueda.toLowerCase();
      lista = lista.filter(p => p.nombre.toLowerCase().includes(texto));
    }

    cuerpoTabla.innerHTML = lista.map(renderizarFila).join('');
    sinResultados.style.display = lista.length ? 'none' : 'block';
  }

  buscador.addEventListener('input', function () {
    textoBusqueda = buscador.value;
    aplicarFiltros();
  });

  botonesFiltro.forEach(function (boton) {
    boton.addEventListener('click', function () {
      botonesFiltro.forEach(function (b) { b.classList.remove('activo'); });
      boton.classList.add('activo');
      filtroActivo = boton.dataset.filtro;
      aplicarFiltros();
    });
  });

  cuerpoTabla.addEventListener('click', function (evento) {
    const boton = evento.target.closest('.btn-reponer');
    if (!boton) return;

    const parametros = new URLSearchParams({
      id_producto: boton.dataset.id,
      nombre: boton.dataset.nombre
    });

    window.location.href = 'reposicionesRepositor.html?' + parametros.toString();
  });

  function cargarProductos() {
    fetch('http://localhost:3000/productos')
      .then(res => res.json())
      .then(data => {
        productos = data;
        aplicarFiltros();
      })
      .catch(error => {
        console.error('Error al cargar productos:', error);
        cuerpoTabla.innerHTML = `<tr><td colspan="6">Error al cargar los productos.</td></tr>`;
      });
  }

  cargarProductos();

});
