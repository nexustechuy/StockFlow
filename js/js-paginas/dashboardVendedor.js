// Dashboard del vendedor: conecta las tarjetas y las tablas con la base de datos.
// Usa rutas que ya existen: GET /ventas, GET /detalle-ventas y GET /productos.
// El token lo agrega sesion.js a cada fetch, así que acá no hace falta tocarlo.

(function () {
  "use strict";

  const CANTIDAD_HISTORIAL = 4;   // filas en "Historial de ventas"
  const CANTIDAD_MAS_VENDIDOS = 4; // filas en "Productos más vendidos"

  // Nombres de los campos tal como salen de la base (DOCS/stockflow.sql).
  // Si algún controller los devuelve con otro alias, se agrega acá y listo.
  const CAMPOS = {
    venta: {
      id: ["id_venta"],
      usuario: ["id_usuario"],
      fecha: ["fecha_hora", "fecha"],
      cliente: ["nombre_cliente", "cliente"],
      total: ["total"]
    },
    detalle: {
      id_venta: ["id_venta"],
      id_producto: ["id_producto"],
      nombre: ["nombre_producto", "producto", "nombre"],
      cantidad: ["cantidad"],
      subtotal: ["subtotal"]
    },
    producto: {
      id: ["id_producto"],
      nombre: ["nombre"],
      stock: ["stock"],
      estado: ["estado_producto"]
    }
  };

  // ---------- Utilidades ----------

  function leer(obj, nombres) {
    for (const n of nombres) {
      if (obj && obj[n] !== undefined && obj[n] !== null) return obj[n];
    }
    return null;
  }

  // Acepta un array directo o un objeto que contenga un array
  function aLista(json) {
    if (Array.isArray(json)) return json;
    if (json && typeof json === "object") {
      const lista = Object.values(json).find(Array.isArray);
      if (lista) return lista;
    }
    return [];
  }

  async function pedir(ruta) {
    const respuesta = await fetch(ruta);
    if (!respuesta.ok) throw new Error(ruta + " respondió " + respuesta.status);
    return aLista(await respuesta.json());
  }

  function usuarioActual() {
    try {
      return JSON.parse(localStorage.getItem("sf_usuario"));
    } catch (e) {
      return null;
    }
  }

  // Idioma (el mismo que guarda idioma.js en localStorage)
  function idiomaActual() {
    return localStorage.getItem("idioma") === "en" ? "en" : "es";
  }

  function t(clave) {
    if (idiomaActual() === "en" && typeof traducciones !== "undefined") {
      return traducciones[clave] || clave;
    }
    return clave;
  }

  function locale() {
    return idiomaActual() === "en" ? "en-US" : "es-AR";
  }

  // "2026-10-22 16:36:56" o ISO → Date local. Un "YYYY-MM-DD" solo se toma como fecha local
  function aFecha(valor) {
    if (!valor) return null;
    if (valor instanceof Date) return valor;
    const texto = String(valor).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
      const [a, m, d] = texto.split("-").map(Number);
      return new Date(a, m - 1, d);
    }
    const fecha = new Date(texto.replace(" ", "T"));
    return isNaN(fecha) ? null : fecha;
  }

  function esHoy(fecha) {
    const hoy = new Date();
    return !!fecha &&
      fecha.getFullYear() === hoy.getFullYear() &&
      fecha.getMonth() === hoy.getMonth() &&
      fecha.getDate() === hoy.getDate();
  }

  function formatearFecha(fecha) {
    return fecha ? fecha.toLocaleDateString(locale(), { day: "2-digit", month: "2-digit", year: "numeric" }) : "—";
  }

  function formatearHora(fecha, original) {
    // Si la fecha vino sin hora (solo día) no inventamos una
    if (!fecha || /^\d{4}-\d{2}-\d{2}$/.test(String(original).trim())) return "—";
    return fecha.toLocaleTimeString(locale(), { hour: "2-digit", minute: "2-digit", hour12: false });
  }

  function formatearPesos(numero) {
    return "$" + Number(numero).toLocaleString(locale(), { maximumFractionDigits: 2 });
  }

  // ---------- Pintar en pantalla ----------

  function poner(id, texto) {
    const el = document.getElementById(id);
    if (el) el.textContent = texto;
  }

  function celda(texto, clase) {
    const td = document.createElement("td");
    td.textContent = texto;
    if (clase) td.className = clase;
    return td;
  }

  function filaMensaje(tbody, columnas, clave) {
    tbody.replaceChildren();
    const tr = document.createElement("tr");
    const td = celda(t(clave));
    td.colSpan = columnas;
    td.style.textAlign = "center";
    td.style.opacity = "0.7";
    td.dataset.i18n = clave;
    tr.appendChild(td);
    tbody.appendChild(tr);
  }

  // ---------- Cálculos ----------

  function nombreProducto(detalle, nombresPorId) {
    const directo = leer(detalle, CAMPOS.detalle.nombre);
    if (directo) return String(directo);
    const id = leer(detalle, CAMPOS.detalle.id_producto);
    return nombresPorId.get(String(id)) || (id !== null ? "#" + id : "—");
  }

  function pintarTarjetas(misVentas, misDetalles, hayDetalles) {
    const ventasHoy = misVentas.filter(v => esHoy(aFecha(leer(v, CAMPOS.venta.fecha))));

    poner("valor-ventas-hoy", String(ventasHoy.length));

    const ingresos = ventasHoy.reduce((suma, v) => suma + Number(leer(v, CAMPOS.venta.total) || 0), 0);
    poner("valor-ingresos-hoy", formatearPesos(ingresos));

    if (hayDetalles) {
      const idsHoy = new Set(ventasHoy.map(v => String(leer(v, CAMPOS.venta.id))));
      const lineas = misDetalles.filter(d => idsHoy.has(String(leer(d, CAMPOS.detalle.id_venta))));
      poner("valor-ordenes-hoy", String(lineas.length));
    } else {
      poner("valor-ordenes-hoy", "—");
    }
  }

  function pintarSinStock(productos) {
    // Los productos dados de baja (estado_producto = 0) no cuentan
    const activos = productos.filter(p => Number(leer(p, CAMPOS.producto.estado) ?? 1) !== 0);
    const sinStock = activos.filter(p => Number(leer(p, CAMPOS.producto.stock) ?? 0) <= 0);
    poner("valor-sin-stock", String(sinStock.length));
  }

  function pintarHistorial(misVentas, misDetalles, hayDetalles, nombresPorId) {
    const tbody = document.getElementById("tbody-historial");
    if (!tbody) return;

    if (misVentas.length === 0) {
      filaMensaje(tbody, 6, "No hay ventas registradas");
      return;
    }

    const porVenta = new Map();
    misDetalles.forEach(d => {
      const id = String(leer(d, CAMPOS.detalle.id_venta));
      if (!porVenta.has(id)) porVenta.set(id, []);
      porVenta.get(id).push(d);
    });

    const recientes = misVentas
      .map(v => ({ v, fecha: aFecha(leer(v, CAMPOS.venta.fecha)) }))
      .sort((a, b) => (b.fecha ? b.fecha.getTime() : 0) - (a.fecha ? a.fecha.getTime() : 0))
      .slice(0, CANTIDAD_HISTORIAL);

    tbody.replaceChildren();
    recientes.forEach(({ v, fecha }) => {
      const lineas = porVenta.get(String(leer(v, CAMPOS.venta.id))) || [];
      const productos = hayDetalles && lineas.length
        ? lineas.map(d => nombreProducto(d, nombresPorId)).join(", ")
        : "—";
      const cantidades = hayDetalles && lineas.length
        ? lineas.map(d => "x" + Number(leer(d, CAMPOS.detalle.cantidad) || 0)).join(", ")
        : "—";

      let total = leer(v, CAMPOS.venta.total);
      if (total === null) {
        total = lineas.reduce((s, d) => s + Number(leer(d, CAMPOS.detalle.subtotal) || 0), 0);
      }

      const original = leer(v, CAMPOS.venta.fecha);
      const tr = document.createElement("tr");
      tr.append(
        celda(formatearFecha(fecha)),
        celda(formatearHora(fecha, original)),
        celda(leer(v, CAMPOS.venta.cliente) || "—"),
        celda(productos),
        celda(cantidades),
        celda(formatearPesos(total), "ingreso")
      );
      tbody.appendChild(tr);
    });
  }

  function pintarMasVendidos(misDetalles, nombresPorId) {
    const tbody = document.getElementById("tbody-mas-vendidos");
    if (!tbody) return;

    const acumulado = new Map();
    misDetalles.forEach(d => {
      const clave = String(leer(d, CAMPOS.detalle.id_producto) ?? nombreProducto(d, nombresPorId));
      const actual = acumulado.get(clave) || { nombre: nombreProducto(d, nombresPorId), cantidad: 0 };
      actual.cantidad += Number(leer(d, CAMPOS.detalle.cantidad) || 0);
      acumulado.set(clave, actual);
    });

    const top = [...acumulado.values()]
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, CANTIDAD_MAS_VENDIDOS);

    if (top.length === 0) {
      filaMensaje(tbody, 2, "No hay productos vendidos");
      return;
    }

    tbody.replaceChildren();
    top.forEach(item => {
      const tr = document.createElement("tr");
      tr.append(celda(item.nombre), celda(String(item.cantidad)));
      tbody.appendChild(tr);
    });
  }

  // ---------- Carga ----------

  async function cargarDashboard() {
    const [rVentas, rDetalles, rProductos] = await Promise.allSettled([
      pedir("/ventas"),
      pedir("/detalle-ventas"),
      pedir("/productos")
    ]);

    [rVentas, rDetalles, rProductos].forEach(r => {
      if (r.status === "rejected") console.error("Dashboard vendedor:", r.reason);
    });

    const hayVentas = rVentas.status === "fulfilled";
    const hayDetalles = rDetalles.status === "fulfilled";
    const hayProductos = rProductos.status === "fulfilled";

    const productos = hayProductos ? rProductos.value : [];

    // Cada vendedor ve solo lo suyo. Cuando el backend filtre por el token
    // (tarea pendiente del historial) este filtro queda de más pero no molesta.
    const usuario = usuarioActual();
    const idUsuario = usuario ? usuario.id_usuario : null;
    const todasLasVentas = hayVentas ? rVentas.value : [];
    const hayCampoUsuario = todasLasVentas.some(v => leer(v, CAMPOS.venta.usuario) !== null);
    const misVentas = (idUsuario !== null && hayCampoUsuario)
      ? todasLasVentas.filter(v => String(leer(v, CAMPOS.venta.usuario)) === String(idUsuario))
      : todasLasVentas;

    const idsMisVentas = new Set(misVentas.map(v => String(leer(v, CAMPOS.venta.id))));
    const misDetalles = hayDetalles
      ? rDetalles.value.filter(d => idsMisVentas.has(String(leer(d, CAMPOS.detalle.id_venta))))
      : [];

    const nombresPorId = new Map(
      productos.map(p => [String(leer(p, CAMPOS.producto.id)), leer(p, CAMPOS.producto.nombre)])
    );

    if (hayVentas) {
      pintarTarjetas(misVentas, misDetalles, hayDetalles);
      pintarHistorial(misVentas, misDetalles, hayDetalles, nombresPorId);
    } else {
      ["valor-ventas-hoy", "valor-ingresos-hoy", "valor-ordenes-hoy"].forEach(id => poner(id, "—"));
      filaMensaje(document.getElementById("tbody-historial"), 6, "No se pudieron cargar los datos");
    }

    if (hayVentas && hayDetalles) {
      pintarMasVendidos(misDetalles, nombresPorId);
    } else {
      filaMensaje(document.getElementById("tbody-mas-vendidos"), 2, "No se pudieron cargar los datos");
    }

    if (hayProductos) {
      pintarSinStock(productos);
    } else {
      poner("valor-sin-stock", "—");
    }
  }

  // Traduce el rótulo suelto "Vendedor" del menú lateral (es texto sin etiqueta propia,
  // al lado del nombre del usuario, así que no se le puede poner data-i18n sin romper el estilo)
  function traducirRolEnMenu() {
    const caja = document.querySelector(".sidebar-usuario");
    if (!caja) return;
    const texto = [...caja.childNodes].find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
    if (texto) texto.textContent = texto.textContent.replace(/Vendedor/, t("Vendedor"));
  }

  document.addEventListener("DOMContentLoaded", () => {
    traducirRolEnMenu();
    cargarDashboard();
  });
})();
