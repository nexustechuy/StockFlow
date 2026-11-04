// SESIÓN EN EL FRONT (JWT)
// Se incluye en todas las páginas menos login.html
(function () {
    const CLAVE_TOKEN = "sf_token";
    const CLAVE_USUARIO = "sf_usuario";
    const PAGINA_LOGIN = "/login.html";

    const DASHBOARD_POR_ROL = {
        administrador: "/dashboardAdministrador.html",
        vendedor: "/dashboardVendedor.html",
        repositor: "/dashboardRepositor.html"
    };

    function obtenerToken() {
        return localStorage.getItem(CLAVE_TOKEN);
    }

    function obtenerUsuario() {
        try {
            return JSON.parse(localStorage.getItem(CLAVE_USUARIO));
        } catch (error) {
            return null;
        }
    }

    function cerrarSesion() {
        localStorage.removeItem(CLAVE_TOKEN);
        localStorage.removeItem(CLAVE_USUARIO);
    }

    function irAlLogin() {
        cerrarSesion();
        window.location.replace(PAGINA_LOGIN);
    }

    function tokenVencido(token) {
        try {
            const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
            return payload.exp * 1000 < Date.now();
        } catch (error) {
            return true;
        }
    }

    window.cerrarSesion = cerrarSesion;

    // Al retroceder se recarga la página para que se vuelva a validad la sesión
    window.addEventListener("pageshow", function (evento) {
        if (evento.persisted) {
            window.location.reload();
        }
    });

    // Tiene que haber sesión válida
    const token = obtenerToken();
    const usuario = obtenerUsuario();

    if (!token || !usuario || tokenVencido(token)) {
        irAlLogin();
        return;
    }

    const pagina = window.location.pathname.split("/").pop();
    let rolDePagina = null;

    if (pagina.endsWith("Administrador.html")) rolDePagina = "administrador";
    else if (pagina.endsWith("Vendedor.html")) rolDePagina = "vendedor";
    else if (pagina.endsWith("Repositor.html")) rolDePagina = "repositor";

    const roles = (usuario.roles || [usuario.rol]).map(r => String(r).toLowerCase());
    const rolActivo = String(usuario.rol).toLowerCase();

    // Solo se entra a las páginas del rol con el que se ingresó
    if (rolDePagina && rolDePagina !== rolActivo) {
        const destino = DASHBOARD_POR_ROL[rolActivo] || PAGINA_LOGIN;
        window.location.replace(destino);
        return;
    }

    const fetchOriginal = window.fetch.bind(window);

    window.fetch = async function (url, opciones = {}) {
        const direccion = typeof url === "string" ? url : url.url;
        const esDelServidor = direccion.startsWith("/") || direccion.startsWith(window.location.origin);

        if (!esDelServidor) {
            return fetchOriginal(url, opciones);
        }

        const headers = new Headers(opciones.headers || {});
        headers.set("Authorization", "Bearer " + obtenerToken());

        const respuesta = await fetchOriginal(url, { ...opciones, headers });

        // Token vencido o inválido: volver al login
        if (respuesta.status === 401) {
            irAlLogin();
        }

        return respuesta;
    };

    // Cualquier link que lleve a login.html (sidebar y menú móvil) borra la sesión y va al login con replace
    document.addEventListener("click", function (evento) {
        const link = evento.target.closest("a");
        const destino = link ? link.getAttribute("href") : null;

        if (destino && destino.endsWith("login.html")) {
            evento.preventDefault();
            irAlLogin();
        }
    }, true);

    // CAMBIAR DE ROL (solo para usuarios con más de un rol)
    const NOMBRE_ROL = {
        administrador: "Administrador",
        vendedor: "Vendedor",
        repositor: "Repositor"
    };

    function crearModalCambiarRol() {
        const modal = document.createElement("div");
        modal.className = "modal fade modal-stockflow";
        modal.id = "modalCambiarRol";
        modal.tabIndex = -1;
        modal.setAttribute("aria-labelledby", "modalCambiarRolLabel");
        modal.setAttribute("aria-hidden", "true");
        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title" id="modalCambiarRolLabel">Cambiar de rol</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <div class="modal-body">
                        <div class="lista-roles" id="listaCambiarRol"></div>
                        <div id="errorCambiarRol" class="mensaje-error" style="display: none;"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn-primario" id="btnCambiarRol">Cambiar</button>
                    </div>
                </div>
            </div>`;

        const lista = modal.querySelector("#listaCambiarRol");
        const errorRol = modal.querySelector("#errorCambiarRol");

        roles.forEach(function (rol) {
            if (!NOMBRE_ROL[rol]) return;

            const item = document.createElement("label");
            item.className = "rol-item";

            const opcion = document.createElement("input");
            opcion.type = "radio";
            opcion.name = "rolNuevo";
            opcion.value = rol;

            const texto = document.createElement("span");
            texto.textContent = NOMBRE_ROL[rol];

            // El rol con el que está ahora aparece marcado
            if (rol === rolActivo) {
                opcion.checked = true;
                item.classList.add("seleccionado");
            }

            opcion.addEventListener("change", function () {
                lista.querySelectorAll(".rol-item").forEach(function (otro) {
                    otro.classList.remove("seleccionado");
                });
                item.classList.add("seleccionado");
                errorRol.style.display = "none";
            });

            item.appendChild(opcion);
            item.appendChild(texto);
            lista.appendChild(item);
        });

        modal.querySelector("#btnCambiarRol").addEventListener("click", function () {
            const elegido = lista.querySelector("input:checked");

            if (!elegido) {
                errorRol.textContent = "Elegí un rol para continuar.";
                errorRol.style.display = "block";
                return;
            }

            if (elegido.value === rolActivo) {
                bootstrap.Modal.getOrCreateInstance(modal).hide();
                return;
            }

            // El backend revisa que el rol sea del usuario y devuelve un token nuevo
            fetch("/cambiar-rol", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rol: elegido.value })
            })
                .then(function (respuesta) {
                    return respuesta.json().then(function (datos) {
                        if (!respuesta.ok) {
                            throw new Error(datos.error);
                        }

                        usuario.rol = datos.rol;
                        localStorage.setItem(CLAVE_TOKEN, datos.token);
                        localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
                        window.location.href = DASHBOARD_POR_ROL[datos.rol];
                    });
                })
                .catch(function (error) {
                    errorRol.textContent = error.message;
                    errorRol.style.display = "block";
                });
        });

        document.body.appendChild(modal);
        return modal;
    }

    let modalCambiarRol = null;

    function abrirCambiarRol() {
        if (!modalCambiarRol) {
            modalCambiarRol = crearModalCambiarRol();
        }
        bootstrap.Modal.getOrCreateInstance(modalCambiarRol).show();
    }

    // menu-responsive.js usa esto para saber si tiene que mostrar "Cambiar de rol"
    if (roles.length > 1) {
        window.abrirCambiarRol = abrirCambiarRol;
    }

    // Nombre del usuario en la página
    function saludoSegunHora() {
        const hora = new Date().getHours();
        if (hora >= 6 && hora < 13) return "¡Buenos días";
        if (hora >= 13 && hora < 20) return "¡Buenas tardes";
        return "¡Buenas noches";
    }

    document.addEventListener("DOMContentLoaded", function () {
        const nombreCompleto = usuario.nombre || usuario.mail;
        const primerNombre = usuario.nombre ? usuario.nombre.split(" ")[0] : null;

        document.querySelectorAll("[data-nombre-usuario]").forEach(function (elemento) {
            elemento.textContent = nombreCompleto;
        });

        document.querySelectorAll("[data-saludo]").forEach(function (elemento) {
            elemento.textContent = primerNombre
                ? saludoSegunHora() + ", " + primerNombre + "!"
                : saludoSegunHora() + "!";
        });

        // "Cambiar de rol" en la sidebar, arriba de "Cerrar sesión"
        const pieSidebar = document.querySelector(".sidebar-footer");

        if (roles.length > 1 && pieSidebar) {
            const link = document.createElement("a");
            link.href = "#";
            link.innerHTML = '<i class="bi bi-arrow-left-right me-2"></i><span data-i18n="Cambiar de rol">Cambiar de rol</span>';
            link.addEventListener("click", function (evento) {
                evento.preventDefault();
                abrirCambiarRol();
            });
            pieSidebar.prepend(link);
        }
    });
})();
