// DEPENDENCIAS
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const configurarSesion = require("./middleware/session");

// RUTAS
const authRoutes = require("./rutas/authRoutes");
const usuarioRoutes = require("./rutas/usuarioRoutes");
const productoRoutes = require("./rutas/productoRoutes");
const categoriaRoutes = require("./rutas/categoriaRoutes");
const ventaRoutes = require("./rutas/ventaRoutes");
const reposicionRoutes = require("./rutas/reposicionRoutes");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
configurarSesion(app);

// ACCESO A LAS CARPETAS
app.use(express.static(path.join(__dirname, "../paginas")));
app.use("/css", express.static(path.join(__dirname, "../css")));
app.use("/js", express.static(path.join(__dirname, "../js")));

// RUTA DE PRUEBA PRINCIPAL
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../paginas/login.html"));
});

app.use(authRoutes);
app.use(usuarioRoutes);
app.use(productoRoutes);
app.use(categoriaRoutes);
app.use(ventaRoutes);
app.use(reposicionRoutes);

// INICIAR SERVIDOR
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en El servidor puerto:${PORT}`);
});
