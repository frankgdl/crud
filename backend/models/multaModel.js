const mongoose = require('mongoose');

const multaSchema = new mongoose.Schema({
    conductor: String,
    fecha: String,
    costo: String,
    observaciones: String
});

module.exports = mongoose.model('Multa', multaSchema);
