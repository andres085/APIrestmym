const express = require('express');
const usuarios = require('./routes/usuarios');
const cursos = require('./routes/cursos');
const auth = require('./routes/auth');
const mongoose = require('mongoose');
const app = express();
const config = require('config');

//Conectar a la BD
mongoose.connect(config.get('configDB.HOST'), {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('Conectado a MongoDB');
})
.catch(() => {console.log('No se pudo conectar con MongoDB', err)})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('API RESTful ok y ejecutandose...');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/usuarios', usuarios);
app.use('/api/cursos', cursos);
app.use('/api/auth', auth);

