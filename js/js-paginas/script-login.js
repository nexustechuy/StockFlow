
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

                localStorage.setItem("sf_token", datos.token);
        localStorage.setItem("sf_usuario", JSON.stringify({
            id_usuario: datos.id_usuario,
            mail: datos.mail,
            nombre: datos.nombre,
            rol: datos.rol,
            roles: datos.roles
        }));

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
    const contrasena = document.getElementById("contrasena");
    const botonMostrar = document.getElementById("mostrarContrasena");

    if (formLogin) {
        formLogin.addEventListener("submit", iniciarSesion);
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

    const modalRecuperarEl = document.getElementById("modalRecuperarContrasena");
    const formRecuperar = document.getElementById("formRecuperarContrasena");
    const inputEmailRecuperacion = document.getElementById("emailRecuperacion");

    if (!modalRecuperarEl || !formRecuperar || !inputEmailRecuperacion) {
        return;
    }

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

        if (emailIngresado.length > 50) {
            mostrarErrorCampo(campoEmailRecuperacion, "El correo no puede superar los 50 caracteres.");
            return;
        }

        const formatoMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formatoMail.test(emailIngresado)) {
            mostrarErrorCampo(campoEmailRecuperacion, "El correo ingresado no tiene un formato válido.");
            return;
        }

        btnCambiarContrasena.disabled = true;

        try {
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

    modalRecuperarEl.addEventListener("hidden.bs.modal", () => {
        clearTimeout(temporizadorCierre);
        formRecuperar.reset();
        limpiarErrorCampo(campoEmailRecuperacion);
        mensajeExito.style.display = "none";
        mensajeExito.textContent = "";
        btnCambiarContrasena.disabled = false;
    });
});
