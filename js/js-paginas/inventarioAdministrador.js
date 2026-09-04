/**
 * Lógica específica de la pantalla Inventario (Administrador):
 *  - Pestañas (Productos / Categorías / Alertas de stock) vía classList,
 *    sin navegar entre páginas.
 *  - Pestaña Productos: búsqueda + filtros rápidos por estado, resaltado
 *    de la fila mientras su popup de acciones (···) está abierto, y
 *    "Eliminar producto" pide confirmación dentro del mismo popup.
 *  - Pestaña Categorías: búsqueda, alta de categoría en memoria desde el
 *    panel lateral inline, y eliminación con popup de confirmación.
 *  - Pestaña Alertas: solo lectura (el stock mínimo se edita desde
 *    "Editar producto", no acá).
 * No hay backend: todo se maneja en memoria contra el DOM, se pierde al recargar.
 */

document.addEventListener('DOMContentLoaded', function () {

  /* ===== Pestañas ===== */
  const botonesPestana = document.querySelectorAll('.pestana');
  const panelesPestana = document.querySelectorAll('.panel-pestana');

  botonesPestana.forEach(function (boton) {
    boton.addEventListener('click', function () {
      botonesPestana.forEach(function (b) { b.classList.remove('activa'); });
      boton.classList.add('activa');

      const destino = boton.dataset.pestana;
      panelesPestana.forEach(function (panel) {
        panel.classList.toggle('oculto', panel.dataset.panel !== destino);
      });
    });
  });

  function irAPestana(nombre) {
    const boton = document.querySelector('.pestana[data-pestana="' + nombre + '"]');
    if (boton) boton.click();
  }

  const linkVerEnInventario = document.getElementById('linkVerEnInventario');
  if (linkVerEnInventario) {
    linkVerEnInventario.addEventListener('click', function (evento) {
      evento.preventDefault();
      irAPestana('productos');
    });
  }

  /* ===== Pestaña Productos: búsqueda + filtros rápidos ===== */
  const inputBuscarProducto = document.getElementById('buscarProducto');
  const chipsProducto = document.querySelectorAll('[data-panel="productos"] .filtro-chip');
  let filtroProductoActual = 'todos';

  function aplicarFiltrosProductos() {
    const texto = inputBuscarProducto.value.trim().toLowerCase();
    const filas = document.querySelectorAll('#cuerpoTablaProductos tr');

    filas.forEach(function (fila) {
      const coincideEstado = filtroProductoActual === 'todos' ||
        fila.dataset.estado === filtroProductoActual;
      const coincideTexto = fila.textContent.toLowerCase().includes(texto);
      fila.style.display = (coincideEstado && coincideTexto) ? '' : 'none';
    });
  }

  chipsProducto.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chipsProducto.forEach(function (c) { c.classList.remove('activo'); });
      chip.classList.add('activo');
      filtroProductoActual = chip.dataset.filtro;
      aplicarFiltrosProductos();
    });
  });

  if (inputBuscarProducto) {
    inputBuscarProducto.addEventListener('input', aplicarFiltrosProductos);
  }

  /* ===== Popup de acciones de un producto: resaltar fila + confirmar borrado =====
     El popup tiene dos vistas dentro del mismo dropdown: la lista de acciones
     (vista-acciones) y la confirmación de borrado (vista-confirmacion), igual
     que el popup de "Eliminar categoría". Se alterna cuál se ve con classList,
     y al reabrir el popup siempre vuelve a mostrar la lista de acciones. */
  document.querySelectorAll('#cuerpoTablaProductos .dropdown').forEach(function (dropdown) {
    const fila = dropdown.closest('tr');
    const vistaAcciones = dropdown.querySelector('.vista-acciones');
    const vistaConfirmacion = dropdown.querySelector('.vista-confirmacion');
    const btnPedirConfirmacion = dropdown.querySelector('.btn-pedir-confirmacion');
    const btnConfirmar = dropdown.querySelector('.btn-confirmar-eliminar-producto');

    dropdown.addEventListener('show.bs.dropdown', function () {
      fila.classList.add('fila-activa');
      vistaAcciones.classList.remove('oculto');
      vistaConfirmacion.classList.add('oculto');
    });
    dropdown.addEventListener('hide.bs.dropdown', function () {
      fila.classList.remove('fila-activa');
    });

    btnPedirConfirmacion.addEventListener('click', function (evento) {
      evento.preventDefault();
      vistaAcciones.classList.add('oculto');
      vistaConfirmacion.classList.remove('oculto');
    });

    btnConfirmar.addEventListener('click', function () {
      fila.remove();
    });
  });

  /* ===== Modal: Detalle de producto ===== */
  const modalDetalleProducto = document.getElementById('modalDetalleProducto');

  if (modalDetalleProducto) {
    modalDetalleProducto.addEventListener('show.bs.modal', function (evento) {
      const disparador = evento.relatedTarget; // el link "Ver detalle" clickeado
      const fila = disparador.closest('tr');
      const celdas = fila.querySelectorAll('td');

      document.getElementById('detalleProductoNombre').textContent = celdas[0].textContent.trim();
      document.getElementById('detalleProductoCategoria').textContent = celdas[1].textContent.trim();
      document.getElementById('detalleProductoPrecio').textContent = celdas[2].textContent.trim();
      document.getElementById('detalleProductoStockActual').textContent = celdas[3].textContent.trim();
      document.getElementById('detalleProductoStockMinimo').textContent = celdas[4].textContent.trim();

      const badgeEstado = celdas[5].querySelector('.badge-estado');
      const estadoEl = document.getElementById('detalleProductoEstado');
      estadoEl.innerHTML = '';
      estadoEl.appendChild(badgeEstado.cloneNode(true));

      // El popup de acciones no se cierra solo al clickear adentro
      // (data-bs-auto-close="outside"), así que lo cerramos a mano.
      const botonAcciones = fila.querySelector('.btn-accion');
      const dropdownInstancia = bootstrap.Dropdown.getInstance(botonAcciones);
      if (dropdownInstancia) dropdownInstancia.hide();
    });
  }

  /* ===== Pestaña Categorías: búsqueda ===== */
  const inputBuscarCategoria = document.getElementById('buscarCategoria');
  const listaCategorias = document.getElementById('listaCategorias');

  function aplicarBusquedaCategorias() {
    const texto = inputBuscarCategoria.value.trim().toLowerCase();
    listaCategorias.querySelectorAll('.categoria-item').forEach(function (item) {
      const nombre = item.dataset.categoria.toLowerCase();
      item.style.display = nombre.includes(texto) ? '' : 'none';
    });
  }

  if (inputBuscarCategoria) {
    inputBuscarCategoria.addEventListener('input', aplicarBusquedaCategorias);
  }

  /* ===== Panel lateral: nueva categoría ===== */
  const btnNuevaCategoria = document.getElementById('btnNuevaCategoria');
  const layoutCategorias = document.getElementById('layoutCategorias');
  const panelNuevaCategoria = document.getElementById('panelNuevaCategoria');
  const formNuevaCategoria = document.getElementById('formNuevaCategoria');

  function togglePanelNuevaCategoria(mostrar) {
    panelNuevaCategoria.classList.toggle('oculto', !mostrar);
    layoutCategorias.classList.toggle('sin-panel', !mostrar);
  }

  if (btnNuevaCategoria) {
    btnNuevaCategoria.addEventListener('click', function () {
      const yaVisible = !panelNuevaCategoria.classList.contains('oculto');
      togglePanelNuevaCategoria(!yaVisible);
    });
  }

  function crearPopupEliminarCategoria(nombre) {
    const wrapper = document.createElement('div');
    wrapper.className = 'dropdown';
    wrapper.innerHTML =
      '<button type="button" class="btn-eliminar-categoria" data-bs-toggle="dropdown" aria-expanded="false">' +
      '<i class="bi bi-trash"></i>' +
      '</button>' +
      '<ul class="dropdown-menu dropdown-menu-end popup-menu popup-confirmacion">' +
      '<li class="popup-header">Eliminar categoría</li>' +
      '<li><p>¿Eliminar "' + nombre + '"? Esta acción no se puede deshacer.</p></li>' +
      '<li class="acciones-confirmacion">' +
      '<button type="button" class="btn-cancelar-eliminar" data-bs-dismiss="dropdown">Cancelar</button>' +
      '<button type="button" class="btn-confirmar-eliminar">Eliminar</button>' +
      '</li>' +
      '</ul>';
    return wrapper;
  }

  function agregarCategoria(nombre, descripcion) {
    const item = document.createElement('div');
    item.className = 'categoria-item';
    item.dataset.categoria = nombre;

    const info = document.createElement('div');
    info.className = 'categoria-info';
    info.innerHTML =
      '<div class="nombre">' + nombre + '</div>' +
      '<div class="cantidad">0 productos</div>';
    if (descripcion) info.title = descripcion;

    item.appendChild(info);
    item.appendChild(crearPopupEliminarCategoria(nombre));
    listaCategorias.appendChild(item);
  }

  if (formNuevaCategoria) {
    formNuevaCategoria.addEventListener('submit', function (evento) {
      evento.preventDefault();

      const nombre = document.getElementById('nombreCategoria').value.trim();
      const descripcion = document.getElementById('descripcionCategoria').value.trim();
      if (!nombre) return;

      agregarCategoria(nombre, descripcion);

      formNuevaCategoria.reset();
      togglePanelNuevaCategoria(false);
    });
  }

  /* ===== Eliminar categoría (con confirmación) ===== */
  listaCategorias.addEventListener('click', function (evento) {
    const boton = evento.target.closest('.btn-confirmar-eliminar');
    if (!boton) return;
    boton.closest('.categoria-item').remove();
  });

});
