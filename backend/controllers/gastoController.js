const gastoModel = require("../models/gastoModel");

// GASTOS - LISTAR
async function listar(req, res) {
    try {
        const gastos = await gastoModel.listar();

        res.json(gastos);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Error al obtener los gastos."
        });
    }
}

module.exports = { listar };
