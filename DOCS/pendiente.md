# StockFlow: pendiente y mejoras

(Actualizado el 02/11/2026, después del módulo de compras, el aviso de compras pendientes en Reposiciones y las traducciones de los textos nuevos.)

## Lo más urgente

1. **Agregar la columna `estado` a `compra` en las bases ya importadas** (ver sección 1). Sin esa columna, la pantalla de Reposiciones no carga las compras pendientes y el botón "Reponer" falla. Los `.sql` del repo ya la traen.

## 1. Lo que falta

### Módulo de compras (lo que queda)
- [x] Compras: el administrador compra desde Inventario ("Comprar productos"), se guardan `compra` y `detalle_compra` y se registra el gasto ("Compra #id") en una sola transacción. La compra queda pendiente y no suma stock.
- [x] Reposiciones: aviso y tabla de compras pendientes. El botón "Reponer" registra una reposición por cada producto (comentario "Compra #id"), suma el stock y marca la compra como repuesta.
- [x] `stockflow.sql` y `stockflow_alt.sql` ya traen la columna `estado` en `compra`.
- [ ] **Bases ya importadas (urgente):** correr `ALTER TABLE compra ADD COLUMN estado VARCHAR(20) NOT NULL DEFAULT 'pendiente';`. Las compras que ya existían quedan como pendientes: si alguna ya se repuso a mano, marcarla con `UPDATE compra SET estado = 'repuesta' WHERE id_compra = ...;` para no sumar el stock dos veces.
- [ ] Avisar al grupo: una compra se repone **solo** con el botón "Reponer". Si además se carga con el formulario de reposición, el stock se suma dos veces. El formulario queda para reposiciones que no vienen de una compra.
- [ ] Opcional: historial de compras para el administrador (hoy solo se ven como gasto en Ganancias) y poder cancelar una compra pendiente.

### Varios roles por usuario
- [ ] El backend y `sesion.js` ya aceptan varios roles, pero el login manda siempre al dashboard del primer rol y no hay forma de pasar al otro. Plan propuesto (sin tocar backend ni base):
  - Si el usuario tiene más de un rol, después del login elegir con qué rol entrar (`login.html`, `script-login.js`).
  - Link "Cambiar de rol" en la sidebar, solo para usuarios con varios roles (se puede agregar desde `sesion.js`).
  - `sesion.js` tiene que mandar al dashboard del rol elegido, no al primero.
- [ ] Definir con el grupo qué combinaciones tienen sentido (por ejemplo vendedor + repositor).

### Módulo de usuarios (lo que queda)
- [ ] Bases ya importadas: correr `ALTER TABLE usuarios ADD UNIQUE KEY mail (mail);` (los `.sql` del repo ya lo traen). Avisar al grupo.
- [ ] Los usuarios 1, 2 y 3 (vendedor, repositor, administrador) tienen `nombre` NULL: cargarles nombre desde "Editar usuario" (se hace al terminar los cambios).

### Código de barras (lo que quedó)
- [ ] Cargar el código a los productos que ya existen (hoy tienen `codigo` NULL y la tabla dice "Sin código"). Se hace desde "Editar producto", que ahora exige el código (se hace al terminar los cambios).
- [ ] Usar el código en las demás pantallas: registrar venta, reposiciones, productos (vendedor y repositor), el inventario y "Comprar productos" buscan solo por nombre. Falta buscar o escanear por código, que es para lo que sirve.
- [ ] Definir si el código tiene que ser de largo fijo (por ejemplo EAN-13). Hoy acepta solo números, de 1 a 50 dígitos.

### Pendiente de definir con el grupo
- [x] Gastos: se decidió el módulo de compras. Cada gasto nace de una compra (`gastos.id_compra`).
- [ ] Reposiciones: ¿el repositor ve solo las suyas o todas? (hoy ven todas). Si es "solo las suyas", aplicar el mismo filtro por token que ya tienen las ventas.
- [ ] Tablas `pedido` y `detalle_pedido`: sin rutas ni pantallas. Definir si se usan o se sacan.

## 2. Seguridad (mejorar)

- [x] **Escapado de HTML:** todas las páginas pasan por `escaparHTML(...)` los textos de la base que se arman con `innerHTML` (nombres, categorías, clientes, descripciones, comentarios, también en los `data-*`). Los dashboards del administrador y del repositor y la pantalla de usuarios usan su propia copia (ver sección 5).
- [x] **Login:** se sacó el `console.log` del mail.
- [x] **CORS:** se sacó `cors()` de `server.js`. Queda la dependencia en `backend/package.json`, que se puede desinstalar (`npm uninstall cors`).
- [x] **Login:** límite de 10 intentos fallidos cada 15 minutos por IP (`express-rate-limit` en `authRoutes.js`). Después del pull hay que correr `npm install` en `backend/`.
- [ ] **Servidor con Nginx:** agregar `app.set("trust proxy", 1)` en `server.js`, si no el límite ve a todos con la IP del proxy. No agregarlo antes de tener Nginx: sin proxy, cualquiera podría saltear el límite mandando un header `X-Forwarded-For` falso.

### Reglas a respetar
- Todo texto que venga de la base y se arme con `innerHTML` o `insertAdjacentHTML` tiene que pasar por `escaparHTML` (o usar `textContent`). Cargar el script en el `<head>`, después de `sesion.js`.
- Todo texto nuevo que se vea en pantalla (incluidos los mensajes de error) se agrega en español → inglés en `js/idioma.js`. Si lleva números, va como patrón.
- Contraseñas: el alta, la edición de usuarios y el login exigen 6 a 16 caracteres y sin `<>'"`. Si se cambia una regla, cambiarla en `usuarioController.js`, en `usuariosAdministrador.js` y en `script-login.js`.
- Cada cambio en el backend necesita reiniciar el servidor (`node backend/server.js`). Si queda un proceso viejo ocupando el puerto 3000, el nuevo no arranca y se sigue usando el código viejo.
- `backend/.env` no se comparte ni se sube (está en el `.gitignore`).

