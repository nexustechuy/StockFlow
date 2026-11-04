
async function iniciarSesion(event) {
    event.preventDefault();

    const correoIngresado = document.getElementById("correo").value.trim();
    const contrasenaIngresado = document.getElementById("contrasena").value.trim();
    const mensajeError = document.getElementById("error");

    mensajeError.style.display = "none";
    mensajeError.textContent = "";

    try {
        if (correoIngresado === "" || contrasenaIngresado === "") {
            throw new Error("Por favor completá todos los campos");
        }

        if (correoIngresado.length > 50) {
            throw new Error("El correo no puede superar los 50 caracteres.");
        }

        if (contrasenaIngresado.length > 16) {
            throw new Error("La contraseña no puede superar los 16 caracteres.");
        }

        const formatoMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formatoMail.test(correoIngresado)) {
            throw new Error("El correo ingresado no tiene un formato válido.");
        }

        const caracteresInvalidos = /[<>'"]/;

        if (caracteresInvalidos.test(contrasenaIngresado)) {
            throw new Error("La contraseña contiene caracteres no permitidos.");
        }

        const respuesta = await fetch('/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                mail: correoIngresado,
                password: contrasenaIngresado
            })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.error);
        }

        // Con más de un rol, primero elige con cuál entrar
        if (datos.roles.length > 1) {
            mostrarElegirRol(datos);
            return;
        }

        entrarConRol(datos, datos.token, datos.rol);

    } catch (error) {
        mensajeError.textContent = error.message;
        mensajeError.style.display = "block";
    }
}

const DASHBOARD_POR_ROL = {
    administrador: "/dashboardAdministrador.html",
    vendedor: "/dashboardVendedor.html",
    repositor: "/dashboardRepositor.html"
};

const NOMBRE_ROL = {
    administrador: "Administrador",
    vendedor: "Vendedor",
    repositor: "Repositor"
};

// Guarda la sesión con el rol elegido y va a su dashboard
function entrarConRol(datos, token, rol) {
    if (!DASHBOARD_POR_ROL[rol]) {
        throw new Error("El usuario no tiene un rol válido.");
    }

    localStorage.setItem("sf_token", token);
    localStorage.setItem("sf_usuario", JSON.stringify({
        id_usuario: datos.id_usuario,
        mail: datos.mail,
        nombre: datos.nombre,
        rol: rol,
        roles: datos.roles
    }));

    window.location.href = DASHBOARD_POR_ROL[rol];
}

let datosLogin = null;

function moverIndicadorRol(lista) {
    const indicador = lista.querySelector(".indicador-rol");
    const elegido = lista.querySelector(".rol-item.seleccionado");

    if (!indicador || !elegido) return;

    indicador.style.top = elegido.offsetTop + "px";
    indicador.style.height = elegido.offsetHeight + "px";

    if (!indicador.classList.contains("visible")) {
        setTimeout(function () {
            indicador.classList.add("visible");
        }, 20);
    }
}

function mostrarElegirRol(datos) {
    datosLogin = datos;

    const lista = document.getElementById("listaElegirRol");
    const errorRol = document.getElementById("errorElegirRol");

    lista.innerHTML = "";
    errorRol.style.display = "none";

    datos.roles.forEach(function (rol) {
        if (!NOMBRE_ROL[rol]) return;

        const item = document.createElement("label");
        item.className = "rol-item";

        const opcion = document.createElement("input");
        opcion.type = "radio";
        opcion.name = "rolElegido";
        opcion.value = rol;

        const texto = document.createElement("span");
        texto.textContent = NOMBRE_ROL[rol];

        opcion.addEventListener("change", function () {
            lista.querySelectorAll(".rol-item").forEach(function (otro) {
                otro.classList.remove("seleccionado");
            });
            item.classList.add("seleccionado");
            errorRol.style.display = "none";
            moverIndicadorRol(lista);
        });

        item.appendChild(opcion);
        item.appendChild(texto);
        lista.appendChild(item);
    });

    const indicador = document.createElement("span");
    indicador.className = "indicador-rol";
    lista.appendChild(indicador);

    bootstrap.Modal.getOrCreateInstance(document.getElementById("modalElegirRol")).show();
}

function confirmarRol() {
    const errorRol = document.getElementById("errorElegirRol");
    const elegido = document.querySelector('input[name="rolElegido"]:checked');

    function mostrarError(texto) {
        errorRol.textContent = texto;
        errorRol.style.display = "block";
    }

    if (!elegido) {
        mostrarError("Elegí un rol para continuar.");
        return;
    }

    // El backend revisa que el rol sea del usuario y devuelve el token de ese rol
    fetch("/cambiar-rol", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + datosLogin.token
        },
        body: JSON.stringify({ rol: elegido.value })
    })
        .then(function (respuesta) {
            return respuesta.json().then(function (datos) {
                if (!respuesta.ok) {
                    throw new Error(datos.error);
                }
                entrarConRol(datosLogin, datos.token, datos.rol);
            });
        })
        .catch(function (error) {
            mostrarError(error.message);
        });
}

document.addEventListener("DOMContentLoaded", function () {
    const formLogin = document.getElementById("form-login");
    const contrasena = document.getElementById("contrasena");
    const botonMostrar = document.getElementById("mostrarContrasena");

    if (formLogin) {
        formLogin.addEventListener("submit", iniciarSesion);
    }

    const btnConfirmarRol = document.getElementById("btnConfirmarRol");

    if (btnConfirmarRol) {
        btnConfirmarRol.addEventListener("click", confirmarRol);
    }

    if (contrasena && botonMostrar) {
        botonMostrar.addEventListener("click", function () {
            const icono = botonMostrar.querySelector("i");

            if (contrasena.type === "password") {
                contrasena.type = "text";
                icono.classList.remove("bi-eye");
                icono.classList.add("bi-eye-slash");
                botonMostrar.setAttribute("aria-label", "Ocultar contraseña");
                botonMostrar.setAttribute("title", "Ocultar contraseña");
            } else {
                contrasena.type = "password";
                icono.classList.remove("bi-eye-slash");
                icono.classList.add("bi-eye");
                botonMostrar.setAttribute("aria-label", "Mostrar contraseña");
                botonMostrar.setAttribute("title", "Mostrar contraseña");
            }
        });
    }

    // Idioma
    const textoIdioma = document.getElementById("idiomaLoginTexto");
    const opcionesIdioma = document.querySelectorAll(".idioma-login [data-idioma]");

    if (textoIdioma) {
        const idiomaGuardado = localStorage.getItem("idioma") || "es";

        opcionesIdioma.forEach(function (opcion) {
            if (opcion.dataset.idioma === idiomaGuardado) {
                textoIdioma.textContent = opcion.textContent;
            }

            opcion.addEventListener("click", function () {
                textoIdioma.textContent = opcion.textContent;
            });
        });
    }
});
