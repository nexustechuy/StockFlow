(function () {
    'use strict';

    const traducciones = {
        // Navegación / general
        "Dashboard": "Dashboard",
        "Ajustes": "Settings",
        "Ventas": "Sales",
        "Inventario": "Inventory",
        "Ganancias": "Earnings",
        "Usuarios": "Users",
        "Productos": "Products",
        "Reposiciones": "Restocking",
        "Alertas de Stock": "Stock Alerts",
        "Registrar venta": "Register Sale",
        "Historial": "History",
        "Clientes": "Customers",
        "Cerrar sesión": "Log out",

        // Ajustes
        "Personalizá tu cuenta y preferencias": "Customize your account and preferences",
        "Tema": "Theme",
        "Modo claro": "Light mode",
        "Modo oscuro": "Dark mode",
        "Idioma": "Language",

        // Roles
        "Administrador": "Administrator",
        "Repositor": "Stock Clerk",
        "Vendedor": "Salesperson",

        // Dashboard
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
        "¡Buenos días!": "Good morning!",
        "¡Buenas tardes!": "Good afternoon!",
        "¡Buenas noches!": "Good evening!",
        "Sin cliente": "No customer",
        "Todavía no hay ventas registradas.": "No sales have been registered yet.",
        "Error al cargar las ventas.": "Error loading sales.",

        // Login
        // Ganancias
        "Resumen financiero del negocio": "Financial summary of the business",
        "Hoy": "Today",
        "Esta semana": "This week",
        "Este mes": "This month",
        "Este año": "This year",
        "Todo": "All time",
        "Total vendido": "Total sold",
        "Costo total": "Total cost",
        "Rentabilidad": "Profitability",
        "Ventas realizadas": "Completed sales",
        "Gastos totales": "Total expenses",
        "Ganancia neta": "Net profit",
        "pesos": "pesos",
        "ventas": "sales",
        "vendedores": "salespeople",

        "Ganancia por categoría": "Profit by category",
        "Vendidos": "Sold",
        "$ Compra": "$ Purchase",
        "Ganancia": "Profit",
        "Gastos": "Expenses",
        "Monto": "Amount",
        "Compra asociada": "Linked purchase",
        "No hay gastos registrados en este período.": "No expenses recorded in this period.",

        // Usuarios
        "Gestioná los usuarios y sus roles en el sistema": "Manage users and their roles in the system",
        "Buscá un usuario...": "Search for a user...",
        "Vendedores": "Salespeople",
        "Repositores": "Stock clerks",
        "Administradores": "Administrators",

        // Inventario
        "Gestioná los productos, categorías y alertas de stock": "Manage products, categories and stock alerts",
        "Categorías": "Categories",
        "Alertas de stock": "Stock alerts",
        "Buscá un producto...": "Search for a product...",
        "Activos": "Active",
        "Sin stock": "Out of stock",
        "Stock crítico": "Critical stock",
        "Producto": "Product",
        "Código": "Code",
        "Sin código": "No code",
        "Stock actual": "Current stock",
        "Stock mínimo": "Minimum stock",
        "Buscá una categoría...": "Search for a category...",
        "Nueva categoría": "New category",
        "Atención requerida": "Attention required",
        "Ver en inventario": "View in inventory",
        "Ver en inventario →": "View in inventory →",
        "A reponer": "To restock",

        // Ventas
        "Todas las ventas registradas en el sistema": "All sales registered in the system",
        "Ingresos": "Revenue",
        "Ganancia bruta": "Gross profit",
        "Vendedores activos": "Active salespeople",
        "Buscá por cliente o vendedor...": "Search by customer or salesperson...",
        "Número de venta": "Sale number",
        "Acción": "Action",
        "Sin asignar": "Unassigned",

        // Vendedor: dashboard
        "Ventas de hoy": "Today's sales",
        "Ingresos de hoy": "Today's revenue",
        "Órdenes de hoy": "Today's orders",
        "órdenes": "orders",
        "Productos más vendidos": "Best-selling products",

        // Vendedor: registrar venta
        "Registrá ventas de forma sencilla": "Register sales easily",
        "Datos del cliente": "Customer details",
        "Nombre del cliente": "Customer name",
        "Ingresá el nombre del cliente": "Enter the customer name",
        "Buscá productos...": "Search products...",
        "Productos en Venta": "Products in Sale",
        "Resumen de venta": "Sale summary",
        "Subtotal": "Subtotal",
        "Confirmar Venta": "Confirm Sale",
        "Todavía no agregaste productos. Usá el + del catálogo para sumarlos acá.":
            "You haven't added any products yet. Use the + in the catalog to add them here.",

        // Por si el "+" está en un elemento aparte y el mensaje queda partido en 2 textos
        "Todavía no agregaste productos. Usá el": "You haven't added any products yet. Use the",
        "del catálogo para sumarlos acá.": "in the catalog to add them here.",
        "Todavía no agregaste productos.": "You haven't added any products yet.",

        // Vendedor: inventario e historial
        "Consultá la disponibilidad y el stock de los productos": "Check product availability and stock",
        "Disponibles": "Available",
        "Disponibilidad": "Availability",
        "Todas tus ventas hasta el momento": "All your sales so far",
        "Total vendido hoy": "Total sold today",
        "Total este mes": "Total this month",
        "Buscá por cliente o producto...": "Search by customer or product...",
        "No se encontraron ventas.": "No sales found.",

        // Repositor: dashboard y alertas
        "Aquí tienes un resumen de lo que requiere de tu atención": "Here is a summary of what needs your attention",
        "Productos sin stock": "Out-of-stock products",
        "Productos con stock crítico": "Products with critical stock",
        "Productos a reponer": "Products to restock",
        "Productos con bajo stock": "Low-stock products",
        "Listado completo de productos con bajo stock": "Full list of low-stock products",
        "Mínimo": "Minimum",
        "Reponer": "Restock",

        // Repositor: reposiciones
        "Registrá reposiciones de stock y consultá el historial": "Record stock restocks and check the history",
        "Nueva reposición": "New restock",
        "Registrar reposición": "Register restock",
        "Historial de reposiciones": "Restocking history",
        "Comentario": "Comment",
        "Opcional": "Optional",
        "Ej: 10": "E.g.: 10",

        // Categorías de productos
        "Almacenamiento": "Storage",
        "Conectores": "Connectors",
        "Fuentes": "Power supplies",
        "Gabinetes": "Cases",
        "Memoria RAM": "RAM",
        "Monitores": "Monitors",
        "Motherboard": "Motherboards",
        "Periféricos": "Peripherals",
        "Procesadores": "Processors",
        "Tarjetas de video": "Graphics cards",
        "Sin categoría": "Uncategorized",

        // Productos con nombre en español
        // (los que ya están en inglés o son marcas/modelos no hace falta agregarlos)
        "Disco Solido Ssd M2 Kingston": "Kingston M2 SSD Solid State Drive",
        "Adaptador USB-C a HDMI": "USB-C to HDMI Adapter",
        "Cable USB-C a USB-C": "USB-C to USB-C Cable",
        "Monitor Gamer MSI 24\"": "MSI 24\" Gaming Monitor",
        "Monitor Curvo ViewSonic 27\"": "ViewSonic 27\" Curved Monitor",
        "Monitor Gamer Teros 21.5''": "Teros 21.5'' Gaming Monitor",
        "Teclado USB": "USB Keyboard",
        "Auriculares Bluetooth": "Bluetooth Headphones",
        "Teclado VSG Mintaka Mecánico": "VSG Mintaka Mechanical Keyboard",
        "Auriculares VSG Shake": "VSG Shake Headphones",
        "Procesador gamer AMD Ryzen 3 3200G": "AMD Ryzen 3 3200G Gaming Processor",
        "nuevo producto": "new product",
        "teclado": "keyboard",

        "Inicio de sesión": "Login",
        "StockFlow - Ajustes": "StockFlow - Settings",
        "Correo": "Email",
        "Mostrar contraseña": "Show password",
        "Ocultar contraseña": "Hide password",
        "Recuperar contraseña": "Recover password",
        "Comunicate con el administrador del sistema. Él te va a asignar una nueva contraseña para que puedas volver a ingresar.":
            "Contact the system administrator. They will assign you a new password so you can log in again.",
        "Entendido": "Got it",
        "Bienvenido": "Welcome",
        "Iniciar sesión": "Log in",
        "Ingresar": "Sign in",
        "Usuario": "Username",
        "Correo electrónico": "Email address",
        "Contraseña": "Password",
        "¿Olvidaste tu contraseña?": "Forgot your password?",
        "Recordarme": "Remember me",

        // Acciones comunes
        "Buscar": "Search",
        "Guardar": "Save",
        "Cancelar": "Cancel",
        "Editar": "Edit",
        "Eliminar": "Delete",
        "Agregar": "Add",
        "Confirmar": "Confirm",
        "Cerrar": "Close",
        "Filtrar": "Filter",
        "Exportar": "Export",
        "Acciones": "Actions",
        "Todos": "All",

        // Tablas / formularios frecuentes
        "Nombre": "Name",
        "Apellido": "Last name",
        "Teléfono": "Phone",
        "Rol": "Role",
        "Estado": "Status",
        "Activo": "Active",
        "Inactivo": "Inactive",
        "Fecha": "Date",
        "Precio": "Price",
        "Stock": "Stock",
        "Cantidad": "Quantity",
        "Categoría": "Category",
        "Descripción": "Description",
        "Proveedor": "Supplier",
        "Detalle": "Details",
        "Método de pago": "Payment method",
        "Efectivo": "Cash",
        "Tarjeta": "Card",
        "Transferencia": "Bank transfer",
        "Disponible": "Available",
        "Stock bajo": "Low stock",
        "Nuevo producto": "New product",
        "Nuevo usuario": "New user",
        "Nueva venta": "New sale"
    };

    // ---------- PATRONES (frases con números o datos variables) ----------
    // [expresión regular, reemplazo]. El reemplazo puede ser texto ($1, $2) o función.
    function plural(n, singular, pluralTxt) {
        return Number(n) === 1 ? singular : pluralTxt;
    }
    const patrones = [
        // "Juan Perez (vos)" -> "Juan Perez (you)"
        [/^(.+) \(vos\)$/, '$1 (you)'],
        // "En 10 categorías distintas" -> "Across 10 different categories"
        [/^En (\d+) categorías? distintas?$/, function (m, n) {
            return 'Across ' + n + plural(n, ' different category', ' different categories');
        }],
        // "1 producto" / "4 productos"
        [/^(\d+) productos?$/, function (m, n) { return n + plural(n, ' product', ' products'); }],
        // "5 ventas"
        [/^(\d+) ventas?$/, function (m, n) { return n + plural(n, ' sale', ' sales'); }],
        // Horas: "04:45 p. m." -> "04:45 PM"
        [/^(\d{1,2}:\d{2}) a\. ?m\.$/i, '$1 AM'],
        [/^(\d{1,2}:\d{2}) p\. ?m\.$/i, '$1 PM'],
        // Alertas de stock
        [/^Tenés (\d+) productos? sin stock y (\d+) con stock crítico$/, function (m, a, b) {
            return 'You have ' + a + plural(a, ' product', ' products') + ' out of stock and ' + b + ' with critical stock';
        }],
        [/^Tenés (\d+) productos? sin stock$/, function (m, a) {
            return 'You have ' + a + plural(a, ' product', ' products') + ' out of stock';
        }],
        [/^Tenés (\d+) productos? con stock crítico$/, function (m, a) {
            return 'You have ' + a + plural(a, ' product', ' products') + ' with critical stock';
        }],
        // Alertas del repositor ("Tienes 1 producto con bajo stock y 4 sin stock")
        [/^Tienes (\d+) productos? con bajo stock y (\d+) sin stock$/, function (m, a, b) {
            return 'You have ' + a + plural(a, ' product', ' products') + ' with low stock and ' + b + ' out of stock';
        }],
        [/^Tienes (\d+) productos? con bajo stock$/, function (m, a) {
            return 'You have ' + a + plural(a, ' product', ' products') + ' with low stock';
        }],
        [/^Tienes (\d+) productos? sin stock$/, function (m, a) {
            return 'You have ' + a + plural(a, ' product', ' products') + ' out of stock';
        }]
    ];

    // ---------- ESTADO ----------
    const CLAVE = 'idioma';
    let idioma = 'es';
    const memoriaTexto = new WeakMap();   // nodo de texto -> {original, traducido}
    const memoriaAttr = new WeakMap();    // elemento -> { atributo: {original, traducido} }
    const faltantes = new Set();          // textos sin traducción (para depurar)
    const ATRIBUTOS = ['placeholder', 'title', 'aria-label'];
    let tituloReg = null;

    // ---------- UTILIDADES ----------
    function traducir(texto) {
        const inicio = texto.match(/^\s*/)[0];
        const fin = texto.match(/\s*$/)[0];
        const nucleo = texto.trim().replace(/\s+/g, ' ').normalize('NFC');
        if (!nucleo) return texto;
        if (Object.prototype.hasOwnProperty.call(traducciones, nucleo)) {
            return inicio + traducciones[nucleo] + fin;
        }
        for (let i = 0; i < patrones.length; i++) {
            if (patrones[i][0].test(nucleo)) {
                return inicio + nucleo.replace(patrones[i][0], patrones[i][1]) + fin;
            }
        }
        // Listas de productos con cantidad: "Cable USB-C a USB-C x2, Teclado USB x1"
        if (/ x\d+/.test(nucleo)) {
            let cambio = false;
            const partes = nucleo.split(', ').map(function (p) {
                const m = p.match(/^(.*?)( x\d+)$/);
                const nombre = m ? m[1] : p;
                const cantidad = m ? m[2] : '';
                if (Object.prototype.hasOwnProperty.call(traducciones, nombre)) {
                    cambio = true;
                    return traducciones[nombre] + cantidad;
                }
                return p;
            });
            if (cambio) return inicio + partes.join(', ') + fin;
        }
        if (/[A-Za-zÁÉÍÓÚáéíóúñÑ]/.test(nucleo)) faltantes.add(nucleo);
        return texto;
    }

    // Decide el "original" (en español) y calcula el resultado según el idioma.
    // Así podemos volver a español sin perder el texto original.
    function resolver(actual, reg) {
        let original = actual;
        if (reg && (actual === reg.traducido || actual === reg.original)) {
            original = reg.original;
        }
        const traducido = idioma === 'en' ? traducir(original) : original;
        return { original: original, traducido: traducido };
    }

    function debeIgnorar(el) {
        return !el || (el.closest && el.closest('script, style, textarea, code, pre, [data-no-traducir]'));
    }

    // ---------- TRADUCCIÓN DE NODOS ----------
    function traducirTexto(nodo) {
        if (!nodo.nodeValue || !nodo.nodeValue.trim()) return;
        if (debeIgnorar(nodo.parentElement)) return;
        const r = resolver(nodo.nodeValue, memoriaTexto.get(nodo));
        if (r.traducido !== nodo.nodeValue) nodo.nodeValue = r.traducido;
        memoriaTexto.set(nodo, r);
    }

    function traducirAtributos(el) {
        let regs = memoriaAttr.get(el);
        ATRIBUTOS.forEach(function (attr) {
            if (!el.hasAttribute(attr)) return;
            const actual = el.getAttribute(attr);
            if (!actual || !actual.trim()) return;
            if (!regs) { regs = {}; memoriaAttr.set(el, regs); }
            const r = resolver(actual, regs[attr]);
            if (r.traducido !== actual) el.setAttribute(attr, r.traducido);
            regs[attr] = r;
        });
    }

    function recorrer(raiz) {
        if (!raiz) return;
        if (raiz.nodeType === 3) { traducirTexto(raiz); return; }
        if (raiz.nodeType !== 1 || debeIgnorar(raiz)) return;

        traducirAtributos(raiz);
        const walker = document.createTreeWalker(
            raiz,
            NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
            {
                acceptNode: function (n) {
                    if (n.nodeType === 1 && debeIgnorar(n)) return NodeFilter.FILTER_REJECT;
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );
        let n;
        while ((n = walker.nextNode())) {
            if (n.nodeType === 3) traducirTexto(n);
            else traducirAtributos(n);
        }
    }

    function traducirTitulo() {
        const r = resolver(document.title, tituloReg);
        if (r.traducido !== document.title) document.title = r.traducido;
        tituloReg = r;
    }

    // ---------- OBSERVADOR (contenido que agrega JavaScript) ----------
    const observador = new MutationObserver(function (registros) {
        observador.disconnect(); // evita bucles al cambiar el texto nosotros
        registros.forEach(function (r) {
            if (r.type === 'childList') r.addedNodes.forEach(recorrer);
            else if (r.type === 'characterData') recorrer(r.target);
            else if (r.type === 'attributes') traducirAtributos(r.target);
        });
        observar();
    });

    function observar() {
        if (!document.body) return;
        observador.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true,
            attributeFilter: ['placeholder', 'title']
        });
    }

    // ---------- API PRINCIPAL ----------
    function aplicarIdioma(nuevo) {
        idioma = nuevo === 'en' ? 'en' : 'es';
        document.documentElement.lang = idioma;

        observador.disconnect();
        traducirTitulo();
        recorrer(document.body);
        document.querySelectorAll('[data-idioma]').forEach(function (b) {
            b.classList.toggle('activo', b.dataset.idioma === idioma);
        });
        document.querySelectorAll('select[data-idioma-select]').forEach(function (s) {
            s.value = idioma;
        });
        observar();

        // Compatibilidad con scripts de página (por ejemplo el saludo)
        if (typeof window.actualizarSaludo === 'function') window.actualizarSaludo();
        document.dispatchEvent(new CustomEvent('idiomaCambiado', { detail: { idioma: idioma } }));
    }

    function cambiarIdioma(nuevo) {
        const valor = nuevo === 'en' ? 'en' : 'es';
        try { localStorage.setItem(CLAVE, valor); } catch (e) { /* sin storage */ }
        aplicarIdioma(valor);
    }

    // Botones: <button data-idioma="en"> / <button data-idioma="es">
    // o un solo botón que alterna: <button data-idioma-alternar>
    document.addEventListener('click', function (e) {
        const boton = e.target.closest('[data-idioma], [data-idioma-alternar]');
        if (!boton) return;
        if (boton.hasAttribute('data-idioma-alternar')) {
            cambiarIdioma(idioma === 'en' ? 'es' : 'en');
        } else {
            cambiarIdioma(boton.dataset.idioma);
        }
    });

    // Selector desplegable: <select data-idioma-select> con options es / en
    document.addEventListener('change', function (e) {
        const select = e.target.closest && e.target.closest('select[data-idioma-select]');
        if (select) cambiarIdioma(select.value);
    });

    // Si cambiás el idioma en otra pestaña, esta se actualiza sola
    window.addEventListener('storage', function (e) {
        if (e.key === CLAVE) aplicarIdioma(e.newValue);
    });

    function iniciar() {
        let guardado = 'es';
        try { guardado = localStorage.getItem(CLAVE) || 'es'; } catch (e) { /* sin storage */ }
        aplicarIdioma(guardado);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciar);
    } else {
        iniciar();
    }

    // ---------- HERRAMIENTAS PARA VOS ----------
    window.aplicarIdioma = aplicarIdioma;
    window.cambiarIdioma = cambiarIdioma;
    window.idiomaActual = function () { return idioma; };
    // En la consola del navegador (F12) escribí: idiomaFaltantes()
    // y te lista los textos de la página que todavía no tienen traducción.
    window.idiomaFaltantes = function () { return Array.from(faltantes); };
})();