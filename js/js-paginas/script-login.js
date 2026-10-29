
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

    // Idioma: por ahora solo se guarda la elección (misma clave que en Ajustes)
    const selectIdioma = document.getElementById("idiomaLogin");

    if (selectIdioma) {
        selectIdioma.value = localStorage.getItem("idioma") || "es";

        selectIdioma.addEventListener("change", function () {
            localStorage.setItem("idioma", selectIdioma.value);
        });
    }
});
