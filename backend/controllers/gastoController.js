const Controller = require("./Controller");
const gastoModel = require("../models/gastoModel");

class GastoController extends Controller {
    constructor(gastoModel) {
        super();
        this.gastoModel = gastoModel;
    }

    // GASTOS - LISTAR
    async listar(req, res) {
        try {
            const gastos = await this.gastoModel.listar();

            res.json(gastos);

        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: "Error al obtener los gastos."
            });
        }
    }
}

module.exports = new GastoController(gastoModel);
