const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario_model');
//const Joi = require('joi');
const ruta = express.Router();

ruta.post('/', (req, res) => {
    Usuario.findOne({ email: req.body.email })
        .then(datos => {
            if (datos) {
                res.json(datos);
            } else {
                res.status(400).json({
                    error: 'Ok',
                    msj: 'Usuario o contraseña incorrecta.'
                })
            }
         })
        .catch(err => {
            res.status(400).json({
                error: 'ok',
                msj: `Error en el servicio ${error}`
        })
    })
})

module.exports = ruta;