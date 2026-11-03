document.addEventListener('DOMContentLoaded', function () {

  const DURACION = 600;
  const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ultimoEscrito = new WeakMap();
  const valorActual = new WeakMap();
  const animacionActual = new WeakMap();

  function leerNumero(texto) {
    const partes = texto.trim().match(/^(\D*?)(\d[\d.,]*)(\D*)$/);
    if (!partes) return null;

    const cifras = partes[2];
    const final = cifras.match(/[.,](\d{1,2})$/);
    const separadorDecimal = final ? cifras.charAt(cifras.length - final[1].length - 1) : '';

    let separadorMiles = cifras.includes(',') ? ',' : '.';
    if (separadorDecimal === ',') separadorMiles = '.';
    if (separadorDecimal === '.') separadorMiles = ',';

    let numeroTexto = cifras.split(separadorMiles).join('');
    if (separadorDecimal === ',') numeroTexto = numeroTexto.replace(',', '.');

    const negativo = partes[1].includes('-');

    return {
      texto: texto,
      antes: partes[1].replace('-', ''),
      despues: partes[3],
      numero: negativo ? -parseFloat(numeroTexto) : parseFloat(numeroTexto),
      decimales: final ? final[1].length : 0,
      separadorDecimal: separadorDecimal,
      separadorMiles: separadorMiles
    };
  }

  function formatear(valor, destino) {
    const signo = valor < 0 ? '-' : '';
    const partes = Math.abs(valor).toFixed(destino.decimales).split('.');
    const entero = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, destino.separadorMiles);
    const decimales = partes[1] ? destino.separadorDecimal + partes[1] : '';
    return signo + destino.antes + entero + decimales + destino.despues;
  }

  function escribir(elemento, texto) {
    ultimoEscrito.set(elemento, texto);
    elemento.textContent = texto;
  }

  function animar(elemento, desde, destino) {
    const inicio = performance.now();
    const id = {};
    animacionActual.set(elemento, id);

    function paso(ahora) {
      if (animacionActual.get(elemento) !== id) return;

      const avance = Math.min((ahora - inicio) / DURACION, 1);
      const suave = 1 - Math.pow(1 - avance, 3);

      if (avance < 1) {
        escribir(elemento, formatear(desde + (destino.numero - desde) * suave, destino));
        requestAnimationFrame(paso);
      } else {
        escribir(elemento, destino.texto);
      }
    }

    requestAnimationFrame(paso);
  }

  function cambio(elemento) {
    const texto = elemento.textContent;
    if (texto === ultimoEscrito.get(elemento)) return;

    const destino = leerNumero(texto);
    if (!destino || isNaN(destino.numero)) {
      animacionActual.delete(elemento);
      return;
    }

    const desde = valorActual.get(elemento) || 0;
    valorActual.set(elemento, destino.numero);

    if (sinMovimiento || desde === destino.numero) {
      animacionActual.delete(elemento);
      return;
    }

    animar(elemento, desde, destino);
  }

  document.querySelectorAll('.tarjeta .valor').forEach(function (elemento) {
    const inicial = leerNumero(elemento.textContent);
    if (inicial && !isNaN(inicial.numero)) valorActual.set(elemento, inicial.numero);

    new MutationObserver(function () {
      cambio(elemento);
    }).observe(elemento, { childList: true, characterData: true, subtree: true });
  });
});
