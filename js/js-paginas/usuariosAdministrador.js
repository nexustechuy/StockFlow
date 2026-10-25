// Lógica de la pantalla Usuarios (Administrador)
// - Resalta el rol elegido en el modal
// - Toggle de estado inicial (activo/inactivo)
// - Filtro por rol y búsqueda por nombre o email
// - Alta de usuarios de prueba en la tabla (aún no se guarda en la base)
// - Edición de usuarios: precarga la fila en el modal, actualiza la tabla y envía al backend

document.addEventListener('DOMContentLoaded', function () {

  /* Truncar textos largos (ej. emails) a 4 caracteres + "..." */
  function truncarTexto(texto, cantidad) {
    if (texto.length <= cantidad) return texto;
    return texto.slice(0, cantidad) + '...';
  }

  function truncarCeldaEmail(celda) {
    const completo = celda.textContent.trim();
    celda.textContent = truncarTexto(completo, 4);
    celda.title = completo; // el email completo queda como tooltip al pasar el mouse
  }

  // Emails que ya están en la tabla
  document.querySelectorAll('#cuerpoTablaUsuarios tr').forEach(function (fila) {
    const celdaEmail = fila.children[1]; // 2da columna: Email
    if (celdaEmail) truncarCeldaEmail(celdaEmail);
  });

  /* Roles: resaltar el marcado (modal nuevo y modal editar) */
  document.querySelectorAll('.lista-roles .rol-item input[type="checkbox"]').forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
      checkbox.closest('.rol-item').classList.toggle('seleccionado', checkbox.checked);
    });
  });

  /* Toggle de estado inicial (activo/inactivo) */
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

  /* Filtro por rol + búsqueda por texto */
  const chips = document.querySelectorAll('.filtro-chip');
  const inputBusqueda = document.getElementById('buscarUsuario');
  let filtroActual = 'todos';

  function aplicarFiltros() {
    const texto = inputBusqueda.value.trim().toLowerCase();
    const filas = document.querySelectorAll('#cuerpoTablaUsuarios tr');

    filas.forEach(function (fila) {
      const coincideRol = filtroActual === 'todos' ||
        fila.dataset.rol.split(' ').includes(filtroActual);
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

  /* Alta de usuario (sin backend) */
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

  // ['administrador', 'vendedor'] -> "Administrador / Vendedor"
  function formatearRoles(roles) {
    return roles
      .map(function (r) { return r.charAt(0).toUpperCase() + r.slice(1); })
      .join(' / ');
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

      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regexEmail.test(email)) {
        mostrarError('Ingresá un email válido (ej: usuario@stockflow.com).');
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

      const estado = estadoInicialInput.value;
      const textoRoles = formatearRoles(rolesSeleccionados);

      const nuevaFila = document.createElement('tr');
      // Guardo todos los roles para que el filtro lo encuentre
      nuevaFila.dataset.rol = rolesSeleccionados.join(' ');
      nuevaFila.innerHTML =
        '<td><div class="celda-usuario"><span class="avatar-usuario">' + iniciales(nombre) + '</span>' + nombre + '</div></td>' +
        '<td title="' + email + '">' + truncarTexto(email, 4) + '</td>' +
        '<td>' + textoRoles + '</td>' +
        '<td><span class="' + (estado === 'activo' ? 'ingreso' : 'alerta') + '">' +
        (estado === 'activo' ? 'Activo' : 'Inactivo') + '</span></td>' +
        '<td>' +
        '<div class="dropdown">' +
        '<button class="btn-accion" data-bs-toggle="dropdown" data-bs-popper-config=\'{"strategy":"fixed"}\' aria-expanded="false">•••</button>' +
        '<ul class="dropdown-menu dropdown-menu-end">' +
        '<li><a class="dropdown-item editar-usuario" href="#" data-bs-toggle="modal" data-bs-target="#modalEditarUsuario"><i class="bi bi-pencil me-2"></i>Editar usuario</a></li>' +
        '<li><a class="dropdown-item cambiar-estado" href="#"><i class="bi bi-arrow-repeat me-2"></i>Cambiar estado</a></li>' +
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

    // Limpia el error al abrir el modal
    modalNuevoUsuarioEl.addEventListener('show.bs.modal', ocultarError);
  }

  /* Cambiar estado (activo/inactivo) */
  cuerpoTabla.addEventListener('click', function (evento) {
    const opcion = evento.target.closest('.cambiar-estado');
    if (!opcion) return;
    evento.preventDefault();

    const estado = opcion.closest('tr').querySelector('td:nth-child(4) span');
    const estabaActivo = estado.textContent.trim() === 'Activo';

    estado.className = estabaActivo ? 'alerta' : 'ingreso';
    estado.textContent = estabaActivo ? 'Inactivo' : 'Activo';
  });

  /* Editar usuario */
  const modalEditarUsuarioEl = document.getElementById('modalEditarUsuario');
  const formEditarUsuario = document.getElementById('formEditarUsuario');

  if (modalEditarUsuarioEl && formEditarUsuario) {
    const errorEditarDiv = document.getElementById('errorEditarUsuario');
    const inputNombreEditar = document.getElementById('nombreEditarUsuario');
    const inputEmailEditar = document.getElementById('emailEditarUsuario');
    const inputContrasenaEditar = document.getElementById('contrasenaEditarUsuario');
    const inputConfirmarEditar = document.getElementById('confirmarContrasenaEditar');
    const listaRolesEditar = document.getElementById('listaRolesEditar');
    const estadoToggleEditar = document.getElementById('estadoToggleEditar');
    const estadoEditarInput = document.getElementById('estadoEditar');
    const campoRolesEditar = listaRolesEditar.closest('.campo-formulario');
    let filaEditando = null;

    function mostrarErrorCampo(campo, mensaje) {
      campo.classList.add('campo-invalido');
      campo.querySelector('.error-campo').textContent = mensaje;
    }

    function limpiarErroresEditar() {
      formEditarUsuario.querySelectorAll('.campo-invalido').forEach(function (campo) {
        campo.classList.remove('campo-invalido');
      });
      formEditarUsuario.querySelectorAll('.error-campo').forEach(function (span) {
        span.textContent = '';
      });
      errorEditarDiv.style.display = 'none';
    }

    // Mostrar/ocultar contraseña: misma lógica que el login
    formEditarUsuario.querySelectorAll('.mostrar-contrasena').forEach(function (botonMostrar) {
      const contrasena = botonMostrar.closest('.contenedor-contrasena').querySelector('input');

      botonMostrar.addEventListener('click', function () {
        const icono = botonMostrar.querySelector('i');

        if (contrasena.type === 'password') {
          contrasena.type = 'text';
          icono.classList.remove('bi-eye');
          icono.classList.add('bi-eye-slash');
          botonMostrar.setAttribute('aria-label', 'Ocultar contraseña');
          botonMostrar.setAttribute('title', 'Ocultar contraseña');
        } else {
          contrasena.type = 'password';
          icono.classList.remove('bi-eye-slash');
          icono.classList.add('bi-eye');
          botonMostrar.setAttribute('aria-label', 'Mostrar contraseña');
          botonMostrar.setAttribute('title', 'Mostrar contraseña');
        }
      });
    });

    function ocultarContrasenas() {
      formEditarUsuario.querySelectorAll('.mostrar-contrasena').forEach(function (botonMostrar) {
        const contrasena = botonMostrar.closest('.contenedor-contrasena').querySelector('input');
        if (contrasena.type === 'text') botonMostrar.click();
      });
    }

    function seleccionarEstadoEditar(estado) {
      estadoToggleEditar.querySelectorAll('button').forEach(function (b) {
        b.classList.toggle('seleccionado', b.dataset.estado === estado);
      });
      estadoEditarInput.value = estado;
    }

    estadoToggleEditar.querySelectorAll('button').forEach(function (boton) {
      boton.addEventListener('click', function () {
        seleccionarEstadoEditar(boton.dataset.estado);
      });
    });

    // Lee los datos actuales de una fila de la tabla
    function leerDatosFila(fila) {
      const celdaUsuario = fila.querySelector('.celda-usuario');
      const nombre = Array.from(celdaUsuario.childNodes)
        .filter(function (nodo) { return nodo.nodeType === Node.TEXT_NODE; })
        .map(function (nodo) { return nodo.textContent; })
        .join('')
        .trim();
      const celdaEmail = fila.children[1];

      return {
        nombre: nombre,
        email: celdaEmail.title || celdaEmail.textContent.trim(),
        roles: fila.dataset.rol.split(' '),
        estado: fila.querySelector('td:nth-child(4) span').textContent.trim() === 'Activo' ? 'activo' : 'inactivo'
      };
    }

    // Carga los datos de la fila en los campos del modal
    function cargarDatosEnModal(fila) {
      const datos = leerDatosFila(fila);

      inputNombreEditar.value = datos.nombre;
      inputEmailEditar.value = datos.email;
      inputContrasenaEditar.value = '';
      inputConfirmarEditar.value = '';

      listaRolesEditar.querySelectorAll('input[name="roles"]').forEach(function (checkbox) {
        checkbox.checked = datos.roles.includes(checkbox.value);
        checkbox.closest('.rol-item').classList.toggle('seleccionado', checkbox.checked);
      });

      seleccionarEstadoEditar(datos.estado);
      ocultarContrasenas();
      limpiarErroresEditar();
    }

    // Al abrir: precargar la fila del botón "Editar usuario" que se tocó
    modalEditarUsuarioEl.addEventListener('show.bs.modal', function (evento) {
      const disparador = evento.relatedTarget;
      filaEditando = disparador ? disparador.closest('tr') : null;
      if (filaEditando) cargarDatosEnModal(filaEditando);
    });

    // Al cerrar sin guardar: restaurar los valores originales de la fila
    modalEditarUsuarioEl.addEventListener('hidden.bs.modal', function () {
      if (filaEditando) cargarDatosEnModal(filaEditando);
      filaEditando = null;
    });

    function actualizarFila(fila, datos) {
      const celdaUsuario = fila.querySelector('.celda-usuario');
      const avatar = document.createElement('span');
      avatar.className = 'avatar-usuario';
      avatar.textContent = iniciales(datos.nombre);
      celdaUsuario.replaceChildren(avatar, document.createTextNode(datos.nombre));

      const celdaEmail = fila.children[1];
      celdaEmail.textContent = truncarTexto(datos.email, 4);
      celdaEmail.title = datos.email;

      fila.dataset.rol = datos.roles.join(' ');
      fila.children[2].textContent = formatearRoles(datos.roles);

      const estado = fila.querySelector('td:nth-child(4) span');
      estado.className = datos.estado === 'activo' ? 'ingreso' : 'alerta';
      estado.textContent = datos.estado === 'activo' ? 'Activo' : 'Inactivo';
    }

    async function enviarEdicion(datos) {
      try {
        const respuesta = await fetch('/usuarios', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(datos)
        });

        if (!respuesta.ok) {
          throw new Error('El servidor respondió con estado ' + respuesta.status);
        }
      } catch (error) {
        console.error('No se pudo guardar la edición del usuario:', error);
      }
    }

    formEditarUsuario.addEventListener('submit', function (evento) {
      evento.preventDefault();
      limpiarErroresEditar();

      if (!filaEditando) return;

      const nombre = inputNombreEditar.value.trim();
      const email = inputEmailEditar.value.trim();
      const contrasena = inputContrasenaEditar.value;
      const confirmar = inputConfirmarEditar.value;
      const rolesSeleccionados = Array.from(
        listaRolesEditar.querySelectorAll('input[name="roles"]:checked')
      ).map(function (input) { return input.value; });

      let hayErrores = false;

      if (!nombre) {
        mostrarErrorCampo(inputNombreEditar.closest('.campo-formulario'), 'Ingresá el nombre completo.');
        hayErrores = true;
      }

      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
        mostrarErrorCampo(inputEmailEditar.closest('.campo-formulario'), 'Ingresá el email.');
        hayErrores = true;
      } else if (!regexEmail.test(email)) {
        mostrarErrorCampo(inputEmailEditar.closest('.campo-formulario'), 'Ingresá un email válido (ej: usuario@stockflow.com).');
        hayErrores = true;
      }

      if (contrasena) {
        if (!confirmar) {
          mostrarErrorCampo(inputConfirmarEditar.closest('.campo-formulario'), 'Confirmá la nueva contraseña.');
          hayErrores = true;
        } else if (contrasena !== confirmar) {
          mostrarErrorCampo(inputConfirmarEditar.closest('.campo-formulario'), 'Las contraseñas no coinciden.');
          hayErrores = true;
        }
      } else if (confirmar) {
        mostrarErrorCampo(inputContrasenaEditar.closest('.campo-formulario'), 'Ingresá la nueva contraseña o dejá ambos campos en blanco.');
        hayErrores = true;
      }

      if (rolesSeleccionados.length === 0) {
        mostrarErrorCampo(campoRolesEditar, 'Seleccioná al menos un rol para el usuario.');
        hayErrores = true;
      }

      if (hayErrores) return;

      const emailOriginal = leerDatosFila(filaEditando).email;
      const datos = {
        nombre: nombre,
        email: email,
        roles: rolesSeleccionados,
        estado: estadoEditarInput.value
      };

      actualizarFila(filaEditando, datos);
      bootstrap.Modal.getInstance(modalEditarUsuarioEl).hide();

      // La contraseña solo viaja si se quiso cambiar
      const datosBackend = Object.assign({ emailOriginal: emailOriginal }, datos);
      if (contrasena) datosBackend.contrasena = contrasena;
      enviarEdicion(datosBackend);
    });
  }

});