const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./routes/index.js');

app.use(bodyParser.json());
app.use(cors());

app.use('/', router);

app.listen(3001, () => {
    console.log('Servidor iniciado en el puerto 3001');
  });

