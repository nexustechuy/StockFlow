# StockFlow: pendiente y mejoras

## 1. Lo que falta

### Historial y ids fijos
- [ ] `GET /ventas` y `GET /detalle-ventas` tienen que filtrar por el usuario del token cuando el rol es vendedor (hoy devuelven todo).
- [ ] `historialVendedor.js`: borrar `ID_USUARIO_VENDEDOR = 1` y el filtro del front.
- [ ] `registrarVentaVendedor.js`: borrar `ID_USUARIO_VENDEDOR` y el `id_usuario` del body.
- [ ] `reposicionesRepositor.js`: borrar `ID_USUARIO_REPOSITOR` y el `id_usuario` del body.

### Código de barras
- [ ] Decidir: reutilizar la columna `producto.codigo` (ya existe, `UNIQUE`, todos NULL) o agregar `codigo_barras`. Recomendado: reutilizar `codigo`.
- [ ] Guardar el código al crear producto (`productoModel.crear` lo ignora).
- [ ] Devolver el código en `SELECT_PRODUCTO`.
- [ ] Crear `PUT /productos/:id` (solo administrador). Hoy "Editar" solo cambia el objeto en memoria.
- [ ] Conectar el submit del modal de editar en `inventarioAdministrador.js` a ese endpoint.
- [ ] Mostrar el código real en lugar del id (hoy hace `codigo_barras ?? id_producto`).
- [ ] Manejar código duplicado (error 1062) con mensaje claro.

### Módulo de usuarios
- [ ] `usuarioRoutes.js` y `usuarioController.js` (hoy vacíos): listar, crear, editar y activar/desactivar, todo solo administrador.
- [ ] Crear usuario con `bcrypt.hash(password, 10)`, guardar sus roles en `usuario_rol` y validar mail único.
- [ ] Editar con `PUT /usuarios/:id` (hoy el front manda `PUT /usuarios` identificando por `emailOriginal`). Si viene contraseña, hashearla.
- [ ] Login: rechazar usuarios con `activo = 0` (la columna ya está en el `.sql`).
- [ ] Impedir que el admin se desactive o se quite el rol a sí mismo.
- [ ] `usuariosAdministrador.js`: cargar la tabla desde la API, hacer que crear, editar y cambiar estado usen la API (hoy solo tocan el DOM) y mostrar el error si el servidor falla (hoy solo `console.error`).
- [ ] Decidir qué hace "Eliminar" en el menú (hoy no hace nada). Recomendado: quitarlo y usar solo desactivar.
- [ ] La tarjeta "Usuarios" del dashboard admin llama a `GET /usuarios`, que no existe (muestra "—").

### Pendiente de definir con el grupo
- [ ] Gastos: `gastos.id_compra` es `NOT NULL UNIQUE`, o sea que un gasto solo nace de una compra. Hay que elegir entre hacer un módulo de compras (las tablas `compra` y `detalle_compra` existen sin rutas) o permitir gastos sin compra (`id_compra` nullable).
- [ ] Reposiciones: ¿el repositor ve solo las suyas o todas? (hoy ven todas).
- [ ] Tablas `pedido` y `detalle_pedido`: sin rutas ni pantallas. Definir si se usan o se sacan.

## 2. Seguridad (mejorar)

- [ ] **Fuga de costos:** vendedor y repositor reciben `precio_compra` en `/productos`, y el vendedor también en `/detalle-ventas`. Filtrar columnas según el rol.
- [ ] **XSS almacenado:** nombres y descripciones se meten con `innerHTML` sin escapar en inventario, historial, ventas, productos, reposiciones, alertas, ganancias, registrar venta y otras. Solo los dashboards escapan. Crear una función `escaparHTML` compartida en `js/componentes/` y usarla en todos lados. Esto pesa más porque el token está en `localStorage`.
- [ ] **Usuarios desactivados:** el JWT sigue válido hasta 8 h. Chequear `activo` en `verificarSesion` o acortar la duración del token.
- [ ] **Login:** agregar límite de intentos y sacar el `console.log` del mail.
- [ ] **Contraseñas:** el login del front rechaza `<>'"`. Alinear con las reglas del alta de usuarios (hoy un usuario podría crearse con una contraseña con la que no puede entrar).
- [ ] **CORS:** `cors()` está abierto y el front se sirve desde el mismo servidor. Restringirlo o quitarlo.
- [ ] `backend/.env` venía dentro del zip. No compartirlo ni subirlo.

