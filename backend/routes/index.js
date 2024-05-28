const express = require('express');
const router = express.Router();

const multasRouter = require('./multas');

router.use('/api', multasRouter);

module.exports = router;
