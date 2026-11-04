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
        "Resumen de tus ventas y productos más vendidos": "Summary of your sales and best-selling products",
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
        "Buscar productos...": "Search products...",
        "Buscar producto...": "Search for a product...",
        "Buscar un producto...": "Search for a product...",
        "Buscar usuarios...": "Search users...",
        "Buscar categorías...": "Search categories...",
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
        "Acá tenés un resumen de lo que requiere tu atención": "Here is a summary of what needs your attention",
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

        // Pestañas
        "Comprar productos": "Buy products",
        "Catálogo": "Catalog",

        // Modal: nuevo usuario
        "Información personal": "Personal information",
        "* Campos obligatorios": "* Required fields",
        "Nombre completo": "Full name",
        "Ej: Martín Peña": "E.g.: John Smith",
        "Confirmar contraseña": "Confirm password",
        "Roles asignados": "Assigned roles",
        "Estado inicial": "Initial status",
        "Guardar usuario": "Save user",

        // Modal: nuevo producto
        "Completá todos los campos obligatorios": "Fill in all required fields",
        "Información": "Information",
        "Nombre del producto": "Product name",
        "Ej: Monitor 24\"": "E.g.: Monitor 24\"",
        "Código de barras": "Barcode",
        "Ej: 7891...": "E.g.: 7891...",
        "Seleccioná una categoría": "Select a category",
        "Describí el producto...": "Describe the product...",
        "Stock inicial": "Initial stock",
        "Precio de compra": "Purchase price",
        "Precio de venta": "Sale price",
        "Variantes (opcional)": "Variants (optional)",
        "Tipo de variante": "Variant type",
        "Variante": "Variant",
        "Sin variante": "No variant",
        "Ej: Rojo, 128GB...": "E.g.: Red, 128GB...",
        "Guardar producto": "Save product",

        // Modal: nueva categoría
        "Ej: Almacenamiento": "E.g.: Storage",
        "Guardar categoría": "Save category",

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
        "Nueva venta": "New sale",

        // Validaciones generales y autenticación
        "Por favor completá todos los campos": "Please complete all fields",
        "El correo no puede superar los 50 caracteres.": "The email cannot exceed 50 characters.",
        "La contraseña no puede superar los 16 caracteres.": "The password cannot exceed 16 characters.",
        "El correo ingresado no tiene un formato válido.": "The entered email address is not in a valid format.",
        "La contraseña contiene caracteres no permitidos.": "The password contains characters that are not allowed.",
        "El usuario no tiene un rol válido.": "The user does not have a valid role.",
        "Datos inválidos.": "Invalid data.",
        "El correo o la contraseña son incorrectos.": "The email or password is incorrect.",
        "Tu usuario está desactivado. Pedile al administrador que lo active.": "Your account is disabled. Ask the administrator to activate it.",
        "Demasiados intentos fallidos. Probá de nuevo en unos minutos.": "Too many failed attempts. Try again in a few minutes.",
        "El correo o la contraseña son incorrectos. No te quedan más intentos, probá de nuevo en unos minutos.": "The email or password is incorrect. You have no attempts left, try again in a few minutes.",
        "Error al conectar con la base de datos.": "Error connecting to the database.",
        "Necesitás iniciar sesión.": "You need to log in.",
        "Sesión inválida o vencida.": "Invalid or expired session.",
        "Tu usuario está desactivado o ya no existe.": "Your account is disabled or no longer exists.",
        "Error al verificar la sesión.": "Error verifying the session.",
        "No tenés permiso para hacer esto.": "You do not have permission to do this.",
        "¿Con qué rol querés ingresar?": "Which role do you want to sign in with?",
        "Elegí un rol para continuar.": "Choose a role to continue.",
        "Cambiar de rol": "Switch role",
        "Cambiar": "Switch",
        "No tenés asignado ese rol.": "You do not have that role assigned.",

        // Productos
        "Error al cargar los productos.": "Error loading products.",
        "No se pudieron cargar los productos.": "Could not load products.",
        "No se encontraron productos.": "No products found.",
        "Este campo es obligatorio.": "This field is required.",
        "Ingresá un valor válido.": "Enter a valid value.",
        "El código de barras solo puede tener números.": "The barcode can only contain numbers.",
        "El precio de venta no puede ser menor al de compra.": "The sale price cannot be lower than the purchase price.",
        "Error al guardar el producto.": "Error saving the product.",
        "Error al editar el producto.": "Error editing the product.",
        "Error al eliminar el producto.": "Error deleting the product.",
        "Error al obtener los productos.": "Error retrieving products.",
        "Ingresá el código de barras.": "Enter the barcode.",
        "El código de barras no puede superar los 50 dígitos.": "The barcode cannot exceed 50 digits.",
        "Ingresá el nombre del producto.": "Enter the product name.",
        "El nombre no puede superar los 100 caracteres.": "The name cannot exceed 100 characters.",
        "La descripción no puede superar los 600 caracteres.": "The description cannot exceed 600 characters.",
        "Faltan datos obligatorios del producto.": "Required product information is missing.",
        "Los precios no pueden ser negativos.": "Prices cannot be negative.",
        "El stock y el stock mínimo tienen que ser números enteros, sin negativos.": "Stock and minimum stock must be non-negative integers.",
        "Ya existe un producto con ese código de barras.": "A product with that barcode already exists.",
        "La categoría seleccionada no existe.": "The selected category does not exist.",
        "Producto inválido.": "Invalid product.",
        "El producto no existe.": "The product does not exist.",
        "No se puede eliminar: el producto tiene ventas, reposiciones o variantes asociadas.": "Cannot delete: the product has associated sales, restocks, or variants.",
        "Error al obtener las variantes.": "Error retrieving variants.",
        "Faltan datos obligatorios para crear la variante.": "Required information for creating the variant is missing.",
        "Error al guardar la variante.": "Error saving the variant.",

        // Categorías
        "No se encontraron categorías.": "No categories found.",
        "Error al crear la categoría.": "Error creating the category.",
        "Error al eliminar la categoría.": "Error deleting the category.",
        "Error al obtener las categorías.": "Error retrieving categories.",
        "El nombre de la categoría es obligatorio.": "The category name is required.",
        "Ya existe una categoría con ese nombre.": "A category with that name already exists.",
        "La categoría no existe.": "The category does not exist.",
        "No se puede eliminar: hay productos que usan esta categoría.": "Cannot delete: some products use this category.",

        // Ventas
        "No se encontraron ventas.": "No sales found.",
        "Ingresá el nombre del cliente.": "Enter the customer's name.",
        "Error al registrar la venta.": "Error registering the sale.",
        "Error al obtener las ventas.": "Error retrieving sales.",
        "Error al obtener el detalle de las ventas.": "Error retrieving the sales details.",
        "Faltan datos obligatorios para registrar la venta.": "Required information for registering the sale is missing.",
        "Cada producto de la venta necesita id_producto y cantidad válidos.": "Each product in the sale must have a valid id_producto and quantity.",
        "El producto {id} no existe.": "Product {id} does not exist.",
        "Stock insuficiente para \"{nombre}\".": "Insufficient stock for \"{nombre}\".",
        "Seleccioná un producto de la lista.": "Select a product from the list.",
        "Ingresá una cantidad válida.": "Enter a valid quantity.",
        "Venta registrada con éxito para": "Sale successfully registered for",

        // Reposiciones
        "Error al registrar la reposición.": "Error registering the restock.",
        "Error al cargar el historial.": "Error loading the history.",
        "Error al obtener las reposiciones.": "Error retrieving restocks.",
        "Faltan datos obligatorios para registrar la reposición.": "Required information for registering the restock is missing.",

        // Gastos y carga de datos
        "Error al cargar los datos": "Error loading the data",
        "Error al obtener los gastos.": "Error retrieving expenses.",
        "Completá todos los campos obligatorios.": "Complete all required fields.",

        // Gestión de usuarios
        "Ingresá el nombre completo.": "Enter the full name.",
        "Ingresá el email.": "Enter the email address.",
        "Ingresá un email válido (ej: usuario@gmail.com).": "Enter a valid email address (e.g., user@gmail.com).",
        "Las contraseñas no coinciden.": "The passwords do not match.",
        "Confirmá la nueva contraseña.": "Confirm the new password.",
        "Ingresá la nueva contraseña o dejá ambos campos en blanco.": "Enter the new password or leave both fields blank.",
        "La contraseña debe tener entre 6 y 16 caracteres.": "The password must be between 6 and 16 characters long.",
        "La contraseña contiene caracteres no permitidos (< > ' \").": "The password contains characters that are not allowed (< > ' \").",
        "Seleccioná al menos un rol para el usuario.": "Select at least one role for the user.",
        "Error del servidor ({código}).": "Server error ({código}).",
        "El email no puede superar los 50 caracteres.": "The email cannot exceed 50 characters.",
        "Ingresá una contraseña.": "Enter a password.",
        "Algún rol no es válido.": "One or more roles are invalid.",
        "Algún rol no existe en la base de datos.": "One or more roles do not exist in the database.",
        "Error al obtener los usuarios.": "Error retrieving users.",
        "Ya existe un usuario con ese email.": "A user with that email already exists.",
        "Error al guardar el usuario.": "Error saving the user.",
        "Error al editar el usuario.": "Error editing the user.",
        "Usuario inválido.": "Invalid user.",
        "El usuario no existe.": "The user does not exist.",
        "No podés desactivar tu propio usuario.": "You cannot deactivate your own account.",
        "No podés quitarte a vos mismo el rol de administrador.": "You cannot remove the administrator role from your own account.",
        "Falta indicar el estado.": "The status must be specified.",
        "Error al cambiar el estado del usuario.": "Error changing the user's status.",

        "Editar usuario": "Edit user",
        "Desactivar": "Deactivate",
        "Detalle de venta": "Sale details",
        "INFORMACIÓN DE LA VENTA": "SALE INFORMATION",
        "RESUMEN ECONÓMICO": "FINANCIAL SUMMARY",
        "PRODUCTOS VENDIDOS": "SOLD PRODUCTS",
        "Número de venta": "Sale number",
        "Cliente": "Customer",
        "Fecha": "Date",
        "Hora": "Time",
        "Cantidad": "Quantity",
        "Subtotal": "Subtotal",
        "Total": "Total",
        "Código": "Code",
        "Producto": "Product",
        "Precio Unit.": "Unit Price",
        "Dejá en blanco para no cambiar la contraseña": "Leave blank to keep the password unchanged",

        "Productos en compra": "Products in purchase",
        "Todavía no agregaste productos. Tocá un producto de la lista para sumarlo acá.": "You haven't added any products yet. Tap a product on the list to add it here.",
        "Resumen de compra": "Purchase summary",
        "Cantidad de productos": "Number of products",
        "Confirmar compra": "Confirm purchase",
        "Compra registrada con éxito. Se envió la solicitud al repositor.": "Purchase registered successfully. The request was sent to the restocker.",
        "Agregá al menos un producto a la compra.": "Add at least one product to the purchase.",
        "Error al registrar la compra.": "Error registering the purchase.",
        "Agregar a la compra": "Add to purchase",
        "Quitar": "Remove",
        "Cada producto de la compra necesita id_producto y una cantidad entera mayor a 0.": "Each product in the purchase needs a product ID and a whole quantity greater than 0.",
        "Compras pendientes": "Pending purchases",
        "Total de unidades": "Total units",
        "Reposición realizada con éxito.": "Restock completed successfully.",
        "Compras del período": "Purchases this period",
        "No hay compras registradas en este período.": "No purchases recorded in this period.",
        "Error al obtener las compras pendientes.": "Error loading pending purchases.",
        "Compra inválida.": "Invalid purchase.",
        "La compra no existe o ya estaba repuesta.": "The purchase does not exist or was already restocked.",
        "Error al marcar la compra como repuesta.": "Error marking the purchase as restocked.",
    };

    // ---------- PATRONES (frases con números o datos variables) ----------
    // [expresión regular, reemplazo]. El reemplazo puede ser texto ($1, $2) o función.
    function plural(n, singular, pluralTxt) {
        return Number(n) === 1 ? singular : pluralTxt;
    }
    const patrones = [
        // "Juan Perez (vos)" -> "Juan Perez (you)"
        [/^(.+) \(vos\)$/, '$1 (you)'],
        // Placeholders de ejemplo: "Ej: 20" -> "E.g.: 20"
        [/^Ej: (.+)$/, 'E.g.: $1'],
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
        // Alertas del repositor ("Tenés 1 producto con bajo stock y 4 sin stock")
        [/^Tenés (\d+) productos? con bajo stock y (\d+) sin stock$/, function (m, a, b) {
            return 'You have ' + a + plural(a, ' product', ' products') + ' with low stock and ' + b + ' out of stock';
        }],
        [/^Tenés (\d+) productos? con bajo stock$/, function (m, a) {
            return 'You have ' + a + plural(a, ' product', ' products') + ' with low stock';
        }],
        [/^Tenés (\d+) compras? pendientes? de reposición$/, function (m, a) {
            return 'You have ' + a + plural(a, ' purchase', ' purchases') + ' pending restock';
        }],
        [/^Compra #(\d+)$/, 'Purchase #$1'],
        [/^El producto (\d+) no existe\.$/, 'Product $1 does not exist.'],
        [/^El correo o la contraseña son incorrectos\. (\d+) intentos? restantes?\.$/, function (m, n) {
            return 'The email or password is incorrect. ' + n + plural(n, ' attempt', ' attempts') + ' remaining.';
        }],
        [/^¡Buenos días, (.+)!$/, 'Good morning, $1!'],
        [/^¡Buenas tardes, (.+)!$/, 'Good afternoon, $1!'],
        [/^¡Buenas noches, (.+)!$/, 'Good evening, $1!']
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
    // Copia del diccionario con claves en minúsculas (para el respaldo sin mayúsculas)
    const traduccionesMin = Object.create(null);
    Object.keys(traducciones).forEach(function (k) {
        const kMin = k.toLowerCase();
        if (!(kMin in traduccionesMin)) traduccionesMin[kMin] = traducciones[k];
    });

    function traducir(texto) {
        const inicio = texto.match(/^\s*/)[0];
        const fin = texto.match(/\s*$/)[0];
        const nucleo = texto.trim().replace(/\s+/g, ' ').replace(/\u2026/g, '...').normalize('NFC');
        if (!nucleo) return texto;
        if (Object.prototype.hasOwnProperty.call(traducciones, nucleo)) {
            return inicio + traducciones[nucleo] + fin;
        }
        // Respaldo: ignora mayúsculas/minúsculas ("INFORMACIÓN PERSONAL" -> "PERSONAL INFORMATION")
        const enMinusculas = traduccionesMin[nucleo.toLowerCase()];
        if (enMinusculas !== undefined) {
            const todoMayus = nucleo === nucleo.toUpperCase() && nucleo !== nucleo.toLowerCase();
            return inicio + (todoMayus ? enMinusculas.toUpperCase() : enMinusculas) + fin;
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
        return !el || (el.closest && el.closest('script, style, code, pre, [data-no-traducir]'));
    }

    // ---------- TRADUCCIÓN DE NODOS ----------
    function traducirTexto(nodo) {
        if (!nodo.nodeValue || !nodo.nodeValue.trim()) return;
        if (debeIgnorar(nodo.parentElement)) return;
        // El contenido de un textarea es lo que escribe el usuario: no se toca
        if (nodo.parentElement && nodo.parentElement.tagName === 'TEXTAREA') return;
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
        document.body.style.visibility = '';
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