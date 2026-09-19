# StockFlow documentación oficial

# v0.1.0 [Es]
Esta versión del sistema incluye la pantalla de dashboard de los 3 principales usuarios. El login tiene una funcionalidad completa.

# v0.1.1 [Es]
Se corrigieron errores y disonancias visuales, además se cambió el JS de las navbars de las diferentes pantallas de los principales usuarios.

Actualmente la contraseña y correos de los usuarios son:
usuario: Administrdor       correo: administrador@gmail.com         contraseña:administrador
usuario: Repositor          correo: repositor@gmail.com             contraseña:repositor
usuario: Vendedor           correo: vendedor@gmail.com              contraseña:vendedor

Se desarrollaron el resto de las pantallas del sistema: Primero las del Vendedor y el Administrador, que se trabajaron simultáneamente, y por último las del Repositor.

Vendedor: Se creó la pantalla independiente de Historial, con tarjetas de resumen, búsqueda, filtros por período y la tabla de ventas. El detalle de una venta ahora se abre como modal desde esa pantalla, en vez de ser una página independiente, lo que nos ayudó mucho a optimizar código y tiempo en el desarrollo. También se crearon las pantallas de Registrar venta y Productos.

Administrador: Se creó la pantalla de Ganancias, con filtro de período (hoy, esta semana, este mes, este año), métricas de Total vendido, Costo total, Rentabilidad y Ventas realizadas, un gráfico de barras de ganancia por categoría y una tabla de productos más vendidos. Todo se recalcula al cambiar el filtro. Se conectó el link "Ganancias" del sidebar y del menú móvil en todas las pantallas de Administrador. También se crearon las pantallas de Ventas, Inventario con 3 pestañas (Productos, Categorías y Alertas de Stock) y Usuarios.

Repositor: Se creó la pantalla independiente de Reposiciones con un formulario para registrar nuevas reposiciones (buscador de productos, cantidad y comentario) y una tabla con el historial de reposiciones. Se creó la pantalla independiente de Productos con buscador en tiempo real, filtros por estado (disponible, stock bajo, sin stock) que se combinan con el buscador, estado con colores semánticos y un botón "Reponer" por fila que lleva a la pantalla de Reposiciones con el producto precargado. Además, se creó la pantalla de Alertas de Stock.

La pantalla de Ajustes queda para la última entrega, junto con otros detalles.

# v0.1.2 [Es]
Se conectó el sistema con la base de datos, excepto las métricas de los 3 dashboards y los dashboards de Vendedor y Repositor por completo, ya que iban a quedar muy vacíos para el video de demostración para el cliente (la tabla de ventas del dashboard de Administrador sí se conectó para el video). Ahora la información ya no esta hardcodeada ni usa datos simulados mock, sino que se guarda desde la BD. Al registrar una reposición o una venta, se guarda y el stock se actualiza automáticamente.

El login valida el correo y la contraseña con los usuarios ingresados en la base de datos y redirige a la pantalla que le corresponde a cada rol. También se corrigieron errores menores y detalles visuales que aparecieron al conectar todo con la BD.