document.addEventListener("DOMContentLoaded", () => {

    // ===== PESTAÑAS (Productos / Categorías / Alertas de stock) =====
    const botonesPestana = document.querySelectorAll(".pestana");
    const panelesPestana = document.querySelectorAll(".panel-pestana");

    botonesPestana.forEach(boton => {
        boton.addEventListener("click", () => {
            botonesPestana.forEach(b => b.classList.remove("activa"));
            boton.classList.add("activa");

            const destino = boton.dataset.pestana;

            panelesPestana.forEach(panel => {
                if (panel.dataset.panel === destino) {
                    panel.classList.remove("oculto");
                } else {
                    panel.classList.add("oculto");
                }
            });
        });
    });

    // ===== PRODUCTOS =====
    const tabla = document.getElementById("cuerpoTablaProductos");
    const inputBuscar = document.getElementById("buscarProducto");
    const chipsFiltro = document.querySelectorAll(".filtro-chip");
    const selectCategoria = document.getElementById("categoriaProducto");
    const formNuevoProducto = document.getElementById("formNuevoProducto");
    const btnGuardarProducto = document.getElementById("btnGuardarProducto");
    const modalNuevoProductoEl = document.getElementById("modalNuevoProducto");
    const modalNuevoProducto = new bootstrap.Modal(modalNuevoProductoEl);
    const modalDetalleProductoEl = document.getElementById("modalDetalleProducto");

    let productos = [];
    let variantes = [];
    let categoriasCargadas = [];
    let filtroActual = "todos";
    let textoBusqueda = "";
    let textoBusquedaCategoria = "";

    // Calcula el estado (activo / sin-stock / crítico) según stock y stock mínimo
    function calcularEstado(producto) {
        const stock = Number(producto.stock);
        const minimo = Number(producto.stock_minimo);

        if (stock === 0) {
            return { estado: "Sin stock", clase: "sin-stock", claseSpan: "alerta" };
        } else if (stock <= minimo) {
            return { estado: "Stock crítico", clase: "critico", claseSpan: "atencion" };
        } else {
            return { estado: "Activo", clase: "activo", claseSpan: "ingreso" };
        }
    }

    function obtenerVariante(idProducto) {
        return variantes.find(v => Number(v.id_producto) === Number(idProducto));
    }

    function renderizarFila(producto) {
        const { estado, clase, claseSpan } = calcularEstado(producto);
        const variante = obtenerVariante(producto.id_producto);

        return `
            <tr data-estado="${clase}"
                data-id="${producto.id_producto}"
                data-descripcion="${producto.descripcion ?? ""}"
                data-precio-compra="${producto.precio_compra}"
                data-tipo-variante="${variante ? variante.tipo : ""}"
                data-valor-variante="${variante ? variante.valor : ""}">
                <td>${producto.nombre}</td>
                <td>${producto.id_producto}</td>
                <td>${producto.categoria}</td>
                <td>$${Number(producto.precio_venta).toLocaleString("es-UY")}</td>
                <td>${producto.stock}</td>
                <td>${producto.stock_minimo}</td>
                <td><span class="${claseSpan}">${estado}</span></td>
                <td>
                    <div class="dropdown">
                        <button class="btn-accion" data-bs-toggle="dropdown" data-bs-auto-close="outside"
                            aria-expanded="false">•••</button>
                        <div class="dropdown-menu dropdown-menu-end popup-menu">
                            <div class="vista-acciones">
                                <div class="popup-header">${producto.nombre}</div>
                                <a class="dropdown-item ver-detalle-producto" href="#" data-bs-toggle="modal"
                                    data-bs-target="#modalDetalleProducto"><i class="bi bi-eye me-2"></i>Ver detalle</a>
                                <a class="dropdown-item disabled" href="#" aria-disabled="true" tabindex="-1"
                                    title="Disponible próximamente"><i class="bi bi-pencil me-2"></i>Editar producto</a>
                                <a class="dropdown-item text-peligro btn-pedir-confirmacion" href="#"><i
                                        class="bi bi-trash me-2"></i>Eliminar producto</a>
                            </div>
                            <div class="vista-confirmacion oculto popup-confirmacion">
                                <div class="popup-header">Eliminar producto</div>
                                <p>¿Eliminar el producto ${producto.nombre}? Esta acción no se puede deshacer.</p>
                                <div class="acciones-confirmacion">
                                    <button type="button" class="btn-cancelar-eliminar"
                                        data-bs-dismiss="dropdown">Cancelar</button>
                                    <button type="button" class="btn-confirmar-eliminar-producto">Eliminar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        `;
    }

    // Combina el filtro de chip activo con el texto de búsqueda y vuelve a pintar la tabla
    function aplicarFiltros() {
        let lista = productos;

        if (filtroActual !== "todos") {
            lista = lista.filter(p => calcularEstado(p).clase === filtroActual);
        }

        if (textoBusqueda.trim() !== "") {
            const texto = textoBusqueda.toLowerCase();
            lista = lista.filter(p => p.nombre.toLowerCase().includes(texto));
        }

        tabla.innerHTML = lista.length
            ? lista.map(renderizarFila).join("")
            : `<tr><td colspan="8">No se encontraron productos.</td></tr>`;

        renderizarCategorias();
        renderizarAlertas();
    }

    // ===== CATEGORÍAS (desde la base de datos) =====
    function renderizarCategorias() {
        const contenedor = document.getElementById("listaCategorias");
        if (!contenedor) return;

        const lista = categoriasCargadas.filter(cat =>
            cat.nombre.toLowerCase().includes(textoBusquedaCategoria.toLowerCase())
        );

        contenedor.innerHTML = lista.length
            ? lista.map(cat => {
                const cantidad = productos.filter(
                    p => Number(p.id_categoria) === Number(cat.id_categoria)
                ).length;
                const etiqueta = cantidad === 1 ? "producto" : "productos";

                return `
                    <div class="categoria-item" data-id="${cat.id_categoria}" data-categoria="${cat.nombre}">
                        <div class="categoria-info">
                            <div class="nombre">${cat.nombre}</div>
                            <div class="cantidad">${cantidad} ${etiqueta}</div>
                        </div>
                        <div class="dropdown">
                            <button type="button" class="btn-eliminar-categoria" data-bs-toggle="dropdown"
                                aria-expanded="false">
                                <i class="bi bi-trash"></i>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end popup-menu popup-confirmacion">
                                <li class="popup-header">Eliminar categoría</li>
                                <li>
                                    <p>¿Eliminar "${cat.nombre}"? Esta acción no se puede deshacer.</p>
                                </li>
                                <li class="acciones-confirmacion">
                                    <button type="button" class="btn-cancelar-eliminar"
                                        data-bs-dismiss="dropdown">Cancelar</button>
                                    <button type="button" class="btn-confirmar-eliminar-categoria">Eliminar</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                `;
            }).join("")
            : `<p>No se encontraron categorías.</p>`;
    }

    // ===== ALERTAS DE STOCK (desde la base de datos) =====
    function renderizarAlertas() {
        const cuerpo = document.getElementById("cuerpoTablaAlertas");
        if (!cuerpo) return;

        const sinStock = productos.filter(p => Number(p.stock) === 0);
        const criticos = productos.filter(
            p => Number(p.stock) > 0 && Number(p.stock) <= Number(p.stock_minimo)
        );
        const paraAlerta = [...sinStock, ...criticos];

        cuerpo.innerHTML = paraAlerta.length
            ? paraAlerta.map(p => {
                const esSinStock = Number(p.stock) === 0;
                const claseSpan = esSinStock ? "alerta" : "atencion";
                const textoEstado = esSinStock ? "Sin stock" : "Stock crítico";

                return `
                    <tr>
                        <td>${p.nombre}</td>
                        <td>${p.categoria}</td>
                        <td>${p.stock}</td>
                        <td>${p.stock_minimo}</td>
                        <td><span class="${claseSpan}">${textoEstado}</span></td>
                    </tr>
                `;
            }).join("")
            : `<tr><td colspan="5">No hay alertas de stock por el momento.</td></tr>`;

        const tarjetas = document.querySelectorAll(".tarjetas-alertas .tarjeta .valor");
        if (tarjetas.length === 3) {
            tarjetas[0].textContent = sinStock.length;
            tarjetas[1].textContent = criticos.length;
            tarjetas[2].textContent = paraAlerta.length;
        }

        const textoBanner = document.querySelector(".alerta-texto");
        if (textoBanner) {
            textoBanner.textContent =
                `Tenés ${sinStock.length} producto${sinStock.length === 1 ? "" : "s"} sin stock y ${criticos.length} con stock crítico`;
        }
    }

    function cargarProductos() {
        fetch("http://localhost:3000/productos")
            .then(res => res.json())
            .then(data => {
                productos = data;
                aplicarFiltros();
            })
            .catch(error => {
                console.error("Error al cargar productos:", error);
                tabla.innerHTML = `
                    <tr>
                        <td colspan="8">Error al cargar los productos.</td>
                    </tr>
                `;
            });
    }

    function cargarCategorias() {
        fetch("http://localhost:3000/categorias")
            .then(res => res.json())
            .then(categorias => {
                categoriasCargadas = categorias;

                categorias.forEach(cat => {
                    const option = document.createElement("option");
                    option.value = cat.id_categoria;
                    option.textContent = cat.nombre;
                    selectCategoria.appendChild(option);
                });

                renderizarCategorias();
            })
            .catch(error => console.error("Error al cargar categorías:", error));
    }

    function cargarVariantes() {
        return fetch("http://localhost:3000/variantes")
            .then(res => res.json())
            .then(data => { variantes = data; })
            .catch(error => console.error("Error al cargar variantes:", error));
    }

    // Filtros: Todos / Activos / Sin stock / Stock crítico
    chipsFiltro.forEach(chip => {
        chip.addEventListener("click", () => {
            chipsFiltro.forEach(c => c.classList.remove("activo"));
            chip.classList.add("activo");
            filtroActual = chip.dataset.filtro;
            aplicarFiltros();
        });
    });

    // Búsqueda por nombre
    inputBuscar.addEventListener("input", (e) => {
        textoBusqueda = e.target.value;
        aplicarFiltros();
    });

    // Búsqueda de categorías
    const inputBuscarCategoria = document.getElementById("buscarCategoria");
    inputBuscarCategoria?.addEventListener("input", (e) => {
        textoBusquedaCategoria = e.target.value;
        renderizarCategorias();
    });

    // Eliminar categoría (delegado, porque la lista se genera dinámicamente)
    const listaCategorias = document.getElementById("listaCategorias");
    listaCategorias?.addEventListener("click", (e) => {
        const boton = e.target.closest(".btn-confirmar-eliminar-categoria");
        if (!boton) return;

        const item = boton.closest(".categoria-item");
        const id = item.dataset.id;

        fetch(`http://localhost:3000/categorias/${id}`, { method: "DELETE" })
            .then(async res => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Error al eliminar la categoría.");
                return data;
            })
            .then(() => {
                categoriasCargadas = categoriasCargadas.filter(c => String(c.id_categoria) !== String(id));
                renderizarCategorias();

                // También la sacamos del <select> del modal de nuevo producto
                const opcion = selectCategoria.querySelector(`option[value="${id}"]`);
                opcion?.remove();
            })
            .catch(error => {
                console.error("Error al eliminar categoría:", error);
                alert(error.message);
            });
    });

    // Ver en inventario (desde la pestaña de Alertas) -> lleva a la pestaña de Productos
    document.getElementById("linkVerEnInventario")?.addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelector('.pestana[data-pestana="productos"]')?.click();
    });

    // ===== NUEVA CATEGORÍA =====
    const btnNuevaCategoria = document.getElementById("btnNuevaCategoria");
    const panelNuevaCategoria = document.getElementById("panelNuevaCategoria");
    const layoutCategorias = document.getElementById("layoutCategorias");
    const formNuevaCategoria = document.getElementById("formNuevaCategoria");

    btnNuevaCategoria?.addEventListener("click", () => {
        panelNuevaCategoria.classList.toggle("oculto");
        layoutCategorias.classList.toggle("sin-panel");
    });

    formNuevaCategoria?.addEventListener("submit", (e) => {
        e.preventDefault();

        const nombre = document.getElementById("nombreCategoria").value.trim();
        const descripcion = document.getElementById("descripcionCategoria").value.trim();

        if (!nombre) return;

        fetch("http://localhost:3000/categorias", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, descripcion })
        })
            .then(async res => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Error al crear la categoría.");
                return data;
            })
            .then(categoriaCreada => {
                categoriasCargadas.push(categoriaCreada);
                renderizarCategorias();

                // También la agregamos al <select> del modal de nuevo producto
                const option = document.createElement("option");
                option.value = categoriaCreada.id_categoria;
                option.textContent = categoriaCreada.nombre;
                selectCategoria.appendChild(option);

                formNuevaCategoria.reset();
                panelNuevaCategoria.classList.add("oculto");
                layoutCategorias.classList.add("sin-panel");
            })
            .catch(error => {
                console.error("Error al crear categoría:", error);
                alert(error.message);
            });
    });

    // ===== VER DETALLE =====
    modalDetalleProductoEl.addEventListener("show.bs.modal", (evento) => {
        const boton = evento.relatedTarget;
        const fila = boton ? boton.closest("tr") : null;
        if (!fila) return;

        const id = fila.dataset.id;
        const producto = productos.find(p => String(p.id_producto) === String(id));
        if (!producto) return;

        const { estado } = calcularEstado(producto);

        document.getElementById("detalleProductoNombre").textContent = producto.nombre;
        document.getElementById("detalleProductoCodigo").textContent = producto.id_producto;
        document.getElementById("detalleProductoCategoria").textContent = producto.categoria;
        document.getElementById("detalleProductoPrecio").textContent =
            `$${Number(producto.precio_venta).toLocaleString("es-UY")}`;
        document.getElementById("detalleProductoStockActual").textContent = producto.stock;
        document.getElementById("detalleProductoStockMinimo").textContent = producto.stock_minimo;
        document.getElementById("detalleProductoEstado").textContent = estado;
    });

    // ===== ELIMINAR (confirmación de dos pasos dentro del menú) =====
    tabla.addEventListener("click", (e) => {

        const pedirConfirmacion = e.target.closest(".btn-pedir-confirmacion");
        if (pedirConfirmacion) {
            e.preventDefault();
            const menu = pedirConfirmacion.closest(".popup-menu");
            menu.querySelector(".vista-acciones").classList.add("oculto");
            menu.querySelector(".vista-confirmacion").classList.remove("oculto");
            return;
        }

        const confirmarEliminar = e.target.closest(".btn-confirmar-eliminar-producto");
        if (confirmarEliminar) {
            const fila = confirmarEliminar.closest("tr");
            const id = fila.dataset.id;

            fetch(`http://localhost:3000/productos/${id}`, { method: "DELETE" })
                .then(async res => {
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.error || "Error al eliminar el producto.");
                    return data;
                })
                .then(() => {
                    productos = productos.filter(p => String(p.id_producto) !== String(id));
                    aplicarFiltros();
                })
                .catch(error => {
                    console.error("Error al eliminar producto:", error);
                    alert(error.message);
                });
            return;
        }
    });

    // Al cerrarse el menú desplegable, dejarlo listo para la próxima vez que se abra
    tabla.addEventListener("hidden.bs.dropdown", (e) => {
        const menu = e.target.querySelector(".popup-menu");
        if (!menu) return;
        menu.querySelector(".vista-acciones")?.classList.remove("oculto");
        menu.querySelector(".vista-confirmacion")?.classList.add("oculto");
    });

    // ===== NUEVO PRODUCTO (guarda también la variante, si se completó) =====
    function mostrarErrorCampo(campo, mensaje) {
        campo.classList.add("campo-invalido");
        campo.querySelector(".error-campo").textContent = mensaje;
    }

    function limpiarErrorCampo(campo) {
        campo.classList.remove("campo-invalido");
        campo.querySelector(".error-campo").textContent = "";
    }

    const camposNuevoProducto = [
        "nombreProducto",
        "codigoBarras",
        "categoriaProducto",
        "descripcionProducto",
        "stockInicial",
        "stockMinimo",
        "precioCompra",
        "precioVenta"
    ].map(id => document.getElementById(id));

    camposNuevoProducto.forEach(input => {
        input.addEventListener("input", () => limpiarErrorCampo(input.closest(".campo-formulario")));
    });

    modalNuevoProductoEl.addEventListener("hidden.bs.modal", () => {
        camposNuevoProducto.forEach(input => limpiarErrorCampo(input.closest(".campo-formulario")));
    });

    btnGuardarProducto.addEventListener("click", () => {

        let hayError = false;

        camposNuevoProducto.forEach(input => {
            const campo = input.closest(".campo-formulario");
            const valor = input.value.trim();

            if (valor === "") {
                mostrarErrorCampo(campo, "Este campo es obligatorio.");
                hayError = true;
            } else if (input.type === "number" && Number(valor) < 0) {
                mostrarErrorCampo(campo, "Ingresá un valor válido.");
                hayError = true;
            } else {
                limpiarErrorCampo(campo);
            }
        });

        if (hayError) return;

        const tipoVariante = document.getElementById("tipoVariante").value;
        const valorVariante = document.getElementById("valorVariante").value.trim();

        const nuevoProducto = {
            nombre: document.getElementById("nombreProducto").value.trim(),
            descripcion: document.getElementById("descripcionProducto").value.trim(),
            precio_compra: Number(document.getElementById("precioCompra").value),
            precio_venta: Number(document.getElementById("precioVenta").value),
            stock: Number(document.getElementById("stockInicial").value),
            stock_minimo: Number(document.getElementById("stockMinimo").value),
            id_categoria: Number(document.getElementById("categoriaProducto").value)
        };

        // Nota: "codigoBarras" no se envía porque la tabla producto no tiene esa columna.

        fetch("http://localhost:3000/productos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoProducto)
        })
            .then(async res => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Error al guardar el producto.");
                return data;
            })
            .then(productoGuardado => {

                // Si se completó tipo y valor de variante, la guardamos vinculada al producto nuevo
                if (tipoVariante && valorVariante) {
                    return fetch("http://localhost:3000/variantes", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            tipo: tipoVariante,
                            valor: valorVariante,
                            id_producto: productoGuardado.id_producto
                        })
                    })
                        .then(res => res.json())
                        .then(varianteGuardada => {
                            variantes.push(varianteGuardada);
                            return productoGuardado;
                        })
                        .catch(error => {
                            console.error("El producto se guardó, pero la variante no pudo guardarse:", error);
                            return productoGuardado;
                        });
                }

                return productoGuardado;
            })
            .then(productoGuardado => {
                productos.push(productoGuardado);
                aplicarFiltros();
                formNuevoProducto.reset();
                modalNuevoProducto.hide();
            })
            .catch(error => {
                console.error("Error al guardar producto:", error);
                alert(error.message);
            });
    });

    cargarProductos();
    cargarCategorias();
    cargarVariantes();

});