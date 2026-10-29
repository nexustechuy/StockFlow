const traducciones = {
    "Ajustes": "Settings",
    "Personalizá tu cuenta y preferencias": "Customize your account and preferences",
    "Tema": "Theme",
    "Modo claro": "Light mode",
    "Modo oscuro": "Dark mode",
    "Idioma": "Language",
    "Administrador": "Administrator",
    "Repositor": "Stock Clerk",
    "Vendedor": "Salesperson",
    "Ventas": "Sales",
    "Inventario": "Inventory",
    "Ganancias": "Earnings",
    "Usuarios": "Users",
    "Productos": "Products",
    "Reposiciones": "Restocking",
    "Alertas de Stock": "Stock Alerts",
    "Registrar venta": "Register Sale",
    "Historial": "History",
    "Cerrar sesión": "Log out",
    "Iniciar sesión": "Log in",
    "Correo electrónico": "Email address",
    "Contraseña": "Password",
    "Ingresar": "Sign in",
    "Bienvenido a StockFlow": "Welcome to StockFlow",
    "Dashboard": "Dashboard"
};

function aplicarIdioma(idioma) {
    const idiomaActual = idioma === "en" ? "en" : "es";

    document.documentElement.lang = idiomaActual;

    document.querySelectorAll("[data-i18n]").forEach(function (elemento) {
        const clave = elemento.getAttribute("data-i18n");

        elemento.textContent =
            idiomaActual === "en"
                ? (traducciones[clave] || clave)
                : clave;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (elemento) {
        const clave = elemento.getAttribute("data-i18n-placeholder");

        elemento.placeholder =
            idiomaActual === "en"
                ? (traducciones[clave] || clave)
                : clave;
    });

    document.querySelectorAll("[data-idioma]").forEach(function (boton) {
        boton.classList.toggle(
            "activo",
            boton.getAttribute("data-idioma") === idiomaActual
        );
    });
}

// Aplicar idioma guardado cuando carga la página
document.addEventListener("DOMContentLoaded", function () {
    aplicarIdioma(localStorage.getItem("idioma") || "es");
});

// Detectar el clic desde el documento
document.addEventListener("click", function (evento) {
    const boton = evento.target.closest("[data-idioma]");

    if (!boton) {
        return;
    }

    const idioma = boton.getAttribute("data-idioma");

    console.log("Idioma seleccionado:", idioma);

    localStorage.setItem("idioma", idioma);
    aplicarIdioma(idioma);
});
