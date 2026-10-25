// Convierte las contraseñas en texto plano de la tabla usuarios en hashes bcrypt.
// Se corre UNA vez, desde la carpeta backend: node migrar-passwords.js
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const bcrypt = require("bcrypt");
const pool = require("./config/db");

(async () => {
    const usuarios = await pool.query("SELECT id_usuario, password FROM usuarios");

    let migradas = 0;
    for (const u of usuarios) {
        if (/^\$2[aby]\$/.test(u.password)) continue; // ya estaba hasheada
        const hash = await bcrypt.hash(u.password, 10);
        await pool.query("UPDATE usuarios SET password = ? WHERE id_usuario = ?", [hash, u.id_usuario]);
        migradas++;
    }

    console.log(`Listo, contraseñas hasheadas: ${migradas}`);
    await pool.end();
})().catch(err => {
    console.error("Error en la migración:", err.message);
    process.exit(1);
});