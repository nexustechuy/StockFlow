
const traducciones = {
    "Ajustes": "Settings",
    "Personalizá tu cuenta y preferencias": "Customize your account and preferences",
    "Tema": "Theme",
    "Modo claro": "Light mode",
    "Modo oscuro": "Dark mode",
    "Idioma": "Language",
    "Español": "Spanish",
    "Inglés": "English",
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
    "Vista general del negocio": "Business overview",
    "Ventas del Día": "Today's Sales",
    "Registradas automáticamente": "Automatically registered",
    "Ver detalle": "View details",
    "Vendedores y repositores": "Salespeople and stock clerks",
    "En 6 categorías distintas": "Across 6 different categories",
    "Sin Stock": "Out of Stock",
    "productos": "products",
    "Historial de ventas": "Sales History",
    "Hora": "Time",
    "Cliente": "Customer",
    "Total": "Total",
    "Ver todo": "View all",
    "¡Hola!": "Hello!",
    "Cerrar sesión": "Log out",
    "Dashboard": "Dashboard",
    "Buscar": "Search",
    "Guardar": "Save",
    "Cancelar": "Cancel",
    "Editar": "Edit",
    "Eliminar": "Delete",
    "Agregar": "Add",
    "Nombre": "Name",
    "Correo electrónico": "Email address",
    "Contraseña": "Password",
    "Iniciar sesión": "Log in",
    "Ingresar": "Sign in",
    "Ventas de hoy": "Today's sales",
    "Ingresos de hoy": "Today's revenue",
    "Órdenes de hoy": "Today's orders",
    "ventas": "sales",
    "pesos": "pesos",
    "órdenes": "orders",
    "Productos más vendidos": "Best-selling products",
    "Fecha": "Date",
    "Producto": "Product",
    "Cantidad": "Quantity",
    "Cargando...": "Loading...",
    "No hay ventas registradas": "No sales recorded yet",
    "No hay productos vendidos": "No products sold yet",
    "No se pudieron cargar los datos": "Could not load data"
};

// Aplica las traducciones según el idioma seleccionado
function aplicarIdioma(idioma) {
    const idiomaActual = idioma === "en" ? "en" : "es";

    document.documentElement.lang = idiomaActual;

    document.querySelectorAll("[data-i18n]").forEach(elemento => {
        const clave = elemento.dataset.i18n;

        elemento.textContent = idiomaActual === "en"
            ? (traducciones[clave] || clave)
            : clave;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(elemento => {
        const clave = elemento.dataset.i18nPlaceholder;

        elemento.placeholder = idiomaActual === "en"
            ? (traducciones[clave] || clave)
            : clave;
    });

    // Marcar el idioma seleccionado en Ajustes
    document.querySelectorAll("[data-idioma]").forEach(boton => {
        boton.classList.toggle(
            "activo",
            boton.dataset.idioma === idiomaActual
        );
    });

    // Actualizar el saludo del Dashboard
    if (typeof actualizarSaludo === "function") {
        actualizarSaludo();
    }
}

// Recuperar el idioma guardado y permitir cambiarlo
document.addEventListener("DOMContentLoaded", () => {
    const idiomaGuardado = localStorage.getItem("idioma") || "es";

    aplicarIdioma(idiomaGuardado);

    document.querySelectorAll("[data-idioma]").forEach(boton => {
        boton.addEventListener("click", () => {
            const idioma = boton.dataset.idioma;

            localStorage.setItem("idioma", idioma);
            aplicarIdioma(idioma);
        });
    });
});
