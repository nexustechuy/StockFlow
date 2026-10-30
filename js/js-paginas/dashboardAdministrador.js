
document.addEventListener('DOMContentLoaded', function () {

    const cuerpoHistorial = document.getElementById('cuerpoHistorialVentas');

    // Actualizar saludo según la hora y el idioma seleccionado
    function actualizarSaludo() {
        const elementoSaludo = document.querySelector('[data-saludo]');

        if (!elementoSaludo) return;

        const hora = new Date().getHours();
        const idioma = localStorage.getItem('idioma') || 'es';

        if (idioma === 'en') {
            if (hora >= 5 && hora < 12) {
                elementoSaludo.textContent = 'Good morning!';
            } else if (hora >= 12 && hora < 19) {
                elementoSaludo.textContent = 'Good afternoon!';
            } else {
                elementoSaludo.textContent = 'Good evening!';
            }
        } else {
            if (hora >= 5 && hora < 12) {
                elementoSaludo.textContent = '¡Buenos días!';
            } else if (hora >= 12 && hora < 19) {
                elementoSaludo.textContent = '¡Buenas tardes!';
            } else {
                elementoSaludo.textContent = '¡Buenas noches!';
            }
        }
    }

    // Formatear moneda
    function formatearMoneda(valor) {
        return '$' + Number(valor).toLocaleString('es-UY');
    }

    // Obtener nombre del cliente
    function nombreCliente(venta) {
        return venta.nombre_cliente || (
            localStorage.getItem('idioma') === 'en'
                ? 'No customer'
                : 'Sin cliente'
        );
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

    // Cargar historial de ventas
    function cargarHistorialVentas() {
        if (!cuerpoHistorial) return;

        Promise.all([
            fetch('/ventas').then(res => {
                if (!res.ok) throw new Error('Error al obtener ventas');
                return res.json();
            }),

            fetch('/detalle-ventas').then(res => {
                if (!res.ok) throw new Error('Error al obtener detalles');
                return res.json();
            })
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

    // Ejecutar funciones
    actualizarSaludo();
    cargarHistorialVentas();

});
