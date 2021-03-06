const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario_model');
const Joi = require('joi');
const verificarToken = require('../middlewares/auth');
const ruta = express.Router();

const schema = Joi.object({
    nombre: Joi.string()
        .min(3)
        .max(10)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
});

ruta.get('/', verificarToken, (req, res) => {
    let resultado = listarUsuariosActivos();
    resultado.then(usuarios => {
        res.json(usuarios);
    }).catch(err => {
        res.status(400).json({err})
    })
});

ruta.post('/', (req, res) => {
    let body = req.body;

    //Revisar esto
    Usuario.findOne({ email: req.body.email })
        .then(datos => {
            if (datos) {
                res.status(400).send({ msj: 'El email ya existe' })
                return;
            }
        });
       
    const { error, value } = schema.validate({ nombre: body.nombre, email: body.email });
    if (!error) {
        let resultado = crearUsuario(body);

    resultado
        .then(user => {
            return res.json({
                nombre: user.nombre,
                email: user.email
            });
        })
        .catch(err => { return res.status(400).json({ err }) })
    } else {
        return res.status(400).json({
            error
        })
    }
    
});

ruta.put('/:id', verificarToken, (req, res) => {

    const { error, value } = schema.validate({ nombre: req.body.nombre, email: req.body.email, password: req.body.password });

    if (!error) {
        let resultado = actualizarUsuario(req.params.id, req.body);
        resultado.then(usuario => {
            res.json({
                nombre: usuario.nombre,
                email: usuario.email
            })}).catch(err => {
                res.status(400).json({
                    err
                })
            })
    } else {
        res.status(400).json({
            error
        })
    }
   
});

ruta.delete('/:id', verificarToken, (req, res) => {
    let resultado = desactivarUsuario(req.params.id);
    resultado.then(usuario => {
        res.json({
            nombre: usuario.nombre,
            email: usuario.email
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
        password: bcrypt.hashSync(body.password, 10)
    });
    return await usuario.save();
}

async function validarUsuario(email) {
    
}

async function listarUsuariosActivos() {
    const usuarios = await Usuario.find({ "estado": true })
    .select({ nombre: 1, email: 1 });
    return usuarios;
}

async function actualizarUsuario(id, body) {
    const usuario = await Usuario.findByIdAndUpdate(id, {
        $set: {
            nombre: body.nombre,
            password: bcrypt.hashSync(body.password, 10),
            email: body.email
        }
    }, {new: true})
    console.log(usuario);
    return usuario;
}

async function desactivarUsuario(id) {
    const usuario = await Usuario.findByIdAndUpdate(id, {
        $set: {
            estado: false
        }
    }, { new: true })
    console.log(usuario);
    return usuario;
}

module.exports = ruta;