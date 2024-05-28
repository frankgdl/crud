const db = require('../config/db');

class Conductor {
    constructor(conductor) {
        this.placas = conductor.placas;
        this.serie = conductor.serie;
        this.marca = conductor.marca;
        this.modelo = conductor.modelo;
        this.nombreConductor = conductor.nombreConductor;
        this.fotoUnidad = conductor.fotoUnidad; // Asegúrate de manejar este campo correctamente
    }

    static create(newConductor, result) {
        db.query('INSERT INTO conductores SET ?', newConductor, (err, res) => {
            if (err) {
                result(err, null);
                return;
            }
            result(null, { insertId: res.insertId });
        });
    }
}

module.exports = Conductor;
