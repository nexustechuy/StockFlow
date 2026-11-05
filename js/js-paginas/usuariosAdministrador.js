// Lógica de la pantalla Usuarios (Administrador)
// Usa GET/POST /usuarios, PUT /usuarios/:id y PATCH /usuarios/:id/estado
// (el token lo agrega sesion.js al fetch).

document.addEventListener('DOMContentLoaded', function () {

  const cuerpoTabla = document.getElementById('cuerpoTablaUsuarios');
  const avisoUsuarios = document.getElementById('avisoUsuarios');
  const MAX_EMAIL_TABLA = 28; // el email completo queda en el title de la celda

  let usuarios = [];

  /* Utilidades */

  // Evita que un texto cargado por el usuario rompa el HTML
  function escaparHTML(texto) {
    return String(texto ?? '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function truncarTexto(texto, cantidad) {
    if (texto.length <= cantidad) return texto;
    return texto.slice(0, cantidad) + '...';
  }

  function iniciales(texto) {
    const letras = String(texto || '?')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(function (palabra) { return palabra[0].toUpperCase(); })
      .join('');
    return letras || '?';
  }

  function formatearRoles(roles) {
    return roles
      .map(function (r) { return r.charAt(0).toUpperCase() + r.slice(1); })
      .join(' / ');
  }

  function usuarioLogueado() {
    try {
      return JSON.parse(localStorage.getItem('sf_usuario')) || {};
    } catch (error) {
      return {};
    }
  }

  // Pide algo al servidor. Si falla, tira un Error con el mensaje que mandó el backend
  async function pedir(url, opciones) {
    const respuesta = await fetch(url, opciones);
    let datos = null;

    try {
      datos = await respuesta.json();
    } catch (error) {
      datos = null;
    }

    if (!respuesta.ok) {
      throw new Error((datos && datos.error) || 'Error del servidor (' + respuesta.status + ').');
    }

    return datos;
  }

  function enviarJSON(metodo, datos) {
    return {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    };
  }

  function mostrarAviso(mensaje) {
    avisoUsuarios.textContent = mensaje;
    avisoUsuarios.style.display = 'block';
  }

  function ocultarAviso() {
    avisoUsuarios.style.display = 'none';
  }

  // Los errores de contraseña son los mismos que valida el backend
  function errorDeContrasena(contrasena) {
    if (contrasena.length < 6 || contrasena.length > 16) {
      return 'La contraseña debe tener entre 6 y 16 caracteres.';
    }
    if (/[<>'"]/.test(contrasena)) {
      return 'La contraseña contiene caracteres no permitidos (< > \' ").';
    }
    return null;
  }

  /* Tabla */

  function renderizarFila(usuario) {
    const esUnoMismo = Number(usuario.id_usuario) === Number(usuarioLogueado().id_usuario);
    const nombre = usuario.nombre || usuario.mail;

    // El administrador no puede desactivarse a sí mismo
    const opcionEstado = esUnoMismo
      ? ''
      : '<li><a class="dropdown-item cambiar-estado" href="#"><i class="bi bi-arrow-repeat me-2"></i>' +
        (usuario.activo ? 'Desactivar' : 'Activar') + '</a></li>';

    return '<tr data-id="' + usuario.id_usuario + '" data-rol="' + escaparHTML(usuario.roles.join(' ')) + '">' +
      '<td><div class="celda-usuario"><span class="avatar-usuario">' + escaparHTML(iniciales(nombre)) + '</span>' +
      escaparHTML(nombre) + (esUnoMismo ? ' (vos)' : '') + '</div></td>' +
      '<td title="' + escaparHTML(usuario.mail) + '">' + escaparHTML(truncarTexto(usuario.mail, MAX_EMAIL_TABLA)) + '</td>' +
      '<td>' + escaparHTML(formatearRoles(usuario.roles)) + '</td>' +
      '<td><span class="' + (usuario.activo ? 'ingreso' : 'alerta') + '">' +
      (usuario.activo ? 'Activo' : 'Inactivo') + '</span></td>' +
      '<td>' +
      '<div class="dropdown">' +
      '<button class="btn-accion" data-bs-toggle="dropdown" data-bs-popper-config=\'{"strategy":"fixed"}\' aria-expanded="false">•••</button>' +
      '<ul class="dropdown-menu dropdown-menu-end">' +
      '<li><a class="dropdown-item editar-usuario" href="#" data-bs-toggle="modal" data-bs-target="#modalEditarUsuario"><i class="bi bi-pencil me-2"></i>Editar usuario</a></li>' +
      opcionEstado +
      '</ul>' +
      '</div>' +
      '</td>' +
      '</tr>';
  }

  function renderizarTabla() {
    const activos = usuarios.filter(function (u) { return u.activo; });
    const inactivos = usuarios.filter(function (u) { return !u.activo; });

    cuerpoTabla.innerHTML = usuarios.length
      ? activos.concat(inactivos).map(renderizarFila).join('')
      : '<tr><td colspan="5">Todavía no hay usuarios.</td></tr>';

    aplicarFiltros();
  }

  async function cargarUsuarios() {
    try {
      usuarios = await pedir('/usuarios');
      ocultarAviso();
      renderizarTabla();
    } catch (error) {
      console.error('Error al cargar los usuarios:', error);
      cuerpoTabla.innerHTML = '<tr><td colspan="5">No se pudieron cargar los usuarios.</td></tr>';
      mostrarAviso(error.message);
    }
  }

  // Reemplaza (o agrega) un usuario en la lista y vuelve a dibujar
  function guardarEnLista(usuario) {
    const posicion = usuarios.findIndex(function (u) {
      return Number(u.id_usuario) === Number(usuario.id_usuario);
    });

    if (posicion === -1) {
      usuarios.push(usuario);
    } else if (usuarios[posicion].activo !== usuario.activo) {
      usuarios.splice(posicion, 1);
      usuarios.push(usuario);
    } else {
      usuarios[posicion] = usuario;
    }

    renderizarTabla();
  }

  /* Resaltar el rol marcado*/
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
    const filas = document.querySelectorAll('#cuerpoTablaUsuarios tr[data-id]');

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

  /* Mostrar/ocultar contraseña */
  document.querySelectorAll('.mostrar-contrasena').forEach(function (botonMostrar) {
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

  function ocultarContrasenas(form) {
    form.querySelectorAll('.mostrar-contrasena').forEach(function (botonMostrar) {
      const contrasena = botonMostrar.closest('.contenedor-contrasena').querySelector('input');
      if (contrasena.type === 'text') botonMostrar.click();
    });
  }

  /* Alta de usuario */
  const formNuevoUsuario = document.getElementById('formNuevoUsuario');
  const errorDiv = document.getElementById('errorNuevoUsuario');
  const modalNuevoUsuarioEl = document.getElementById('modalNuevoUsuario');

  function mostrarError(mensaje) {
    errorDiv.textContent = mensaje;
    errorDiv.style.display = 'block';
  }

  function ocultarError() {
    errorDiv.style.display = 'none';
  }

  if (formNuevoUsuario) {
    const botonGuardarNuevo = formNuevoUsuario.querySelector('button[type="submit"]');

    formNuevoUsuario.addEventListener('submit', async function (evento) {
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
        mostrarError('Ingresá un email válido (ej: usuario@gmail.com).');
        return;
      }

      if (contrasena !== confirmar) {
        mostrarError('Las contraseñas no coinciden.');
        return;
      }

      const errorContrasena = errorDeContrasena(contrasena);
      if (errorContrasena) {
        mostrarError(errorContrasena);
        return;
      }

      if (rolesSeleccionados.length === 0) {
        mostrarError('Seleccioná al menos un rol para el usuario.');
        return;
      }

      botonGuardarNuevo.disabled = true;

      try {
        const usuarioCreado = await pedir('/usuarios', enviarJSON('POST', {
          nombre: nombre,
          mail: email,
          password: contrasena,
          roles: rolesSeleccionados,
          activo: estadoInicialInput.value === 'activo'
        }));

        guardarEnLista(usuarioCreado);
        bootstrap.Modal.getInstance(modalNuevoUsuarioEl).hide();

      } catch (error) {
        console.error('Error al crear el usuario:', error);
        mostrarError(error.message);

      } finally {
        botonGuardarNuevo.disabled = false;
      }
    });

    // Limpia el error al abrir el modal
    modalNuevoUsuarioEl.addEventListener('show.bs.modal', ocultarError);

    // Limpia el formulario al cerrar el modal
    modalNuevoUsuarioEl.addEventListener('hidden.bs.modal', function () {
      formNuevoUsuario.reset();
      ocultarContrasenas(formNuevoUsuario);
      document.querySelectorAll('#listaRoles .rol-item').forEach(function (item) {
        item.classList.remove('seleccionado');
      });
      estadoToggle.querySelectorAll('button').forEach(function (b) { b.classList.remove('seleccionado'); });
      estadoToggle.querySelector('[data-estado="activo"]').classList.add('seleccionado');
      estadoInicialInput.value = 'activo';
    });
  }

  /* Activar / desactivar */
  cuerpoTabla.addEventListener('click', async function (evento) {
    const opcion = evento.target.closest('.cambiar-estado');
    if (!opcion) return;
    evento.preventDefault();

    const id = opcion.closest('tr').dataset.id;
    const usuario = usuarios.find(function (u) { return String(u.id_usuario) === String(id); });
    if (!usuario) return;

    ocultarAviso();

    try {
      const actualizado = await pedir('/usuarios/' + id + '/estado',
        enviarJSON('PATCH', { activo: !usuario.activo }));

      guardarEnLista(actualizado);

    } catch (error) {
      console.error('Error al cambiar el estado:', error);
      mostrarAviso(error.message);
    }
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
    const botonGuardarEdicion = formEditarUsuario.querySelector('button[type="submit"]');
    let usuarioEditando = null;

    function mostrarErrorCampo(campo, mensaje) {
      campo.classList.add('campo-invalido');
      campo.querySelector('.error-campo').textContent = mensaje;
    }

    function mostrarErrorEditar(mensaje) {
      errorEditarDiv.textContent = mensaje;
      errorEditarDiv.style.display = 'block';
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

    function cargarDatosEnModal(usuario) {
      inputNombreEditar.value = usuario.nombre || '';
      inputEmailEditar.value = usuario.mail;
      inputContrasenaEditar.value = '';
      inputConfirmarEditar.value = '';

      listaRolesEditar.querySelectorAll('input[name="roles"]').forEach(function (checkbox) {
        checkbox.checked = usuario.roles.includes(checkbox.value);
        checkbox.closest('.rol-item').classList.toggle('seleccionado', checkbox.checked);
      });

      seleccionarEstadoEditar(usuario.activo ? 'activo' : 'inactivo');
      ocultarContrasenas(formEditarUsuario);
      limpiarErroresEditar();
    }

    modalEditarUsuarioEl.addEventListener('show.bs.modal', function (evento) {
      const disparador = evento.relatedTarget;
      const fila = disparador ? disparador.closest('tr') : null;

      usuarioEditando = fila
        ? usuarios.find(function (u) { return String(u.id_usuario) === String(fila.dataset.id); })
        : null;

      if (usuarioEditando) cargarDatosEnModal(usuarioEditando);
    });

    modalEditarUsuarioEl.addEventListener('hidden.bs.modal', function () {
      if (usuarioEditando) cargarDatosEnModal(usuarioEditando);
      usuarioEditando = null;
    });

    // Si el administrador se edita a sí mismo, se actualiza lo que muestra el menú
    function actualizarSesionLocal(usuario) {
      if (Number(usuario.id_usuario) !== Number(usuarioLogueado().id_usuario)) return;

      const sesion = usuarioLogueado();
      sesion.nombre = usuario.nombre;
      sesion.mail = usuario.mail;
      sesion.roles = usuario.roles;
      localStorage.setItem('sf_usuario', JSON.stringify(sesion));

      document.querySelectorAll('[data-nombre-usuario]').forEach(function (elemento) {
        elemento.textContent = usuario.nombre || usuario.mail;
      });
    }

    formEditarUsuario.addEventListener('submit', async function (evento) {
      evento.preventDefault();
      limpiarErroresEditar();

      if (!usuarioEditando) return;

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
        mostrarErrorCampo(inputEmailEditar.closest('.campo-formulario'), 'Ingresá un email válido (ej: usuario@gmail.com).');
        hayErrores = true;
      }

      if (contrasena) {
        const errorContrasena = errorDeContrasena(contrasena);

        if (errorContrasena) {
          mostrarErrorCampo(inputContrasenaEditar.closest('.campo-formulario'), errorContrasena);
          hayErrores = true;
        } else if (!confirmar) {
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

      const datos = {
        nombre: nombre,
        mail: email,
        roles: rolesSeleccionados,
        activo: estadoEditarInput.value === 'activo'
      };
      if (contrasena) datos.password = contrasena;

      botonGuardarEdicion.disabled = true;

      try {
        const usuarioEditado = await pedir('/usuarios/' + usuarioEditando.id_usuario, enviarJSON('PUT', datos));

        guardarEnLista(usuarioEditado);
        actualizarSesionLocal(usuarioEditado);

        // Se cierra sin volver a cargar los datos viejos en el formulario
        usuarioEditando = null;
        bootstrap.Modal.getInstance(modalEditarUsuarioEl).hide();

      } catch (error) {
        console.error('No se pudo guardar la edición del usuario:', error);
        mostrarErrorEditar(error.message);

      } finally {
        botonGuardarEdicion.disabled = false;
      }
    });
  }

  cargarUsuarios();

});
