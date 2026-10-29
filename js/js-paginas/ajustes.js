
document.addEventListener('DOMContentLoaded', function () {

    const botonesTema = document.querySelectorAll('[data-tema]');

    let temaGuardado = localStorage.getItem('tema') || 'claro';

    // Marca el tema seleccionado
    function marcarTemaActivo(tema) {
        botonesTema.forEach(function (boton) {
            boton.classList.toggle(
                'activo',
                boton.getAttribute('data-tema') === tema
            );
        });
    }

    // Aplica el tema seleccionado
    function aplicarTema(tema) {
        if (tema === 'oscuro') {
            document.body.classList.add('tema-oscuro');
        } else {
            document.body.classList.remove('tema-oscuro');
        }

        marcarTemaActivo(tema);
    }

    aplicarTema(temaGuardado);

    // Cambiar entre tema claro y oscuro
    botonesTema.forEach(function (boton) {
        boton.addEventListener('click', function () {
            const tema = this.getAttribute('data-tema');

            localStorage.setItem('tema', tema);
            aplicarTema(tema);
        });
    });

});
