const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/db');
const multer = require('multer');

const app = express();
const port = 3000;

const upload = multer({ dest: 'uploads/' }); // Configura la carpeta de destino para los archivos cargados

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Importar las rutas
const conductoresRouter = require('./routes/conductores');
const multasRouter = require('./routes/multas');

// Usar las rutas con multer para manejar la carga de archivos
app.use('/api/conductores', upload.single('fotoUnidad'), conductoresRouter);
app.use('/api/multas', multasRouter);

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
