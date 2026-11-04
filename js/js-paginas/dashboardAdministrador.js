
document.addEventListener('DOMContentLoaded', function () {

    const cuerpoHistorial = document.getElementById('cuerpoHistorialVentas');

    // Traducir un texto usando el diccionario de idioma.js (la clave es el texto en español)
    function t(clave, valores) {
        const idioma = localStorage.getItem('idioma') || 'es';
        let texto = clave;

        if (idioma === 'en' && typeof traducciones !== 'undefined') {
            texto = traducciones[clave] || clave;
        }

        Object.keys(valores || {}).forEach(k => {
            texto = texto.replace('{' + k + '}', valores[k]);
        });

        return texto;
    }

    // Formatear moneda
    function formatearMoneda(valor) {
        return '$' + Number(valor).toLocaleString('es-UY');
    }

    // Evitar que un texto cargado por el usuario rompa el HTML
    function escaparHTML(texto) {
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    }

    // Pedir datos al servidor y devolver el JSON
    function pedirJSON(url) {
        return fetch(url).then(res => {
            if (!res.ok) throw new Error('Error al pedir ' + url);
            return res.json();
        });
    }

    // Escribir un valor en una card
    function escribir(id, texto) {
        const elemento = document.getElementById(id);
        if (elemento) elemento.textContent = texto;
    }

    // Obtener nombre del cliente
    function nombreCliente(venta) {
        return escaparHTML(venta.nombre_cliente || (
            localStorage.getItem('idioma') === 'en'
                ? 'No customer'
                : 'Sin cliente'
        ));
    }

    // Generar fila de una venta
    function renderizarFila(venta, detalleVentas) {
        const fecha = new Date(venta.fecha_hora);

        const horaTexto = fecha.toLocaleTimeString('es-UY', {
            hour: '2-digit',
            minute: '2-digit'
        });

        const cantidadTotal = detalleVentas
            .filter(d => Number(d.id_venta) === Number(venta.id_venta))
            .reduce((acc, d) => acc + Number(d.cantidad), 0);

        return `
            <tr>
                <td>${horaTexto}</td>
                <td>${nombreCliente(venta)}</td>
                <td>${cantidadTotal}</td>
                <td class="ingreso">${formatearMoneda(venta.total)}</td>
            </tr>
        `;
    }

    // Las ventas se piden una sola vez y las usan la tabla y la card
    const pedidoVentas = pedirJSON('/ventas');

    // Cargar historial de ventas
    function cargarHistorialVentas() {
        if (!cuerpoHistorial) return;

        Promise.all([
            pedidoVentas,
            pedirJSON('/detalle-ventas')
        ])
            .then(([ventas, detalleVentas]) => {

                const ultimasVentas = ventas.slice(0, 4);
                const idioma = localStorage.getItem('idioma') || 'es';

                cuerpoHistorial.innerHTML = ultimasVentas.length
                    ? ultimasVentas.map(v => renderizarFila(v, detalleVentas)).join('')
                    : `<tr><td colspan="4">${
                        idioma === 'en'
                            ? 'No sales have been registered yet.'
                            : 'Todavía no hay ventas registradas.'
                    }</td></tr>`;
            })
            .catch(error => {
                console.error('Error al cargar el historial de ventas:', error);

                const idioma = localStorage.getItem('idioma') || 'es';

                cuerpoHistorial.innerHTML = `
                    <tr>
                        <td colspan="4">
                            ${idioma === 'en'
                                ? 'Error loading sales.'
                                : 'Error al cargar las ventas.'}
                        </td>
                    </tr>
                `;
            });
    }

    // Card: Ventas del Día (suma de los totales de las ventas de hoy)
    function cargarVentasDelDia() {
        pedidoVentas
            .then(ventas => {
                const hoy = new Date().toDateString();

                const total = ventas
                    .filter(v => new Date(v.fecha_hora).toDateString() === hoy)
                    .reduce((acc, v) => acc + Number(v.total), 0);

                escribir('valorVentasDia', formatearMoneda(total));
            })
            .catch(error => {
                console.error('Error al cargar las ventas del día:', error);
                escribir('valorVentasDia', '—');
            });
    }

    // Card: Productos y Sin Stock (los productos dados de baja no se cuentan)
    function cargarProductos() {
        Promise.all([
            pedirJSON('/productos'),
            pedirJSON('/categorias').catch(() => null)
        ])
            .then(([productos, categorias]) => {
                const activos = productos.filter(p =>
                    p.estado_producto === undefined || Number(p.estado_producto) !== 0
                );

                const sinStock = activos.filter(p => Number(p.stock) <= 0).length;

                escribir('valorProductos', activos.length);
                escribir('valorSinStock', sinStock);
                escribir('unidadSinStock', t(sinStock === 1 ? 'producto' : 'productos'));

                if (categorias) {
                    escribir('unidadProductos', t(
                        categorias.length === 1
                            ? 'En {n} categoría'
                            : 'En {n} categorías distintas',
                        { n: categorias.length }
                    ));
                }
            })
            .catch(error => {
                console.error('Error al cargar los productos:', error);
                escribir('valorProductos', '—');
                escribir('valorSinStock', '—');
            });
    }

    // Card: Usuarios (vendedores y repositores activos)
    function cargarUsuarios() {
        pedirJSON('/usuarios')
            .then(usuarios => {
                const cantidad = usuarios.filter(u => {
                    // Si el backend informa "activo", los inactivos no se cuentan
                    if (u.activo !== undefined && Number(u.activo) === 0) return false;

                    // Se cuentan solo vendedores y repositores (rol puede venir en "rol" o "roles")
                    const roles = JSON.stringify([u.rol, u.roles]).toLowerCase();
                    return roles.includes('vendedor') || roles.includes('repositor');
                }).length;

                escribir('valorUsuarios', cantidad);
            })
            .catch(error => {
                console.error('Error al cargar los usuarios:', error);
                escribir('valorUsuarios', '—');
            });
    }

    // Ejecutar funciones
    cargarHistorialVentas();
    cargarVentasDelDia();
    cargarProductos();
    cargarUsuarios();

});
