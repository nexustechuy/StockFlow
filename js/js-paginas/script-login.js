async function iniciarSesion(event) {
    event.preventDefault();

    const correoIngresado = document.getElementById("correo").value.trim();
    const contrasenaIngresado = document.getElementById("contrasena").value.trim();
    const mensajeError = document.getElementById("error");

    mensajeError.style.display = "none";
    mensajeError.textContent = "";

    try {
        if (correoIngresado === "" || contrasenaIngresado === "") {
            throw new Error("Por favor completa todos los campos");
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

        if (datos.rol === "vendedor") {
            window.location.href = "/dashboardVendedor.html";

        } else if (datos.rol === "repositor") {
            window.location.href = "/dashboardRepositor.html";

        } else if (datos.rol === "administrador") {
            window.location.href = "/dashboardAdministrador.html";

        } else {
            throw new Error("El usuario no tiene un rol válido.");
        }

    } catch (error) {
        mensajeError.textContent = error.message;
        mensajeError.style.display = "block";
    }
}


document.addEventListener("DOMContentLoaded", function () {
    const formLogin = document.getElementById("form-login");

    if (formLogin) {
        formLogin.addEventListener("submit", iniciarSesion);
    }

    // RECUPERAR CONTRASEÑA
    const modalRecuperarEl = document.getElementById("modalRecuperarContrasena");
    const formRecuperar = document.getElementById("formRecuperarContrasena");
    const inputEmailRecuperacion = document.getElementById("emailRecuperacion");
    const campoEmailRecuperacion = inputEmailRecuperacion.closest(".campo-formulario");
    const mensajeExito = document.getElementById("exitoRecuperacion");
    const btnCambiarContrasena = formRecuperar.querySelector('button[type="submit"]');
    let temporizadorCierre = null;

    function mostrarErrorCampo(campo, mensaje) {
        campo.classList.add("campo-invalido");
        campo.querySelector(".error-campo").textContent = mensaje;
    }

    function limpiarErrorCampo(campo) {
        campo.classList.remove("campo-invalido");
        campo.querySelector(".error-campo").textContent = "";
    }

    async function recuperarContrasena(event) {
        event.preventDefault();

        const emailIngresado = inputEmailRecuperacion.value.trim();

        limpiarErrorCampo(campoEmailRecuperacion);
        mensajeExito.style.display = "none";
        mensajeExito.textContent = "";

        if (emailIngresado === "") {
            mostrarErrorCampo(campoEmailRecuperacion, "Ingresá el email asociado a tu cuenta.");
            return;
        }

        btnCambiarContrasena.disabled = true;

        try {
            // Simulación de éxito mientras se implementa la funcionalidad real
            await new Promise(resolve => setTimeout(resolve, 300));

            mensajeExito.textContent = "Se envió un enlace a tu correo";
            mensajeExito.style.display = "block";

            temporizadorCierre = setTimeout(() => {
                bootstrap.Modal.getInstance(modalRecuperarEl)?.hide();
            }, 2000);

        } catch (error) {
            mostrarErrorCampo(campoEmailRecuperacion, "No se pudo enviar la solicitud. Intentá de nuevo.");
            btnCambiarContrasena.disabled = false;
        }
    }

    formRecuperar.addEventListener("submit", recuperarContrasena);

    // Al cerrar el modal se limpia el campo y los mensajes
    modalRecuperarEl.addEventListener("hidden.bs.modal", () => {
        clearTimeout(temporizadorCierre);
        formRecuperar.reset();
        limpiarErrorCampo(campoEmailRecuperacion);
        mensajeExito.style.display = "none";
        mensajeExito.textContent = "";
        btnCambiarContrasena.disabled = false;
    });
});
