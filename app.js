const express = require('express');
const mongoose = require('mongoose');
const app = express();

//Conectar a la BD
mongoose.connect('mongodb://localhost/mymbase', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('Conectado a MongoDB');
})
.catch(() => {console.log('No se pudo conectar con MongoDB', err)})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('API RESTful ok y ejecutandose...');
})