## 3. Backend (mejorar)

- [ ] `config/db.js`: `harset` es un typo, debe ser `charset`.
- [ ] Ventas: usar `SELECT ... FOR UPDATE` al chequear stock, o `UPDATE ... WHERE stock >= ?`, para evitar stock negativo con ventas simultáneas.
- [ ] Ventas: validar cantidades enteras y unificar productos repetidos en una misma venta.
- [ ] Reposiciones: validar que el producto exista (hoy da 500 genérico por la FK).
- [ ] Login: devuelve solo el primer rol en `rol`. Definir qué hacer cuando un usuario tiene varios roles (por ejemplo, selector).
- [ ] `server.js`: sacar `configurarSesion` y el `require` de `middleware/session.js` (vacío) y borrar ese archivo. Arreglar el texto del log del puerto.
- [ ] Borrar `backend/migrar-passwords.js` (ya no hace falta).
- [ ] Productos: `GET /productos` no filtra por `estado_producto`. Definir si los dados de baja se listan.

## 4. Base de datos (mejorar)

- [ ] Sacar los datos de prueba de la base oficial (productos 47, 48 y 49: `teclado`, `vbmxvbm`, `nuevo producto`, con precios 0 o 2). Revisar también las ventas de prueba.
- [ ] Probar el import de `stockflow_alt.sql` en XAMPP (MariaDB 10.11): `DEFAULT ENCRYPTION='N'` en el `CREATE DATABASE` puede fallar.
- [ ] `precio_compra` y `precio_venta` son `decimal(20,0)` (sin centavos). Decidir si hacen falta decimales.
- [ ] Ganancias: el costo se toma del `precio_compra` actual del producto. Guardar el costo unitario en `detalle_venta` para que editar un precio no cambie la rentabilidad histórica.
- [ ] Tras cualquier cambio de esquema, reexportar `stockflow.sql` y `stockflow_alt.sql` y avisar al grupo.

## 5. Frontend e idioma (mejorar)

- [ ] Selector de idioma del login: no traduce nada (`login.html` no tiene `data-i18n`). Agregar etiquetas o quitar el selector.
- [ ] `ajustesVendedor` y `ajustesRepositor` cargan `idioma.js` sin tener `data-i18n`.
- [ ] Páginas sin `idioma.js` ni etiquetas: alertasStock, historial, productos (vendedor y repositor), registrar venta, reposiciones, dashboardRepositor.
- [ ] Terminar las traducciones de `idioma.js` y sincronizar la copia del proyecto con la del repo (la del repo tiene 3 claves más).
- [ ] Saludo: `dashboardAdministrador.js` pisa el saludo con nombre de `sesion.js` (queda sin nombre). Además `actualizarSaludo` está dentro de un closure y `idioma.js` no lo encuentra. Unificar en un solo lugar.
- [ ] Usuarios: los emails se truncan a 4 caracteres en la tabla (`truncarTexto(email, 4)`). Subir el límite.
- [ ] Mensajes de error con `alert()` en inventario: reemplazar por un aviso visual de la app.

## 6. Documentación

- [ ] `DOCS/README.md`: sacar las contraseñas en texto plano de los usuarios de prueba.
- [ ] `DOCS/README.md`: agregar versión nueva (JWT, bcrypt, `sesion.js`, roles por token, idioma, login sin mail simulado).
- [ ] `DOCS/README.md`: documentar el `.env` (incluido `JWT_SECRET`) y `npm install` en `backend/`.
- [ ] `DOCS/README.md`: listar las rutas de la API y qué rol accede a cada una.

## Orden sugerido

1. Filtrado por usuario y rol en el backend (historial y fuga de costos).
2. Módulo de usuarios completo, con `activo` en el login.
3. Código de barras y `PUT /productos/:id`.
4. Escapar HTML y arreglar `charset`.
5. Idioma, README y limpieza de datos de prueba.
