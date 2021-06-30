const express = require('express');
const Usuario = require('../models/usuario_model');
const ruta = express.Router();

ruta.get('/', (req, res) => {
    res.json('Listo el GET de usuarios.');
});

ruta.post('/', (req, res) => {
    let body = req.body;
    let resultado = crearUsuario(body);

    resultado
        .then(user => {
            res.json({ valor: user });
        })
        .catch(err => { res.status(400).json({ error: err }) })
});

ruta.put('/:id', (req, res) => {
    let resultado = actualizarUsuario(req.params.id, req.body);
    resultado.then(valor => {
        res.json({
            valor: valor
        })
    }).catch(err => {
        res.status(400).json({
            error: err
        })
    })
});

async function crearUsuario(body) {
    let usuario = new Usuario({
        email: body.email,
        nombre: body.nombre,
        password: body.password
    });
    return await usuario.save();
}

async function actualizarUsuario(id, body) {
    const usuario = await Usuario.findByIdAndUpdate(id, {
        $set: {
            nombre: body.nombre,
            password: body.password,
            email: body.email
        }
    }, {new: true})
    console.log(usuario);
    return usuario;
}

module.exports = ruta;