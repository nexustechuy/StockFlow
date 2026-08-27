/**
 * Lógica específica de la pantalla Usuarios (Administrador):
 *  - Resaltar visualmente el rol seleccionado en el checklist del modal.
 *  - Toggle de "Estado inicial" (Activo / Inactivo) en el modal.
 *  - Filtro por rol (Todos / Vendedores / Repositores) sobre la tabla.
 *  - Búsqueda en vivo por nombre o email.
 *  - Alta de un usuario de prueba en la tabla al enviar el formulario
 *    (no persiste en ningún backend; es solo para la maqueta).
 */

document.addEventListener('DOMContentLoaded', function () {

  /* ===== Truncar textos largos (ej. emails) a 4 caracteres + "..." ===== */
  function truncarTexto(texto, cantidad) {
    if (texto.length <= cantidad) return texto;
    return texto.slice(0, cantidad) + '...';
  }

  function truncarCeldaEmail(celda) {
    const completo = celda.textContent.trim();
    celda.textContent = truncarTexto(completo, 4);
    celda.title = completo; // el email completo queda como tooltip al pasar el mouse
  }

  // Emails ya presentes en la tabla al cargar la página
  document.querySelectorAll('#cuerpoTablaUsuarios tr').forEach(function (fila) {
    const celdaEmail = fila.children[1]; // 2da columna: Email
    if (celdaEmail) truncarCeldaEmail(celdaEmail);
  });

  /* ===== Checklist de roles: resaltar la opción marcada ===== */
  document.querySelectorAll('#listaRoles .rol-item input[type="checkbox"]').forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
      checkbox.closest('.rol-item').classList.toggle('seleccionado', checkbox.checked);
    });
  });

  /* ===== Toggle de estado inicial (Activo / Inactivo) ===== */
  const estadoToggle = document.getElementById('estadoToggle');
  const estadoInicialInput = document.getElementById('estadoInicial');

  if (estadoToggle) {
    estadoToggle.querySelectorAll('button').forEach(function (boton) {
      boton.addEventListener('click', function () {
        estadoToggle.querySelectorAll('button').forEach(function (b) {
          b.classList.remove('seleccionado');
        });
        boton.classList.add('seleccionado');
        estadoInicialInput.value = boton.dataset.estado;
      });
    });
  }

  /* ===== Filtro por rol + búsqueda por texto ===== */
  const chips = document.querySelectorAll('.filtro-chip');
  const inputBusqueda = document.getElementById('buscarUsuario');
  let filtroActual = 'todos';

  function aplicarFiltros() {
    const texto = inputBusqueda.value.trim().toLowerCase();
    const filas = document.querySelectorAll('#cuerpoTablaUsuarios tr');

    filas.forEach(function (fila) {
      const coincideRol = filtroActual === 'todos' || fila.dataset.rol === filtroActual;

      // Se busca tanto en el texto visible como en los "title" (ej. el
      // email completo, que en la celda se muestra truncado).
      const titulosCeldas = Array.from(fila.querySelectorAll('[title]'))
        .map(function (el) { return el.title; })
        .join(' ');
      const textoBusqueda = (fila.textContent + ' ' + titulosCeldas).toLowerCase();
      const coincideTexto = textoBusqueda.includes(texto);

      fila.style.display = (coincideRol && coincideTexto) ? '' : 'none';
    });
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('activo'); });
      chip.classList.add('activo');
      filtroActual = chip.dataset.filtro;
      aplicarFiltros();
    });
  });

  if (inputBusqueda) {
    inputBusqueda.addEventListener('input', aplicarFiltros);
  }

  /* ===== Alta de usuario (maqueta, sin backend) ===== */
  const formNuevoUsuario = document.getElementById('formNuevoUsuario');
  const errorDiv = document.getElementById('errorNuevoUsuario');
  const cuerpoTabla = document.getElementById('cuerpoTablaUsuarios');
  const modalNuevoUsuarioEl = document.getElementById('modalNuevoUsuario');

  function mostrarError(mensaje) {
    errorDiv.textContent = mensaje;
    errorDiv.style.display = 'block';
  }

  function ocultarError() {
    errorDiv.style.display = 'none';
  }

  function iniciales(nombreCompleto) {
    return nombreCompleto
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(function (palabra) { return palabra[0].toUpperCase(); })
      .join('');
  }

  if (formNuevoUsuario) {
    formNuevoUsuario.addEventListener('submit', function (evento) {
      evento.preventDefault();
      ocultarError();

      const nombre = document.getElementById('nombreCompleto').value.trim();
      const email = document.getElementById('emailNuevoUsuario').value.trim();
      const contrasena = document.getElementById('contrasenaNuevoUsuario').value;
      const confirmar = document.getElementById('confirmarContrasena').value;

      const rolesSeleccionados = Array.from(
        formNuevoUsuario.querySelectorAll('input[name="roles"]:checked')
      ).map(function (input) { return input.value; });

      if (!nombre || !email || !contrasena || !confirmar) {
        mostrarError('Completá todos los campos obligatorios.');
        return;
      }

      if (contrasena !== confirmar) {
        mostrarError('Las contraseñas no coinciden.');
        return;
      }

      if (rolesSeleccionados.length === 0) {
        mostrarError('Seleccioná al menos un rol para el usuario.');
        return;
      }

      const estado = estadoInicialInput.value; // 'activo' | 'inactivo'
      const rolPrincipal = rolesSeleccionados[0];
      const textoRoles = rolesSeleccionados
        .map(function (r) { return r.charAt(0).toUpperCase() + r.slice(1); })
        .join(' / ');

      const nuevaFila = document.createElement('tr');
      nuevaFila.dataset.rol = rolPrincipal;
      nuevaFila.innerHTML =
        '<td><div class="celda-usuario"><span class="avatar-usuario">' + iniciales(nombre) + '</span>' + nombre + '</div></td>' +
        '<td title="' + email + '">' + truncarTexto(email, 4) + '</td>' +
        '<td>' + textoRoles + '</td>' +
        '<td><span class="' + (estado === 'activo' ? 'ingreso' : 'alerta') + '">' +
          (estado === 'activo' ? 'Activo' : 'Inactivo') + '</span></td>' +
        '<td>' +
          '<div class="dropdown">' +
            '<button class="btn-accion" data-bs-toggle="dropdown" aria-expanded="false">•••</button>' +
            '<ul class="dropdown-menu dropdown-menu-end">' +
              '<li><a class="dropdown-item" href="#"><i class="bi bi-pencil me-2"></i>Editar</a></li>' +
              '<li><a class="dropdown-item" href="#"><i class="bi bi-arrow-repeat me-2"></i>Cambiar estado</a></li>' +
              '<li><a class="dropdown-item text-peligro" href="#"><i class="bi bi-trash me-2"></i>Eliminar</a></li>' +
            '</ul>' +
          '</div>' +
        '</td>';

      cuerpoTabla.appendChild(nuevaFila);

      formNuevoUsuario.reset();
      document.querySelectorAll('#listaRoles .rol-item').forEach(function (item) {
        item.classList.remove('seleccionado');
      });
      document.querySelector('#listaRoles input[value="administrador"]').checked = true;
      document.querySelector('#listaRoles input[value="administrador"]').closest('.rol-item').classList.add('seleccionado');
      estadoToggle.querySelectorAll('button').forEach(function (b) { b.classList.remove('seleccionado'); });
      estadoToggle.querySelector('[data-estado="activo"]').classList.add('seleccionado');
      estadoInicialInput.value = 'activo';

      const modal = bootstrap.Modal.getInstance(modalNuevoUsuarioEl);
      modal.hide();
    });

    // Limpiar el mensaje de error cada vez que se abre el modal
    modalNuevoUsuarioEl.addEventListener('show.bs.modal', ocultarError);
  }

});
