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

        const respuesta = await fetch("http://localhost:3000/login", {
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
            window.location.href = "../paginas/dashboardVendedor.html";

        } else if (datos.rol === "repositor") {
            window.location.href = "../paginas/dashboardRepositor.html";

        } else if (datos.rol === "administrador") {
            window.location.href = "../paginas/dashboardAdministrador.html";

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
});