# CLAUDE.md

Este archivo brinda guía a Claude Code al trabajar con código en este repositorio.

## Descripción general del proyecto

StockFlow es un prototipo de gestión de inventario solo de front-end para tiendas minoristas
(ver [DOCS/README.md](DOCS/README.md)). Tiene tres roles de usuario — Administrador, Repositor,
Vendedor (Cliente es opcional, aún no estamos trabajando en él) — cada uno con su propio
dashboard y pantallas correspondientes a las funcionalidades que tiene cada rol.

No hay backend, paso de build ni gestor de paquetes: es HTML, CSS y JS vanilla plano,
servido/abierto como archivos estáticos, con estilos de Bootstrap 5 + Bootstrap Icons vía CDN.
No existe ninguna capa de backend ni base de datos conectada todavía — todo es mock del lado
del cliente.

Los mensajes de commit y los comentarios en el código están escritos en español; respetá esa
convención al editar archivos existentes. No envíes respuestas muy largas ni divagues en
aspectos que no son importantes, enfocate solamente en lo importante y lo que influye en
el proyecto.

## Cómo ejecutar el proyecto

No hay herramientas de build/lint/test (no hay `package.json`). Para ver una página, abrí el
archivo HTML correspondiente en `paginas/` directamente en el navegador, o serví la raíz del
repo con cualquier servidor de archivos estáticos. Todos los links internos entre páginas son
rutas relativas (ej. `paginas/dashboardAdministrador.html`, `../CSS/...`, `../js/...`), así
que mantené la estructura de carpetas intacta al agregar archivos.

### Credenciales de login de prueba (mock, solo del lado del cliente)

Definidas en [js/js-paginas/script-login.js](js/js-paginas/script-login.js):
- administrador@stockflow.com / administrador
- repositor@stockflow.com / repositor
- vendedor@stockflow.com / vendedor

El login es enteramente client-side (un array `usuarios` hardcodeado); no hay autenticación
real ni persistencia. Al confirmar login redirige al dashboard del rol correspondiente.

## Arquitectura

## Nivel de código

El proyecto es una entrega académica de bachillerato informática en UTU. El código debe
reflejar ese nivel — ni más ni menos. Seguí estas reglas siempre:

- Usá HTML, CSS y JS vanilla plano. Sin frameworks, sin librerías externas salvo
  Bootstrap 5 y Bootstrap Icons que ya están incluidos vía CDN.
- El JS debe ser simple y directo: funciones nombradas, `getElementById`, `querySelector`,
  `addEventListener`, `classList`, condicionales y bucles básicos. Nada de arrow functions
  encadenadas, destructuring complejo, Promises, async/await ni patrones avanzados.
- El CSS debe usar las variables definidas en `colores.css` pero sin técnicas avanzadas —
  `flexbox` y `grid` están bien, pero nada de animaciones complejas, `clip-path`,
  `@keyframes` elaborados ni cosas que un alumno de bachillerato no pueda explicar.
- Los comentarios en el código deben ser en español y explicar el qué y el por qué en
  lenguaje simple, como lo escribiría un estudiante.
- Si tenés dudas entre una solución simple y una elegante, elegí siempre la simple.
  El objetivo es que cualquier integrante del equipo pueda leer, entender y explicar
  cada línea en una defensa oral.

### Estructura de directorios

- `paginas/` — un archivo HTML por pantalla (dashboards, login, gestión de
  productos/usuarios). Cada página incluye Bootstrap vía CDN, su propia hoja de estilos
  específica y su propio JS específico.
- `CSS/base/` — primitivas globales: `colores.css` (custom properties CSS para la paleta
  de colores), `fuentes.css`, `reset.css`, `layout.css`.
- `CSS/componentes/` — estilos de componentes reutilizables compartidos entre páginas
  (navbar, sidebar, cards, tablas, botones, formularios, iconos).
- `CSS/styles-paginas/` — una hoja de estilos por página. Estos archivos no contienen
  reglas propias para elementos compartidos; en cambio, hacen `@import` de los CSS base +
  componentes que necesitan, en un orden específico (ver más abajo), más los overrides
  específicos de esa página al final.
