// SESIÓN EN EL FRONT (JWT)
// Se incluye en todas las páginas menos login.html. Hace 4 cosas:
//  1. Si no hay token (o venció), manda al login.
//  2. Si la página es de otro rol, manda al dashboard del rol del usuario.
//  3. Agrega el token a todos los fetch (Authorization: Bearer ...).
//  4. Cierra sesión (borra el token) al tocar cualquier link a login.html.
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

    // Para usar desde un botón propio: window.cerrarSesion(); window.location.href = "login.html";
    window.cerrarSesion = cerrarSesion;

    // 1. Tiene que haber sesión válida
    const token = obtenerToken();
    const usuario = obtenerUsuario();

    if (!token || !usuario || tokenVencido(token)) {
        irAlLogin();
        return;
    }

    // 2. Cada página es de un rol (se deduce del nombre del archivo)
    const pagina = window.location.pathname.split("/").pop();
    let rolDePagina = null;

    if (pagina.endsWith("Administrador.html")) rolDePagina = "administrador";
    else if (pagina.endsWith("Vendedor.html")) rolDePagina = "vendedor";
    else if (pagina.endsWith("Repositor.html")) rolDePagina = "repositor";

    const roles = (usuario.roles || [usuario.rol]).map(r => String(r).toLowerCase());

    if (rolDePagina && !roles.includes(rolDePagina)) {
        const destino = DASHBOARD_POR_ROL[roles[0]] || PAGINA_LOGIN;
        window.location.replace(destino);
        return;
    }

    // 3. Todos los fetch al servidor llevan el token
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

    // 4. Cerrar sesión: cualquier link que lleve a login.html borra el token
    document.addEventListener("click", function (evento) {
        const link = evento.target.closest("a");
        const destino = link ? link.getAttribute("href") : null;

        if (destino && destino.endsWith("login.html")) {
            cerrarSesion();
        }
    }, true);
})();
