# StockFlow: pendiente y mejoras

(Actualizado el 02/11/2026, después de la protección de páginas, la pestaña "Comprar productos" y las métricas de alertas de stock.)

## Lo más urgente

1. **Escapar HTML en todas las páginas** (ver sección 2). Hoy un vendedor puede meter código en el nombre del cliente y se ejecuta cuando el administrador abre Ventas.
2. **Decidir con el grupo compras y gastos** (ver sección 1). La pestaña "Comprar productos" ya existe y la próxima tarea es la función de compra, que depende de esta decisión.

## 1. Lo que falta

### Módulo de usuarios (lo que queda)
- [ ] Bases ya importadas: correr `ALTER TABLE usuarios ADD UNIQUE KEY mail (mail);` (los `.sql` del repo ya lo traen). Avisar al grupo.
- [ ] Los usuarios 1, 2 y 3 (vendedor, repositor, administrador) tienen `nombre` NULL: cargarles nombre desde "Editar usuario" (se hace al terminar los cambios).

### Código de barras (lo que quedó)
- [ ] Cargar el código a los productos que ya existen (hoy tienen `codigo` NULL y la tabla dice "Sin código"). Se hace desde "Editar producto", que ahora exige el código (se hace al terminar los cambios).
- [ ] Usar el código en las demás pantallas: registrar venta, reposiciones, productos (vendedor y repositor) y el inventario buscan solo por nombre. Falta buscar o escanear por código, que es para lo que sirve.
- [ ] Definir si el código tiene que ser de largo fijo (por ejemplo EAN-13). Hoy acepta solo números, de 1 a 50 dígitos.

### Comprar productos (Inventario del administrador)
- [ ] La pestaña ya muestra la lista de productos (producto y categoría). Falta la función de compra: elegir cantidades, registrar la compra y sumar el stock. Depende de la decisión de gastos de abajo.

### Pendiente de definir con el grupo
- [ ] **Gastos (urgente):** `gastos.id_compra` es `NOT NULL UNIQUE`, o sea que un gasto solo nace de una compra. Hay que elegir entre hacer un módulo de compras (las tablas `compra` y `detalle_compra` existen sin rutas) o permitir gastos sin compra (`id_compra` nullable).
- [ ] Reposiciones: ¿el repositor ve solo las suyas o todas? (hoy ven todas). Si es "solo las suyas", aplicar el mismo filtro por token que ya tienen las ventas.
- [ ] Tablas `pedido` y `detalle_pedido`: sin rutas ni pantallas. Definir si se usan o se sacan.

## 2. Seguridad (mejorar)

- [ ] **Escapado de HTML (urgente, no está hecho):** la función `escaparHTML` existe (`js/componentes/escaparHTML.js`) y se carga en 9 páginas, pero casi ningún JS la usa. Falta pasar por `escaparHTML(...)` los datos que se meten con `innerHTML` en:
  - `ventasAdministrador.js` (nombre del cliente, productos, también en los `data-*`)
  - `inventarioAdministrador.js` (tabla de Catálogo, categorías, alertas; la pestaña "Comprar productos" ya escapa)
  - `historialVendedor.js`, `registrarVentaVendedor.js`, `script-productos.js`
  - `productosRepositor.js`, `alertasStockRepositor.js` (también el `data-nombre` del botón Reponer)
  - `gananciasAdministrador.js`
- [ ] **Login:** agregar límite de intentos y sacar el `console.log` del mail (`authController.js`).
- [ ] **CORS:** `cors()` está abierto y el front se sirve desde el mismo servidor. Restringirlo o quitarlo.

### Reglas a respetar
- Todo texto que venga de la base y se arme con `innerHTML` o `insertAdjacentHTML` tiene que pasar por `escaparHTML` (o usar `textContent`). Cargar el script en el `<head>`, después de `sesion.js`.
- Contraseñas: el alta, la edición de usuarios y el login exigen 6 a 16 caracteres y sin `<>'"`. Si se cambia una regla, cambiarla en `usuarioController.js`, en `usuariosAdministrador.js` y en `script-login.js`.
- `backend/.env` no se comparte ni se sube (está en el `.gitignore`).

## 3. Backend (mejorar)