- `js/componentes/` — componentes JS genéricos, agnósticos del rol (ej. `menu-responsive.js`
  construye el menú hamburguesa móvil a partir de un objeto de configuración).
- `js/js-paginas/` — un archivo JS por página/rol. Los archivos de nav específicos por rol
  (`navAdministrador.js`, `navRepositor.js`, `navVendedor.js`) solo declaran una configuración
  (links + página por defecto) e invocan al componente compartido. Los archivos de lógica de
  página (`script-login.js`, `script-productos.js`, `usuariosAdministrador.js`) contienen la
  lógica DOM de esa pantalla específica.
- `DOCS/README.md` — descripción del producto y changelog de versiones. Actualizá el changelog
  acá al entregar un cambio importante, siguiendo el formato existente `# vX.Y.Z [Es]`.

### El orden de import de CSS importa

Las hojas de estilos de página en `CSS/styles-paginas/` importan el CSS compartido en un
orden fijo: colores/fuentes → reset/layout → componentes (navbar antes que sidebar, luego
iconos/cards/tablas/etc.). Este orden resuelve conflictos específicos de cascada (ver el
comentario inline sobre que `navbar.css` necesita preceder a `sidebar.css`) — al crear una
nueva hoja de estilos de página, copiá el bloque `@import` de una existente (ej.
[CSS/styles-paginas/dashboardAdministrador.css](CSS/styles-paginas/dashboardAdministrador.css))
en vez de reordenar los imports.

Todos los colores, primitivas de espaciado, etc. están definidos como custom properties CSS
en [CSS/base/colores.css](CSS/base/colores.css) y `fuentes.css`. Usá los nombres de
`--variable` existentes en vez de hardcodear colores/fuentes.

### Patrón de menú móvil compartido

El menú hamburguesa responsive está dividido en un renderizador genérico y una configuración
por rol, para evitar duplicar el mismo markup/lógica entre los tres dashboards:
- [js/componentes/menu-responsive.js](js/componentes/menu-responsive.js) expone
  `inicializarMenuMovil(config)`, que construye el HTML del menú móvil, lo inyecta en la
  página y resalta el link activo.
- El archivo de cada rol en `js/js-paginas/nav*.js` llama a `inicializarMenuMovil({
  paginaDefault, links })` en `DOMContentLoaded` con los links propios de ese rol.
- Los links declarados en una config `nav*.js` deben mantenerse sincronizados con el markup
  del `<nav>` del sidebar de escritorio correspondiente en las páginas HTML de ese rol — al
  agregar/quitar un link del sidebar, actualizá ambos lugares.
- Cada página incluye ambos scripts en orden: primero `menu-responsive.js`, luego el `nav*.js`
  específico del rol.

### Guía de inicio de cada rol
¿Qué se puede hacer como Vendedor?

Iniciar sesión en el sistema accediendo a su menú principal (dashboard).
Registrar ventas buscando el producto por su nombre o código, agregar cantidades y confirmar la venta.
Ver el historial y detalle de las ventas realizadas anteriormente filtradas por fecha y hora. Además, el historial contiene información como las ventas realizadas, total vendido y ganancias.
Consultar el catálogo de productos, incluyendo nombre del producto, categoría, precio, stock y estado actual.

Cómo se inicia sesión:
- Abre el sistema.
- Completa los campos vacíos con los datos del usuario válidos (mail y contraseña).
- Haz click en el botón “Ingresar”.

Cómo se registran las ventas:
- Desde el menú de vendedor ingresa a “Registrar venta”.
- Ingresa el nombre o el código de barra del producto que el cliente va a comprar en la barra de búsqueda.
- Selecciona el producto.
- Escribe la cantidad que el cliente desea comprar.
- Confirma la venta con el botón “Confirmar venta”.

Cómo se ve el historial de ventas:
- Ingresa al apartado “Historial” desde el menú.
- Busca la venta la cual quieras saber los detalles pudiendo filtrar por fecha.
- Haciendo click en el botón “Ver” se puede observar más en detalle. 

