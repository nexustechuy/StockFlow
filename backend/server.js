// DEPENDENCIAS
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");

// RUTAS
const authRoutes = require("./rutas/authRoutes");
const usuarioRoutes = require("./rutas/usuarioRoutes");
const productoRoutes = require("./rutas/productoRoutes");
const categoriaRoutes = require("./rutas/categoriaRoutes");
const ventaRoutes = require("./rutas/ventaRoutes");
const reposicionRoutes = require("./rutas/reposicionRoutes");
const gastoRoutes = require("./rutas/gastoRoutes");
const compraRoutes = require("./rutas/compraRoutes");

const app = express();
const PORT = 3000;

app.use(express.json());

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
app.use(gastoRoutes);
app.use(compraRoutes);

// ruta que no existe
app.use((req, res) => {
    res.status(404).json({ error: "No se encontró lo que buscás." });
});

// cualquier error que se escape, sin mostrar detalles técnicos
app.use((error, req, res, next) => {
    console.error(error);

    if (error.type === "entity.parse.failed") {
        return res.status(400).json({ error: "Los datos enviados no son válidos." });
    }

    res.status(500).json({ error: "Error interno del servidor." });
});

// INICIAR SERVIDOR
app.listen(PORT, () => {
    
});