- [ ] Ventas: usar `SELECT ... FOR UPDATE` al chequear stock, o `UPDATE ... WHERE stock >= ?`, para evitar stock negativo con ventas simultáneas.
- [ ] Ventas: validar cantidades enteras (hoy solo chequea que sea 1 o más, así que pasa 1.5) y unificar productos repetidos en una misma venta.
- [ ] Reposiciones: validar que el producto exista (hoy da 500 genérico por la FK).
- [ ] Login: devuelve solo el primer rol en `rol`. Definir qué hacer cuando un usuario tiene varios roles (por ejemplo, selector).
- [ ] `server.js`: sacar `configurarSesion` y el `require` de `middleware/session.js` (vacío) y borrar ese archivo. Arreglar el texto del log del puerto ("en El servidor puerto").
- [ ] Borrar `backend/migrar-passwords.js` (ya no hace falta).
- [ ] Productos: `precio_compra` y `precio_venta` aceptan decimales en el formulario (`step=0.01`) pero la base los redondea (`decimal(20,0)`). Resolver junto con la decisión de la sección 4.
- [ ] Productos: `GET /productos` no filtra por `estado_producto`. Definir si los dados de baja se listan.
- [ ] `verificarSesion` consulta la base en cada pedido (para el estado y los roles). Está bien para este tamaño; si algún día pesa, cachear unos segundos.

## 4. Base de datos (mejorar)

- [ ] Ganancias: el costo se toma del `precio_compra` actual del producto. Guardar el costo unitario en `detalle_venta` para que editar un precio no cambie la rentabilidad histórica. Conviene hacerlo antes de que se acumulen ventas.
- [ ] Sacar los datos de prueba de la base oficial (productos 47, 48 y 49: `teclado`, `vbmxvbm`, `nuevo producto`, con precios 0 o 2). Revisar también las ventas de prueba.
- [ ] `precio_compra` y `precio_venta` son `decimal(20,0)` (sin centavos). Decidir si hacen falta decimales.
- [ ] Tras cualquier cambio de esquema, reexportar `stockflow.sql` y `stockflow_alt.sql` y avisar al grupo.

## 5. Frontend e idioma (mejorar)

- [ ] Etiquetas `data-i18n`: todas las páginas ya cargan `idioma.js`, pero solo `ajustesAdministrador`, `dashboardAdministrador` y `dashboardVendedor` tienen etiquetas. Faltan en el resto, incluido el login, donde el selector de idioma hoy no traduce nada (agregar etiquetas o quitar el selector).
- [ ] Mensajes de error: ya están en `idioma.js`, pero los que manda el servidor (`data.error`) se muestran tal cual y no se traducen. Definir cómo resolverlo.
- [ ] Sincronizar la copia de `idioma.js` del proyecto con la del repo.
- [ ] Saludo: `dashboardAdministrador.js` pisa el saludo con nombre de `sesion.js` (queda sin nombre). Además `actualizarSaludo` está dentro de un closure y `idioma.js` no lo encuentra. Unificar en un solo lugar.
- [ ] `dashboardAdministrador.js`, `dashboardRepositor.js` (se llama `esc`) y `usuariosAdministrador.js` tienen su propia copia de la función de escapado. Pasarlos a la compartida (hay que agregar el script en sus HTML).
- [ ] `dashboardVendedor.js` filtra las ventas por el usuario del token en el front. Ya es redundante (el backend filtra) y se puede quitar.
- [ ] Mensajes de error con `alert()` en inventario (5): reemplazar por un aviso visual de la app (la pantalla de usuarios ya usa avisos propios).

## 6. Documentación

- [ ] `DOCS/README.md`: sacar las contraseñas en texto plano de los usuarios de prueba.
- [ ] `DOCS/README.md`: agregar versión nueva (JWT, bcrypt, `sesion.js`, roles por token, protección de páginas, módulo de usuarios, idioma, login sin mail simulado).
- [ ] `DOCS/README.md`: documentar el `.env` (incluido `JWT_SECRET`) y `npm install` en `backend/`.
- [ ] `DOCS/README.md`: listar las rutas de la API y qué rol accede a cada una.

## Orden sugerido

1. Escapar HTML en las páginas de la sección 2.
2. Decidir compras y gastos, y hacer la función de compra en "Comprar productos".
3. Cargar los nombres de usuarios y los códigos de barras (lo hace el grupo) y usar el código en vender y reponer.
4. Backend: costo histórico en `detalle_venta`, ventas sin stock negativo (`FOR UPDATE`), `console.log` del login, CORS y límite de intentos.
5. Idioma, README y limpieza de datos de prueba.