Cómo se consulta el catálogo de productos:
- Ingresa al apartado “Productos” desde el menú.
- Ingresa el nombre del producto en la barra de búsqueda.
- Haz click en el producto para ver su información.

¿Qué se puede hacer como Administrador?

Iniciar sesión y acceder al dashboard general del negocio.
Ver todas las ventas del sistema (de todos los vendedores) con filtros por fecha.
Ver el detalle completo de cada venta (incluyendo información de ellas, resumen económico y productos más vendidos).
Gestionar el inventario completo: crear, editar y eliminar productos, configurar stock mínimo personalizado por producto, gestionar categorías (crear y eliminar) y gestionar variantes de productos (modelo, color, etc.).
Ver y gestionar usuarios: crear nuevos usuarios, asignar uno o más roles a cada usuario, activar y desactivar cuentas.
Ver panel de ganancias: total vendido, costo total, rentabilidad, ventas realizadas, ganancia por categoría y productos más vendidos con su rentabilidad propia.
Ver alertas de stock y resumen de stock.

Cómo se inicia sesión:
- Abre el sistema.
- Rellena los campos de texto necesarios para iniciar sesión (mail y contraseña).
- Haz click en “Ingresar”.

Cómo ver todas las ventas del sistema:
- Desde el menú, ingresa a “Ventas”.
- Se va a mostrar el listado de todas las ventas realizadas en el sistema.
- Utiliza los filtros de fecha para seleccionar el período que quieras consultar.
- Para consultar una venta específica, haz click sobre ella para acceder a su detalle. 

Cómo ver el detalle de una venta:
- Ingresa al apartado “Ventas”.
- Busca la venta que quieras consultar (si es necesario utiliza los filtros de fecha).
- Haz click en el botón “Ver”.
- Se mostrará el detalle completo de la venta.
- Consulta la información de la venta, el resumen económico y los productos incluidos.

(gestión de inventario)

Cómo crear un producto:
- Ingresa al apartado “Inventario” desde el menú.
- Haz click en el botón “Nuevo producto”.
- Completa los datos que se solicitan del producto.
- Determina su stock y el stock mínimo personalizable.
- Selecciona la categoría correspondiente. 
- Agrega las variantes del producto, como modelo o color, si las tiene.
- Haz click en el botón “Guardar”.
- El producto quedará registrado en el inventario.

Cómo ver el detalle de un producto:
- Ingresa al apartado “Inventario” desde el menú principal.
- Busca el producto que quieras consultar.
- Haz click en el botón “...”.
- Se desplegará un mini menú con las acciones disponibles.
- Haz click en “Ver detalle”.
- Se mostrará el detalle del producto.

Cómo editar un producto:
- Ingresa al apartado “Inventario” desde el menú principal.
- Busca el producto que quieras modificar.
- Haz click en el botón “...”.
- Se desplegará un mini menú con las acciones disponibles.
- Haz click en “Editar producto”.
- Modifica los datos necesarios.
- Haz click en el botón “Guardar cambios”.

Cómo eliminar un producto:
- Ingresa al apartado “Inventario” desde el menú.
- Busca el producto que quieras eliminar.
- Haz click en el botón “...”.
- Se desplegará un mini menú con las acciones disponibles.
- Haz click en “Eliminar producto”.
- Confirma la eliminación cuando el sistema lo solicite.

Cómo configurar el stock mínimo de un producto:
- Ingresa al apartado “Inventario” desde el menú.
- Selecciona el producto que quieras configurar.
- Haz click en el botón ”...”.
- Se desplegará un mini menú con las acciones disponibles.
- Haz click en “Editar producto”.
- Busca el campo correspondiente al stock mínimo.
- Ingresa la cantidad mínima deseada.
- Guarda los cambios.
- Cuando el stock llegue al límite establecido, el sistema generará una alerta de stock.

(gestión de categorías)

Cómo crear una categoría:
- Ingresa al apartado “Inventario” desde el menú.
- Ingresa al apartado “Categorías”.
- En la sección “Nueva categoría” ingresa el nombre de la categoría con su descripción si es necesario.
- Haz click en el botón “Guardar categoría”.

