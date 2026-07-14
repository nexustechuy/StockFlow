const usuarios = [
    {mail: "vendedor@gmail.com",         password: "1234",    rol:"vendedor"},
    {mail: "repositor@gmail.com",        password: "1234",    rol:"repositor"},
    {mail: "administrador@gmail.com",    password: "1234",    rol:"administrador"}
];

function iniciarSesion(event){
    event.preventDefault();

    const correoIngresado = document.getElementById("correo").value.trim();
    const contrasenaIngresado = document.getElementById("contrasena").value.trim();
    const mensajeError = document.getElementById("error");

    mensajeError.style.display = "none";
    mensajeError.textContent = "";

    try{
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

        const usuarioEncontrado = usuarios.find(
            u => u.mail === correoIngresado && u.password === contrasenaIngresado
        );

        if (!usuarioEncontrado) {
            throw new Error("El correo o la contraseña son incorrectos.");
        }

        if (usuarioEncontrado.rol === "vendedor") {
            window.location.href = "../paginas/dashboardVendedor.html";
        } else if (usuarioEncontrado.rol === "repositor") {
            window.location.href = "../paginas/dashboardRepositor.html";
        } else if (usuarioEncontrado.rol === "administrador") {
            window.location.href = "../paginas/dashboardAdministrador.html";
        }

    } catch (error) {
        // Mostramos el mensaje de error al usuario
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
