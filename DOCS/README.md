# StockFlow: pendiente y mejoras

(Actualizado después de usuarios, filtrado por usuario y rol, y `PUT /productos/:id`.)

## 1. Lo que falta

### Módulo de usuarios (pendiente)
- [ ] Probar las pantallas en el navegador (el backend está probado contra MariaDB 10.11, el front solo se revisó el código).
- [ ] Bases ya importadas: correr `ALTER TABLE usuarios ADD UNIQUE KEY mail (mail);` (los `.sql` del repo ya lo traen). Avisar al grupo.
- [ ] Los usuarios 1, 2 y 3 (vendedor, repositor, administrador) tienen `nombre` NULL: cargarles nombre desde "Editar usuario".
- [ ] Decidir mayúsculas en el mail: el login compara con `BINARY` (distingue mayúsculas) pero `UNIQUE(mail)` no. Recomendado: guardar y buscar siempre en minúscula.
- [ ] Recuperar contraseña: hoy solo el administrador puede cambiarla desde "Editar usuario". Definir si hace falta algo más.

### Código de barras (pendiente)
- [ ] Cargar el código a los productos que ya existen (hoy tienen `codigo` NULL y la tabla dice "Sin código"). Se hace desde "Editar producto", que ahora exige el código.
- [ ] Usar el código en las demás pantallas: registrar venta, reposiciones, productos (vendedor y repositor) y el inventario buscan solo por nombre. Falta buscar o escanear por código, que es para lo que sirve.
- [ ] Definir si el código tiene que ser de largo fijo (por ejemplo EAN-13). Hoy acepta solo números, de 1 a 50 dígitos.

### Pendiente de definir con el grupo
- [ ] Gastos: `gastos.id_compra` es `NOT NULL UNIQUE`, o sea que un gasto solo nace de una compra. Hay que elegir entre hacer un módulo de compras (las tablas `compra` y `detalle_compra` existen sin rutas) o permitir gastos sin compra (`id_compra` nullable).
- [ ] Reposiciones: ¿el repositor ve solo las suyas o todas? (hoy ven todas). Si es "solo las suyas", aplicar el mismo filtro por token que ya tienen las ventas.
- [ ] Tablas `pedido` y `detalle_pedido`: sin rutas ni pantallas. Definir si se usan o se sacan.

## 2. Seguridad (mejorar)

- [ ] **XSS almacenado:** nombres y descripciones se meten con `innerHTML` sin escapar en inventario, historial, ventas, productos, reposiciones, alertas, ganancias, registrar venta y otras. Solo los dashboards y la pantalla de usuarios escapan. Crear una función `escaparHTML` compartida en `js/componentes/` y usarla en todos lados. Esto pesa más porque el token está en `localStorage`.
- [ ] **Login:** agregar límite de intentos y sacar el `console.log` del mail.
- [ ] **Contraseñas:** el alta y la edición de usuarios exigen 6 a 16 caracteres y sin `<>'"`, igual que el login. Si se cambia una regla, cambiarla en `usuarioController.js`, en `usuariosAdministrador.js` y en `script-login.js`.
- [ ] **CORS:** `cors()` está abierto y el front se sirve desde el mismo servidor. Restringirlo o quitarlo.
- [ ] `backend/.env` venía dentro del zip. No compartirlo ni subirlo.

## 3. Backend (mejorar)

- [ ] `config/db.js`: `harset` es un typo, debe ser `charset`.
- [ ] `verificarSesion` ahora consulta la base en cada pedido (para el estado y los roles). Está bien para este tamaño; si algún día pesa, cachear unos segundos.
- [ ] Ventas: usar `SELECT ... FOR UPDATE` al chequear stock, o `UPDATE ... WHERE stock >= ?`, para evitar stock negativo con ventas simultáneas.
- [ ] Ventas: validar cantidades enteras y unificar productos repetidos en una misma venta.
- [ ] Reposiciones: validar que el producto exista (hoy da 500 genérico por la FK).
- [ ] Login: devuelve solo el primer rol en `rol`. Definir qué hacer cuando un usuario tiene varios roles (por ejemplo, selector).
- [ ] `server.js`: sacar `configurarSesion` y el `require` de `middleware/session.js` (vacío) y borrar ese archivo. Arreglar el texto del log del puerto.
- [ ] Borrar `backend/migrar-passwords.js` (ya no hace falta).
- [ ] Productos: `precio_compra` y `precio_venta` aceptan decimales en el formulario (`step=0.01`) pero la base los redondea (`decimal(20,0)`). Resolver junto con la decisión de la sección 4.
- [ ] Productos: `GET /productos` no filtra por `estado_producto`. Definir si los dados de baja se listan.

## 4. Base de datos (mejorar)

- [ ] Sacar los datos de prueba de la base oficial (productos 47, 48 y 49: `teclado`, `vbmxvbm`, `nuevo producto`, con precios 0 o 2). Revisar también las ventas de prueba.
- [ ] `precio_compra` y `precio_venta` son `decimal(20,0)` (sin centavos). Decidir si hacen falta decimales.
- [ ] Ganancias: el costo se toma del `precio_compra` actual del producto. Guardar el costo unitario en `detalle_venta` para que editar un precio no cambie la rentabilidad histórica.
- [ ] Tras cualquier cambio de esquema, reexportar `stockflow.sql` y `stockflow_alt.sql` y avisar al grupo.

## 5. Frontend e idioma (mejorar)

- [ ] Selector de idioma del login: no traduce nada (`login.html` no tiene `data-i18n`). Agregar etiquetas o quitar el selector.
- [ ] `ajustesVendedor` y `ajustesRepositor` cargan `idioma.js` sin tener `data-i18n`.
- [ ] Páginas sin `idioma.js` ni etiquetas: alertasStock, historial, productos (vendedor y repositor), registrar venta, reposiciones, dashboardRepositor. La pantalla de usuarios carga `idioma.js` pero no tiene etiquetas.
- [ ] Terminar las traducciones de `idioma.js` y sincronizar la copia del proyecto con la del repo (la del repo tiene 3 claves más).
- [ ] Saludo: `dashboardAdministrador.js` pisa el saludo con nombre de `sesion.js` (queda sin nombre). Además `actualizarSaludo` está dentro de un closure y `idioma.js` no lo encuentra. Unificar en un solo lugar.
- [ ] `dashboardVendedor.js` filtra las ventas por el usuario del token en el front. Ya es redundante (el backend filtra) y se puede quitar.
- [ ] Mensajes de error con `alert()` en inventario: reemplazar por un aviso visual de la app (la pantalla de usuarios ya usa avisos propios).

## 6. Documentación

- [ ] `DOCS/README.md`: sacar las contraseñas en texto plano de los usuarios de prueba.
- [ ] `DOCS/README.md`: agregar versión nueva (JWT, bcrypt, `sesion.js`, roles por token, módulo de usuarios, idioma, login sin mail simulado).
- [ ] `DOCS/README.md`: documentar el `.env` (incluido `JWT_SECRET`) y `npm install` en `backend/`.
- [ ] `DOCS/README.md`: listar las rutas de la API y qué rol accede a cada una.

## Orden de implementacion

1. Módulo de usuarios: probar en el navegador y cargar nombres (parcialmente hecho).
2. Cargar los códigos de barras y usarlos en vender y reponer.
3. Escapar HTML y arreglar `charset`.
4. Idioma, README y limpieza de datos de prueba.
