const express = require('express');


const router = express.Router()

const {
    crearCurso,
    obtenerCursos,
    ontenerCursoPorId,
    actualizarCurso,
    eliminarCurso,
    obtenerCursoPorId,
} = require ('../controllers/curso.controller');
const { cursoValidator } = require('../validators/curso.validator');
const validate = require('../middlewares/validate.middleware');
const protect = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/admin.middleware');

//Lectura para cualquier Usuario
router.get('/', protect, obtenerCursos);
router.get('/:id', protect, obtenerCursoPorId);

//Escritura solo administradores
router.post('/', protect, isAdmin, cursoValidator, validate, crearCurso);
router.put('/:id', protect, isAdmin, cursoValidator, validate, actualizarCurso);
router.delete('/:id', protect, isAdmin, eliminarCurso);

module.exports = router;