Cómo eliminar una categoría:
- Busca la categoría que quieras eliminar.
- Haz click en el botón “...”.
- Se desplegará un mini menú con las acciones disponibles.
- Haz click en “Eliminar categoría”.
- Confirma la eliminación.

Cómo gestionar las variantes de un producto:
- Ingresa al apartado “Inventario” desde el menú.
- Ingresa al apartado “Productos”.
- Selecciona el producto al que quieras modificar variantes.
- Haz click en el botón “...”.
- Se desplegará un mini menú con las acciones disponibles.
- Haz click en “Editar producto”.
- Ingresa a la sección de “Variantes”.
- Agrega, modifica o elimina las variantes correspondientes.
- Guarda los cambios.

(gestión de usuarios)

- Cómo crear un usuario:
- Ingresa al apartado “Usuarios” desde el menú.
- Haz click en el botón “Nuevo usuario”.
- Completa los datos solicitados.
- Asigna al usuario uno o más roles.
- Haz click en “Crear usuario”.

Cómo editar un usuario:
- Ingresa al apartado “Usuarios” desde el menú.
- Busca el usuario que quieras editar.
- Haz click en el botón “...” en la fila de “Acciones”.
- Se desplegará un mini menú con las acciones disponibles.
- Haz click en “Editar usuario”.
- Modifica los datos necesarios.
- Haz click en “Guardar cambios”.

Cómo eliminar un usuario:
- Ingresa al apartado “Usuarios” desde el menú.
- Busca el usuario que quieras eliminar.
- Haz click en el botón “...” en la fila de “Acciones”.
- Se desplegará un mini menú con las acciones disponibles.
- Haz click en “Eliminar usuario”.
- El sistema solicitará confirmación.
- Confirma la eliminación del usuario.

Cómo asignar rol/roles a un usuario:
- Ingresa al apartado “Usuarios” desde el menú.
- Busca el usuario que quieras modificar.
- Haz click en el botón “...” en el apartado de “Acciones”.
- Se desplegará un mini menú con las acciones disponibles.
- Haz click en “Editar usuario”.
- Ingresa a la sección “Roles”.
- Selecciona uno o más roles.
- Haz click en “Guardar cambios”.

Cómo activar/desactivar un usuario:
- Ingresa al apartado “Usuarios” desde el menú.
- Busca el usuario correspondiente.
- Haz click en el botón “...” en el apartado de “Acciones”.
- Se desplegará un mini menú con las acciones disponibles.
- Haz click en “Activar usuario” o “Desactivar usuario”, según lo que corresponda.
- Confirma la acción cuando el sistema lo solicite.

(ganancias)

Cómo ver el panel de ganancias:
- Ingresa al apartado “Ganancias” desde el menú.
- Se mostrará el resumen económico del negocio.
- Consulta el total vendido.
- Consulta el costo total.
- Revisa la rentabilidad.
- Consulta la cantidad de ventas realizadas.
- Revisa la ganancia por categoría.
- Consulta cuáles son los productos más vendidos.
- Revisa la rentabilidad individual de cada producto.

Cómo ver las alertas de stock:
- Ingresa al apartado “Inventario” desde el menú.
- Ingresa al apartado “Alertas de stock”.
- Revisa los productos que presentan niveles de stock crítico, sin stock o disponibles.
- Si es necesario, ingresa al inventario para revisar o actualizar el stock de los productos afectados.

¿Qué se puede hacer como Repositor?

Iniciar sesión y acceder a su dashboard (menú principal).
Puede ver alertas de stock, los productos que tengan stock crítico o sin stock.
Puede ver el catálogo completo de productos (nombre, precio de compra, precio de venta, stock actual, stock mínimo, estado).
Registrar reposiciones de stock (los productos y cantidades).
Ver el historial de las reposiciones realizadas.
	
Cómo se inicia sesión:
- Abre el sistema.
- Completa los campos vacíos con los datos del usuario (mail y contraseña).
- Haz click en el botón “Ingresar”.

