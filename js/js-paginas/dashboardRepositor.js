// Dashboard del repositor: datos reales desde la API.
// Usa GET /productos y GET /reposiciones (el token lo agrega sesion.js al fetch).

const LIMITE_BAJO_STOCK = 8;     // filas máximas en la tabla de bajo stock
const LIMITE_REPOSICIONES = 8;   // filas máximas en el historial

// Evita inyectar HTML desde datos de la base
function esc(valor) {
  return String(valor ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

// La API puede devolver un array directo o un objeto con el array adentro
function comoLista(data) {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const lista = Object.values(data).find(Array.isArray);
    if (lista) return lista;
  }
  return [];
}

async function pedirLista(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} respondió ${res.status}`);
  return comoLista(await res.json());
}

function formatearFecha(valor) {
  if (!valor) return "-";
  const f = new Date(valor);
  if (isNaN(f)) return "-";
  const dd = String(f.getDate()).padStart(2, "0");
  const mm = String(f.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${f.getFullYear()}`;
}

const num = v => Number(v) || 0;

function filaVacia(texto) {
  return `<tr><td colspan="4" class="text-center text-muted">${esc(texto)}</td></tr>`;
}

function pintarMetricas(productos) {
  // Solo productos activos (estado_producto = 0 se considera dado de baja)
  const activos = productos.filter(p => p.estado_producto === undefined || p.estado_producto === null || num(p.estado_producto) !== 0);

  const sinStock = activos.filter(p => num(p.stock) <= 0);
  const criticos = activos.filter(p => num(p.stock) > 0 && num(p.stock) <= num(p.stock_minimo));
  const aReponer = sinStock.length + criticos.length;

  document.getElementById("cantSinStock").textContent = sinStock.length;
  document.getElementById("cantCritico").textContent = criticos.length;
  document.getElementById("cantReponer").textContent = aReponer;

  const alerta = document.getElementById("alertaStock");
  const texto = document.getElementById("alertaTexto");
  if (aReponer === 0) {
    alerta.style.display = "none";
  } else {
    alerta.style.display = "";
    const pl = (n, s, p) => `${n} ${n === 1 ? s : p}`;
    texto.textContent =
      `Tienes ${pl(criticos.length, "producto con bajo stock", "productos con bajo stock")} ` +
      `y ${pl(sinStock.length, "sin stock", "sin stock")}`;
  }

  // Tabla: los más urgentes primero (menor stock)
  const bajos = [...sinStock, ...criticos]
    .sort((a, b) => num(a.stock) - num(b.stock))
    .slice(0, LIMITE_BAJO_STOCK);

  const tbody = document.getElementById("tbodyBajoStock");
  tbody.innerHTML = bajos.length
    ? bajos.map(p => `
        <tr>
          <td>${esc(p.nombre)}</td>
          <td>${esc(p.categoria ?? p.nombre_categoria ?? "-")}</td>
          <td>${num(p.stock_minimo)}</td>
          <td>${num(p.stock)}</td>
        </tr>`).join("")
    : filaVacia("Todos los productos tienen stock suficiente");
}

function pintarReposiciones(reposiciones, productos) {
  const nombrePorId = new Map(productos.map(p => [p.id_producto, p.nombre]));

  const ultimas = [...reposiciones]
    .sort((a, b) => new Date(b.fecha_hora ?? b.fecha) - new Date(a.fecha_hora ?? a.fecha))
    .slice(0, LIMITE_REPOSICIONES);

  const tbody = document.getElementById("tbodyReposiciones");
  tbody.innerHTML = ultimas.length
    ? ultimas.map(r => {
        const nombre = r.nombre_producto ?? r.producto ?? nombrePorId.get(r.id_producto) ?? `Producto #${r.id_producto}`;
        return `
        <tr>
          <td>${esc(nombre)}</td>
          <td>${num(r.cantidad)}</td>
          <td>${formatearFecha(r.fecha_hora ?? r.fecha)}</td>
          <td>${esc(r.comentario || "-")}</td>
        </tr>`;
      }).join("")
    : filaVacia("Todavía no hay reposiciones registradas");
}

async function cargarDashboard() {
  const [resProductos, resReposiciones] = await Promise.allSettled([
    pedirLista("/productos"),
    pedirLista("/reposiciones")
  ]);

  const productos = resProductos.status === "fulfilled" ? resProductos.value : [];

  if (resProductos.status === "fulfilled") {
    pintarMetricas(productos);
  } else {
    console.error("Error al cargar productos:", resProductos.reason);
    document.getElementById("alertaTexto").textContent = "No se pudieron cargar los productos";
    document.getElementById("tbodyBajoStock").innerHTML = filaVacia("Error al cargar los datos");
  }

  if (resReposiciones.status === "fulfilled") {
    pintarReposiciones(resReposiciones.value, productos);
  } else {
    console.error("Error al cargar reposiciones:", resReposiciones.reason);
    document.getElementById("tbodyReposiciones").innerHTML = filaVacia("Error al cargar los datos");
  }
}

document.addEventListener("DOMContentLoaded", cargarDashboard);
