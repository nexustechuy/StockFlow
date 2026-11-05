// base de todos los models: guarda la conexión
class Model {
    constructor(db) {
        this.db = db;
    }
}

module.exports = Model;
