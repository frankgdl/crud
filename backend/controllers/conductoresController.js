const Conductor = require('../models/conductorModel');

exports.createConductor = (req, res) => {
    const newConductor = new Conductor({
        placas: req.body.placas,
        serie: req.body.serie,
        marca: req.body.marca,
        modelo: req.body.modelo,
        nombreConductor: req.body.nombreConductor,
        fotoUnidad: req.body.fotoUnidad // Si estás subiendo un archivo, necesitas manejar la carga del archivo
    });

    Conductor.create(newConductor, (err, result) => {
        if (err) {
            console.error('Error al agregar conductor:', err);
            return res.status(500).send({ error: 'Error al agregar conductor', details: err });
        }
        res.json({ id: result.insertId });
    });
};
