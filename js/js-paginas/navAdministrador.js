function crearNavbarMovil() {

  /*Esta constante detecta automaticamente el lugar donde se esta actualmente*/
  const paginaActual = window.location.pathname.split('/').pop() || 'dashboardAdministrador.html';

  /*Cuando tengamos las demas paginas se cambia el href por 
  el nombre de la pagina */ 
  const html = `
    <div class="navbar-movil">
      <span class="brand">StockFlow</span>
      <button onclick="abrirMenu()"><i class="bi bi-list"></i></button>
    </div>

    <div class="menu-movil" id="menuMovil">
      <button class="cerrar-menu" onclick="cerrarMenu()"><i class="bi bi-x"></i></button>
      <a href="dashboardAdministrador.html" onclick="cerrarMenu()">Dashboard</a>
      <a href="#" onclick="cerrarMenu()">Usuarios</a>
      <a href="#" onclick="cerrarMenu()">Categorias</a>
      <a href="#" onclick="cerrarMenu()">Productos</a>
      <a href="#" onclick="cerrarMenu()">Ajustes</a>
      <a href="login.html" style="margin-top:auto; color:rgba(255,255,255,0.60);" onclick="cerrarMenu()">Cerrar sesión</a>
    </div>
    `;

  document.body.insertAdjacentHTML('afterbegin', html);

  // Marca como "activo" el link que coincide con la página actual
  const links = document.querySelectorAll('.menu-movil a');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === paginaActual) {
      link.classList.add('activo');
    }
  });
}

function abrirMenu() {
    document.getElementById('menuMovil').classList.add('abierto');
}
 
function cerrarMenu() {
    document.getElementById('menuMovil').classList.remove('abierto');
}

document.addEventListener('DOMContentLoaded', crearNavbarMovil);
