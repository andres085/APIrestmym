const express = require('express');
const Curso = require('../models/curso_model');
const verificarToken = require('../middlewares/auth');
const Joi = require('joi');
const ruta = express.Router();

const schema = Joi.object({
    titulo: Joi.string()
        .min(3)
        .max(30)
        .required(),

    descripcion: Joi.string()
        .min(5)
        .max(255)
        .required(),
})

ruta.get('/', verificarToken, (req, res) => {

    let resultado = listarCursosActivos();
    resultado.then(cursos => {
        res.json(cursos);
    }).catch(err => {
        res.status(400).json({err})
    })
});

ruta.post('/', verificarToken, (req, res) => {

    const { error, value } = schema.validate({ titulo: req.body.titulo, descripcion: req.body.descripcion });

    if (!error) {
        let resultado = crearCurso(req);

        resultado
            .then(curso => {
                res.json({
                    curso
                });
            }).catch(error => {
                res.status(400).json({
                    error
                })
            })
    } else {
        res.status(400).json({
            error
        })
    }
});

ruta.put('/:id', verificarToken, (req, res) => {

    const { error, value } = schema.validate({ titulo: req.body.titulo, descripcion: req.body.descripcion });
    
    if (!error) {
        
        let resultado = actualizarCurso(req.params.id, req.body);
    
        resultado
            .then(curso => {
                res.json({
                    curso
                });
            })
            .catch(err => {
                res.status(400).json({
                    err
                });
            })

    } else {
        res.status(400).json({
            error
        })
    }
    
});

ruta.delete('/:id', verificarToken, (req, res) => {
    let resultado = desactivarCurso(req.params.id);
    resultado.then(curso => {
        res.json({
            curso
        })
    }).catch(err => {
        res.status(400).json({
            err
        })
    })
});


async function crearCurso(req) {
    let curso = new Curso({
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        autor: req.usuario._id,
    });
    return await curso.save();
}

async function listarCursosActivos() {
    const cursos = await Curso.find({ "estado": true }).populate('autor', 'nombre -_id',);
    return cursos;
}

async function actualizarCurso(id, body) {
    const curso = await Curso.findByIdAndUpdate(id, {
        $set: {
            titulo: body.titulo,
            descripcion: body.descripcion,
        }
    }, {new: true})
    console.log(curso);
    return curso;
}

async function desactivarCurso(id) {
    const curso = await Curso.findByIdAndUpdate(id, {
        $set: {
            estado: false
        }
    }, { new: true })
    console.log(curso);
    return curso;
}

module.exports = ruta;