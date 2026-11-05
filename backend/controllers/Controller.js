// base de todos los controllers
class Controller {
    constructor() {
        // ata los métodos a la instancia, así Express no pierde el this
        const metodos = Object.getOwnPropertyNames(Object.getPrototypeOf(this));

        for (const nombre of metodos) {
            if (nombre !== "constructor" && typeof this[nombre] === "function") {
                this[nombre] = this[nombre].bind(this);
            }
        }
    }

    // deshace la transacción sin tapar el error original
    async deshacer(conn) {
        if (!conn) return;

        try {
            await conn.rollback();
        } catch (rollbackError) {
            console.error(rollbackError);
        }
    }
}

module.exports = Controller;
