async function cargarProductos() {
    const tabla = document.querySelector("#tablaProductos tbody");

    try {
        const respuesta = await fetch("http://localhost:3000/productos");

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar los productos.");
        }

        const productos = await respuesta.json();

        tabla.innerHTML = "";

        productos.forEach(producto => {
            const stock = Number(producto.stock);
            const stockMinimo = Number(producto.stock_minimo);

            let estado;
            let textoEstado;
            let claseEstado;

            if (stock === 0) {
                estado = "sinstock";
                textoEstado = "Sin stock";
                claseEstado = "alerta";
            } else if (stock <= stockMinimo) {
                estado = "bajo";
                textoEstado = "Stock bajo";
                claseEstado = "atencion";
            } else {
                estado = "disponible";
                textoEstado = "Disponible";
                claseEstado = "ingreso";
            }

            const fila = document.createElement("tr");

            fila.setAttribute("data-estado", estado);

            fila.innerHTML = `
                <td>${producto.nombre}</td>
                <td>${producto.categoria}</td>
                <td>$${Number(producto.precio_venta).toLocaleString("es-UY")}</td>
                <td>${producto.stock}</td>
                <td class="${claseEstado}">${textoEstado}</td>
            `;

            tabla.appendChild(fila);
        });

        inicializarFiltrosProductos();

    } catch (error) {
        console.error("Error al cargar productos:", error);

        tabla.innerHTML = `
            <tr>
                <td colspan="5">
                    No se pudieron cargar los productos.
                </td>
            </tr>
        `;
    }
}


function inicializarFiltrosProductos() {
    const input = document.getElementById("buscadorProductos");
    const botones = document.querySelectorAll(".btn-filtro");

    let filtroActivo = "todos";

    function aplicarFiltros() {
        const texto = input.value.trim().toLowerCase();
        const filas = document.querySelectorAll("#tablaProductos tbody tr");

        let hayResultados = false;

        filas.forEach(fila => {
            const nombre =
                fila.querySelector("td")?.textContent.toLowerCase() || "";

            const estado = fila.getAttribute("data-estado");

            const coincideTexto = nombre.includes(texto);

            const coincideEstado =
                filtroActivo === "todos" ||
                estado === filtroActivo;

            if (coincideTexto && coincideEstado) {
                fila.classList.remove("oculto");
                hayResultados = true;
            } else {
                fila.classList.add("oculto");
            }
        });

        mostrarMensajeVacio(!hayResultados);
    }


    function mostrarMensajeVacio(mostrar) {
        let mensaje = document.querySelector(".sin-resultados");

        if (mostrar && !mensaje) {
            mensaje = document.createElement("p");
            mensaje.className = "sin-resultados";
            mensaje.textContent = "No se encontraron productos.";

            document
                .getElementById("tablaProductos")
                .insertAdjacentElement("afterend", mensaje);

        } else if (!mostrar && mensaje) {
            mensaje.remove();
        }
    }


    input.addEventListener("input", aplicarFiltros);


    botones.forEach(btn => {
        btn.addEventListener("click", () => {

            botones.forEach(b =>
                b.classList.remove("activo")
            );

            btn.classList.add("activo");

            filtroActivo =
                btn.getAttribute("data-filtro");

            aplicarFiltros();
        });
    });
}


document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
});