## 3. Backend (mejorar)

- [ ] Ventas: usar `SELECT ... FOR UPDATE` al chequear stock, o `UPDATE ... WHERE stock >= ?`, para evitar stock negativo con ventas simultáneas.
- [ ] Ventas: validar cantidades enteras (hoy solo chequea que sea 1 o más, así que pasa 1.5) y unificar productos repetidos en una misma venta.
- [ ] Reposiciones: validar que el producto exista (hoy da 500 genérico por la FK).
- [ ] `server.js`: sacar `configurarSesion` y el `require` de `middleware/session.js` (vacío) y borrar ese archivo. El `app.listen` quedó sin mensaje: agregar uno simple ("Servidor en el puerto 3000") para saber que arrancó.
- [ ] Borrar `backend/migrar-passwords.js` (ya no hace falta).
- [ ] Productos: `precio_compra` y `precio_venta` aceptan decimales en el formulario (`step=0.01`) pero la base los redondea (`decimal(20,0)`). Resolver junto con la decisión de la sección 4.
- [ ] Productos: `GET /productos` no filtra por `estado_producto`. Definir si los dados de baja se listan.
- [ ] `verificarSesion` consulta la base en cada pedido (para el estado y los roles). Está bien para este tamaño; si algún día pesa, cachear unos segundos.

## 4. Base de datos (mejorar)

- [ ] Ganancias: el costo se toma del `precio_compra` actual del producto. Guardar el costo unitario en `detalle_venta` para que editar un precio no cambie la rentabilidad histórica. Ahora que hay compras importa más: si se compra a otro precio y se actualiza `precio_compra`, cambian las ganancias de las ventas viejas.
- [ ] Sacar los datos de prueba de la base oficial (productos 47, 48 y 49: `teclado`, `vbmxvbm`, `nuevo producto`, con precios 0 o 2). Revisar también las ventas y compras de prueba.
- [ ] `precio_compra` y `precio_venta` son `decimal(20,0)` (sin centavos). Decidir si hacen falta decimales.
- [ ] Tras cualquier cambio de esquema, reexportar `stockflow.sql` y `stockflow_alt.sql` y avisar al grupo.

## 5. Frontend e idioma (mejorar)

- [ ] Datos de ejemplo en el HTML de Inventario: la pestaña Categorías (Periféricos, Monitores, Audio...) y la tabla de Alertas tienen filas escritas a mano. El JS las reemplaza al cargar, pero se ven un instante y quedan si el servidor falla. Sacarlas y revisar las demás páginas.
- [ ] Pestañas de Inventario en celular: con 4 pestañas no entran a 393px de ancho. Agregar un `@media (max-width: 480px)` con menos separación y scroll horizontal.
- [ ] Textos distintos para lo mismo: Alertas del repositor dice "Tienes ... con bajo stock" y el resto del sistema usa "Tenés ... con stock crítico". Unificar (y ajustar el patrón en `idioma.js`).
- [ ] Etiquetas `data-i18n`: todas las páginas cargan `idioma.js`, que ya traduce el texto de la página aunque no tenga etiquetas. Revisar con `idiomaFaltantes()` en la consola (con el sistema en inglés) qué textos quedan sin traducir en cada pantalla, incluido el login.
- [ ] Mensajes de error del servidor: ya están en `idioma.js` y se traducen al mostrarse. Revisar con `idiomaFaltantes()` que no falte ninguno.
- [ ] Saludo: `dashboardAdministrador.js` pisa el saludo con nombre de `sesion.js` (queda sin nombre). Unificar en un solo lugar.
- [ ] `dashboardAdministrador.js`, `dashboardRepositor.js` (se llama `esc`) y `usuariosAdministrador.js` tienen su propia copia de la función de escapado. Pasarlos a la compartida (hay que agregar el script en sus HTML).
- [ ] `dashboardVendedor.js` filtra las ventas por el usuario del token en el front. Ya es redundante (el backend filtra) y se puede quitar.
- [ ] Mensajes de error con `alert()` en inventario (5): reemplazar por un aviso visual de la app (como el de "Comprar productos" o la pantalla de usuarios).

## 6. Documentación

- [ ] `DOCS/README.md`: sacar las contraseñas en texto plano de los usuarios de prueba.
- [ ] `DOCS/README.md`: agregar versión nueva (JWT, bcrypt, `sesion.js`, roles por token, protección de páginas, módulo de usuarios, módulo de compras, idioma, login sin mail simulado).
- [ ] `DOCS/README.md`: documentar el `.env` (incluido `JWT_SECRET`) y `npm install` en `backend/`.
- [ ] `DOCS/README.md`: listar las rutas de la API y qué rol accede a cada una (incluidas `POST /compras`, `GET /compras/pendientes` y `PATCH /compras/:id/repuesta`).

## Orden sugerido

1. Columna `estado` en `compra` en las bases ya importadas (los `.sql` ya la traen).
2. Costo histórico en `detalle_venta` (antes de que se acumulen ventas y compras).
3. Varios roles por usuario (selector en el login y "Cambiar de rol").
4. Cargar los nombres de usuarios y los códigos de barras (lo hace el grupo) y usar el código en vender, reponer y comprar.
5. Backend: ventas sin stock negativo (`FOR UPDATE`), limpieza de `server.js`.
6. Datos de ejemplo del HTML, idioma, README y limpieza de datos de prueba.
