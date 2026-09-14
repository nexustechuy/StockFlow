# StockFlow documentación oficial

[Es]
StockFlow es un sistema de gestión de inventarios basado en la web, diseñado para agilizar el control de existencias en tiendas minoristas. Permite a los usuarios del negocio supervisar el inventario, gestionar la reposición de productos, monitorear los niveles de stock en tiempo real y mejorar la eficiencia operativa mediante una plataforma centralizada e intuitiva, ahorrando tiempo y costos.

# v0.1.0 [Es]
Esta versión de el sistema incluye la pantalla de dashboard de los 3 principales usuarios. La página de login tiene una funcionalidad completa.

# v0.1.1 [Es]
Se corrigieron errores y disonancias visuales, además se cambió el JS de las navbars de las diferentes pantallas de los principales usuarios.

Actualmente la contraseña y correos de los usuarios son:
usuario: Administrdor       correo: administrador@gmail.com         contraseña:administrador
usuario: Repositor          correo: repositor@gmail.com             contraseña:repositor
usuario: Vendedor           correo: vendedor@gmail.com              contraseña:vendedor

Se creó la pantalla independiente de Historial (Vendedor), con tarjetas de resumen, búsqueda, filtros por período y la tabla de ventas. El detalle de una venta ahora se abre como modal desde esa pantalla, en vez de ser una página aparte.

Se creó la pantalla independiente de Reposiciones (Repositor) con un formulario para registrar nuevas reposiciones (buscador de productos con sugerencias, cantidad y comentario) y una tabla con el historial de reposiciones realizadas.

Se creó la pantalla independiente de Productos (Repositor) con buscador en tiempo real, filtros por estado (Disponible/Stock bajo/Sin stock) que se combinan con el buscador, estado en color y un botón "Reponer" por fila que lleva a la pantalla de Reposiciones.

# v0.1.2 [Es]
Se creó la pantalla de Ganancias (Administrador), con filtro de período (Hoy/Esta semana/Este mes/Este año), tarjetas de Total vendido, Costo total, Rentabilidad y Ventas realizadas, un gráfico de barras de ganancia por categoría y una tabla de productos más vendidos. Todo se recalcula dinámicamente al cambiar el filtro. Se conectó el link "Ganancias" del sidebar y del menú móvil en todas las pantallas de Administrador, que hasta ahora era un placeholder.