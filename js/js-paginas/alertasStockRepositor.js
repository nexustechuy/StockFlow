document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.btn-reponer').forEach(function (boton) {
    boton.addEventListener('click', function () {
      window.location.href = 'reposicionesRepositor.html';
    });
  });
});