Cómo ver las alertas de stock:
- Ingresa al menú principal (dashboard) del Repositor
- Allí se puede ver las alertas de los productos con stock bajo junto a los productos sin stock y la cantidad de stock total actual.
- Revisa los productos que presentan niveles de stock bajos.
- Consulta el resumen de stock crítico.
- Si es necesario, ingresa al inventario para revisar o actualizar el stock de los productos afectados.

Cómo realizar una reposición:
- Desde el menú, ingresa a “Reposiciones”.
- En el apartado “Nueva reposición” busca el producto que desea reponer.
- Selecciona la cantidad de stock y agrega un comentario (opcional).
- Haz click en el botón “Registrar reposición”.

Cómo ver el historial de reposiciones:
- Desde el menú, ingresa a “Reposiciones”.
- Debajo del apartado “Nueva reposición” estará la sección de “Historial de reposiciones” resumida.
- Para ver el historial completo, haz click en el botón “Ver más”.
- Consulta las reposiciones realizadas.

### Datos y formularios mock

Páginas como `usuariosAdministrador.html` implementan filtrado, búsqueda y formularios de
"agregar fila" puramente en memoria contra el DOM (sin backend/persistencia) — ver
[js/js-paginas/usuariosAdministrador.js](js/js-paginas/usuariosAdministrador.js). Las filas
nuevas agregadas vía formulario se anexan directamente a la tabla y se pierden al recargar;
no asumas que existe ninguna capa de datos más allá de lo visible en el archivo JS de la
página.

## Convenciones visuales — seguí estas siempre

### Colores (usar las variables, no valores hardcodeados)

```css
/* COLORES PRINCIPALES - SIDEBAR Y CLICKEABLES */
--azul-primario: #060b44   /* fondo sidebar y botones primarios */
--azul-activo:   #0c134d   /* ítem activo en sidebar, hover de botones */
--azul-link:     #1565c0   /* links secundarios "Ver todo", "Ver detalle" */

/* FONDOS Y SUPERFICIES */
--gris-fondo:    #e9e9e9   /* fondo general de la página */
--blanco:        #ffffff   /* tarjetas, paneles, inputs */
--celeste:       #87ceeb   /* fondo de la página de login */
--gris-borde:    #636363   /* bordes de tarjetas y tablas */
--gris-tarjeta:  rgb(226, 226, 226)   /* fondo de cards */

/* TEXTOS */
--texto-oscuro:  #1a1a1a   /* texto principal */
--texto-gris:    #6c757d   /* etiquetas secundarias */
--gris-input:    rgb(170, 170, 170)   /* placeholder de inputs */

/* COLORES SEMÁNTICOS */
--verde-ingreso:      #2e7d32              /* valores positivos, ingresos */
--rojo-alerta:        #c62828              /* alertas, sin stock, errores */
--amarillo-atencion:  rgb(219, 168, 57)   /* stock crítico, advertencias */
--fondo-alerta:       #ffdee4             /* fondo de bloque de alerta */
--borde-alerta:       #ef9a9a             /* borde de bloque de alerta */
```

Los badges de estado usan estos semánticos como base:
- **Verde**: `background: #e8f5e9; color: var(--verde-ingreso)`
- **Rojo**: `background: var(--fondo-alerta); color: var(--rojo-alerta)`
- **Amarillo**: `background: #fff8e1; color: var(--amarillo-atencion)`
- `border-radius: 20px`, `padding: 2px 8px`, `font-size: 10px`, `font-weight: 600`

### Tipografía

- **Poppins** (700, 800): títulos `<h1>`–`<h3>`, nombre de la app en sidebar, alertas destacadas
- **Inter** (400, 500, 600, 700): todo lo demás — labels, tablas, botones, texto general

### Componentes recurrentes — cómo están hechos

**Cards**: `background: var(--color-card)`, `border-radius: 14px–20px`, `padding: 18px 22px`.
Título de sección en mayúsculas, `font-size: 11px`, `letter-spacing: 0.08em`, separado del
contenido por un `border-bottom: 2px solid var(--color-borde-fuerte)`.

**Tablas**: `border-collapse: collapse`, header con `background: #fafafa` o `#f4f4f4`,
`font-size: 10px` en uppercase para `<th>`, `font-size: 11–12px` para `<td>`. Bordes solo
en `border-bottom: 1px solid #f0f0f0`. La última fila no tiene borde inferior.

