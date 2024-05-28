const Multa = require('../models/multaModel');

exports.getAllMultas = async (req, res) => {
    try {
        const multas = await Multa.find();
        res.status(200).json(multas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las multas' });
    }
};

exports.addMulta = async (req, res) => {
    const { conductor, fecha, costo, observaciones } = req.body;
    try {
        const nuevaMulta = new Multa({ conductor, fecha, costo, observaciones });
        await nuevaMulta.save();
        res.status(201).json({ message: 'Multa guardada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar la multa' });
    }
};
