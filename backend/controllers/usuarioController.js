const bcrypt = require("bcrypt");
const pool = require("../config/db");
const Controller = require("./Controller");
const usuarioModel = require("../models/usuarioModel");

// Mismos límites que valida el login del front (script-login.js),
// así un usuario creado acá siempre puede ingresar.
const MAX_MAIL = 50;
const MAX_NOMBRE = 100;
const PASSWORD_MIN = 6;
const PASSWORD_MAX = 16;
const PASSWORD_INVALIDA = /[<>'"]/;
const FORMATO_MAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Roles que se pueden asignar desde el panel
const ROLES_ASIGNABLES = ["administrador", "vendedor", "repositor"];

class UsuarioController extends Controller {
    constructor(db, usuarioModel) {
        super();
        this.db = db;
        this.usuarioModel = usuarioModel;
    }

    // Convierte la fila de la base en lo que recibe el front
    armarUsuario(fila) {
        const roles = fila.roles ? String(fila.roles).split(",") : [];

        return {
            id_usuario: fila.id_usuario,
            mail: fila.mail,
            nombre: fila.nombre,
            activo: Number(fila.activo) === 1,
            rol: roles[0] || null,
            roles
        };
    }

    // Valida lo que mandó el front. Devuelve un mensaje de error o null.
    // En la edición la contraseña es opcional.
    validarDatos({ nombre, mail, password, roles }, { passwordObligatoria }) {
        if (typeof nombre !== "string" || !nombre.trim()) {
            return "Ingresá el nombre completo.";
        }
        if (nombre.trim().length > MAX_NOMBRE) {
            return `El nombre no puede superar los ${MAX_NOMBRE} caracteres.`;
        }

        if (typeof mail !== "string" || !FORMATO_MAIL.test(mail.trim())) {
            return "Ingresá un email válido (ej: usuario@gmail.com).";
        }
        if (mail.trim().length > MAX_MAIL) {
            return `El email no puede superar los ${MAX_MAIL} caracteres.`;
        }

        const hayPassword = typeof password === "string" && password !== "";

        if (passwordObligatoria && !hayPassword) {
            return "Ingresá una contraseña.";
        }
        if (hayPassword) {
            if (password.length < PASSWORD_MIN || password.length > PASSWORD_MAX) {
                return `La contraseña debe tener entre ${PASSWORD_MIN} y ${PASSWORD_MAX} caracteres.`;
            }
            if (PASSWORD_INVALIDA.test(password)) {
                return "La contraseña contiene caracteres no permitidos (< > ' \").";
            }
        }

        if (!Array.isArray(roles) || roles.length === 0) {
            return "Seleccioná al menos un rol para el usuario.";
        }
        if (roles.some(r => !ROLES_ASIGNABLES.includes(r))) {
            return "Algún rol no es válido.";
        }

        return null;
    }

    // Pasa los nombres de rol a ids de la tabla rol
    async idsDeRoles(nombres) {
        const unicos = [...new Set(nombres)];
        const encontrados = await this.usuarioModel.buscarRoles(unicos);

        if (encontrados.length !== unicos.length) {
            throw new Error("Algún rol no existe en la base de datos.");
        }

        return encontrados.map(r => Number(r.id_rol));
    }

    aActivo(valor) {
        return valor === true || valor === 1 || valor === "1" ? 1 : 0;
    }

    // USUARIOS - LISTAR
    async listar(req, res) {
        try {
            const usuarios = await this.usuarioModel.listar();

            res.json(usuarios.map(this.armarUsuario));

        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: "Error al obtener los usuarios."
            });
        }
    }

    // USUARIOS - CREAR
    async crear(req, res) {
        let conn;

        try {
            const error = this.validarDatos(req.body || {}, { passwordObligatoria: true });

            if (error) {
                return res.status(400).json({ error });
            }

            const nombre = req.body.nombre.trim();
            const mail = req.body.mail.trim();
            const activo = req.body.activo === undefined ? 1 : this.aActivo(req.body.activo);

            if (await this.usuarioModel.mailEnUso(mail)) {
                return res.status(409).json({ error: "Ya existe un usuario con ese email." });
            }

            const idsRol = await this.idsDeRoles(req.body.roles);
            const passwordHash = await bcrypt.hash(req.body.password, 10);

            conn = await this.db.getConnection();
            await conn.beginTransaction();

            const nuevoId = await this.usuarioModel.crear(conn, { mail, passwordHash, nombre, activo });
            await this.usuarioModel.reemplazarRoles(conn, nuevoId, idsRol);

            await conn.commit();

            const usuarioCreado = await this.usuarioModel.obtenerPorId(nuevoId);

            res.status(201).json(this.armarUsuario(usuarioCreado));

        } catch (error) {
            console.error(error);
            await this.deshacer(conn);

            if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
                return res.status(409).json({ error: "Ya existe un usuario con ese email." });
            }

            res.status(500).json({
                error: "Error al guardar el usuario."
            });

        } finally {
            if (conn) {
                conn.release();
            }
        }
    }

    // USUARIOS - EDITAR (nombre, mail, roles, estado y, si viene, contraseña)
    async editar(req, res) {
        let conn;

        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id < 1) {
                return res.status(400).json({ error: "Usuario inválido." });
            }

            const error = this.validarDatos(req.body || {}, { passwordObligatoria: false });

            if (error) {
                return res.status(400).json({ error });
            }

            const existente = await this.usuarioModel.obtenerPorId(id);

            if (!existente) {
                return res.status(404).json({ error: "El usuario no existe." });
            }

            const nombre = req.body.nombre.trim();
            const mail = req.body.mail.trim();
            const activo = this.aActivo(req.body.activo);
            const esUnoMismo = id === Number(req.usuario.id_usuario);

            // El administrador no se puede dejar afuera a sí mismo
            if (esUnoMismo && activo === 0) {
                return res.status(400).json({ error: "No podés desactivar tu propio usuario." });
            }
            if (esUnoMismo && !req.body.roles.includes("administrador")) {
                return res.status(400).json({ error: "No podés quitarte a vos mismo el rol de administrador." });
            }

            if (await this.usuarioModel.mailEnUso(mail, id)) {
                return res.status(409).json({ error: "Ya existe un usuario con ese email." });
            }

            const idsRol = await this.idsDeRoles(req.body.roles);
            const passwordHash = req.body.password
                ? await bcrypt.hash(req.body.password, 10)
                : null;

            conn = await this.db.getConnection();
            await conn.beginTransaction();

            await this.usuarioModel.actualizar(conn, id, { mail, passwordHash, nombre, activo });
            await this.usuarioModel.reemplazarRoles(conn, id, idsRol);

            await conn.commit();

            const usuarioEditado = await this.usuarioModel.obtenerPorId(id);

            res.json(this.armarUsuario(usuarioEditado));

        } catch (error) {
            console.error(error);
            await this.deshacer(conn);

            if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
                return res.status(409).json({ error: "Ya existe un usuario con ese email." });
            }

            res.status(500).json({
                error: "Error al editar el usuario."
            });

        } finally {
            if (conn) {
                conn.release();
            }
        }
    }

    // USUARIOS - ACTIVAR / DESACTIVAR
    async cambiarEstado(req, res) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id < 1) {
                return res.status(400).json({ error: "Usuario inválido." });
            }

            if (req.body?.activo === undefined) {
                return res.status(400).json({ error: "Falta indicar el estado." });
            }

            const activo = this.aActivo(req.body.activo);

            if (id === Number(req.usuario.id_usuario) && activo === 0) {
                return res.status(400).json({ error: "No podés desactivar tu propio usuario." });
            }

            const existente = await this.usuarioModel.obtenerPorId(id);

            if (!existente) {
                return res.status(404).json({ error: "El usuario no existe." });
            }

            await this.usuarioModel.cambiarEstado(id, activo);

            const usuario = await this.usuarioModel.obtenerPorId(id);

            res.json(this.armarUsuario(usuario));

        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: "Error al cambiar el estado del usuario."
            });
        }
    }
}

module.exports = new UsuarioController(pool, usuarioModel);
