const Curso = require('../models/Curso.model');
const sendResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');


const crearCurso = catchAsync(async (req, res, next) => {
    const nuevoCurso = await Curso.create(req.body);
    sendResponse(res, 201, true, 'Curso creado correctamente', nuevoCurso);
});

const obtenerCursos = catchAsync(async (req, res, next) => {
    const cursos = await Curso.find();
    sendResponse(res, 200, true, 'Cursos obtenidos correctamente', cursos);
});

const obtenerCursoPorId = catchAsync(async (req, res, next) => {
    const curso = await Curso.findById(req.params.id, req.boby, {
        new: true,
        runValidators: true,
    });
    if (!curso) {
        return next(new ApiError(404, 'Curso no encontrado'));
    }
    sendResponse(res, 200, true, 'Curso actualizado correctamente', curso);
});

const actualizarCurso = catchAsync(async (req, res, next) => {
    const curso = await Curso.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!curso) {
        return next(new ApiError(404, 'Curso no encontrado'));
    }
    sendResponse(res, 200, true, 'Curso actualizado correctamente', curso);
});

const eliminarCurso = catchAsync( async (req, res, next) => {
    const curso = await Curso.findByIdAndDelete(req.params.id);
    if (!curso) {
        return next( new ApiError(404, 'Curso no encontrado'));
    }
    sendResponse(res, 200, true, 'Curso eliminado Correctamente', null);
});

module.exports = {
    crearCurso,
    obtenerCursos,
    obtenerCursoPorId,
    actualizarCurso,
    eliminarCurso,
};