**Botón primario**: `background: var(--color-sidebar)`, `color: #fff`, `border: none`,
`border-radius: 8px`, `font-weight: 600`. Hover: `background: var(--color-activo)`.

**Botón secundario**: `background: #fff`, `border: 1px solid var(--color-borde)`,
`color: #555`, `border-radius: 8px`.

**Inputs y selects**: `height: 32–36px`, `background: #fff`, `border: 1px solid #aeaeae`,
`border-radius: 8px`, `padding: 0 12px`, `font-size: 12px`. Placeholder en `#888–#bbb`.

**Popups contextuales (`···`)**: se abren al hacer clic en el botón de 3 puntos de una fila.
Tienen un header con el nombre del ítem afectado, luego las acciones con íconos. Acciones
destructivas (eliminar) en rojo. La fila activa se resalta con `background: #f0f4ff`.

**Alerta de stock**: `background: #fdecea`, `border: 1px solid #ef9a9a`, `border-radius: 10px`,
ícono ⚠ en rojo, título en negrita, subtítulo con el conteo. Link "Ver en inventario →"
alineado a la derecha.

**Pestañas (tabs)**: `border-bottom: 1.5px solid var(--color-borde)`, tab activo con
`border-bottom: 2px solid var(--color-sidebar)` y `color: var(--color-sidebar)`.
Las inactivas en `color: #888`.

## Pantalla en desarrollo: Historial de ventas (Vendedor)

Se reorganiza el flujo actual: hoy la ruta/menú "Historial" muestra directamente la pantalla
de **Detalle de venta** como página independiente. Eso cambia: "Historial" debe mostrar el
**listado de ventas**, y el detalle pasa a ser un **modal overlay** que se abre al hacer clic
en una fila, igual al patrón de modales ya usado en el resto del sistema (mismo tipo de
estructura que "Nuevo producto"/"Nuevo usuario", aunque acá sea de solo lectura). Reutilizá
esa misma estructura de modal como base — no inventes un patrón nuevo.

No se crean archivos nuevos — todo va en los archivos existentes del historial:
- HTML: dentro de `paginas/historialVentas.html` (o el archivo actual que hoy tiene el detalle,
  renombrando su rol de página de detalle a página de listado)
- CSS: dentro de `CSS/styles-paginas/historialVentas.css`
- JS: dentro de `js/js-paginas/historialVentas.js`

### Contenido de la pantalla — listado (según Figma, captura adjunta)

**Card "Historial de ventas"**
- Tabla con columnas: Fecha, Hora, Cliente, Total, Estado
- Cada fila corresponde a una venta; clic en la fila abre el modal de detalle
- Mismo estilo visual que el resto del sistema (cards gris/blanco, tipografía y colores
  consistentes con Registrar Venta)
- Filas de altura uniforme — usar `table-layout: fixed` y anchos de columna definidos, no
  dejar que el contenido deforme el alto de las filas

### Contenido del modal — Detalle de venta, misma información que la pantalla actual

**Información de la venta**
- Número de venta
- Cliente
- Fecha
- Hora
- Estado (badge "Completada" u otro estado correspondiente)

**Resumen económico**
- Cantidad total de unidades
- Subtotal
- Total

**Productos vendidos**
- Tabla: Código, Producto, Cantidad, Precio Unit., Subtotal

### Comportamiento del modal
- Título del modal: "Venta #{número}"
- Fondo oscurecido detrás (overlay)
- X para cerrar arriba a la derecha (reemplaza el actual "← Volver")
- Es de solo lectura — no tiene botón de guardar ni edita nada
- No redirige a ninguna página — todo ocurre dentro de `historialVentas.html`
- El modal recibe el ID de la venta clickeada y trae/muestra sus datos correspondientes desde
  el array/fuente de datos ya usada en el proyecto

### Validación de datos
- Antes de dar por cerrada la pantalla, chequear que el Subtotal/Total del resumen económico
  coincida con la suma real de "Productos vendidos" — hay un caso de datos de prueba (Venta
  #0021) donde no coinciden