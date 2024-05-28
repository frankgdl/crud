const express = require('express');
const router = express.Router();
const conductoresController = require('../controllers/conductoresController');

// Definir las rutas y asociarlas a los controladores
router.get('/', conductoresController.getAllConductores);
router.post('/', conductoresController.createConductor); // Asegúrate de tener esta ruta configurada

module.exports = router;
