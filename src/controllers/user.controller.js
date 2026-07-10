const User = require('../models/User.model');
const Curso = require('../models/Curso.model');
const sendResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { uploadImage, deleteImage } = require('../services/cloudinary.service');


//Get
const obtenerPerfil = catchAsync(async (req, res, next) => {
    sendResponse(res, 200, true, 'Perfil obtenido correctamente', req.user);
});

//Patch
const actualizarPerfil = catchAsync(async (req, res, next) => {
    const cambios = {};
    if (req.body.nombre) cambios.nombre = req.body.nombre;
    if (req.body.email) cambios.email = req.body.email;

    if (req.file) {
        if (req.user.image?.public_id) {
            await deleteImage(req.user.image.public_id);
        }
        cambios.image = await uploadImage(req.file, 'usuarios');
    }

    const usuarioActualizado = await User.findByIdAndUpdate(req.user._id, cambios, {
        new: true,
        runValidators: true,
    });
    sendResponse(res, 200, true, 'Perfil actualizado correctamente', usuarioActualizado);
});

//Delete
const eliminarMiCuenta = catchAsync(async (req, res, next) => {
    if (req.user.image?.public_id) {
        await deleteImage(req.user.image.public_id);
    }
    await User.findByIdAndDelete(req.user._id);
    sendResponse(res, 200, true, 'Cuenta eliminada correctamente', null);
});

//Get - listar todos los usuarios (solo admin)

const obtenerUsuarios = catchAsync( async (req, res, next) => {
    const usuarios = await User.find();
    sendResponse(res, 200, true, 'Usuarios obtenidos correctamente', usuarios);
});

//Delete 
const eliminarUsuario = catchAsync(async (req, res, next) => {
    const usuario = await User.findById(req.params.id);
    if (!usuario) {
        return next(new ApiError(404, 'Usuario no encontrado'));
    }
    if (usuario.image?.public_id) {
        await deleteImage(usuario.image.public_id);
    }
    await User.findByIdAndDelete(req.params.id);
    sendResponse(res, 200, true, 'Usuario eliminado correctamente', null);
});

//Patch
const cambiarRol = catchAsync(async (req, res, next) => {
    const { role } = req.body;
    if (req.params.id === req.user._id.toString()) {
        return next(new ApiError(403, 'No puedes cambiar tu propio rol'));
    }
    const usuario = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true, runValidators: true }
    );
    if(!usuario) {
        return next(new ApiError(404, 'Usuario no encontrado'));
    }
    sendResponse(res, 200, true, `Rol actualizado a ${role} correctamente`, usuario);
});

//Post añadir un curso a mi lista, sin duplicados
const guardarCurso = catchAsync(async (req, res, next) => {
    const { cursoId } = req.params;
    const curso = await Curso.findById(cursoId);
    if (!curso) {
        return next(new ApiError(404, 'Curso no encontrado'));
    }

    //Añadir solo si no exixte en la array
    const usuarioActualizado = await User.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { cursosGuardados: cursoId } },
        { new: true }
    ).populate('cursosGuardados');
    sendResponse(res, 200, true, 'Curso añadido a tu lista correctamente', usuarioActualizado);
});

module.exports = {
    obtenerPerfil,
    actualizarPerfil,
    eliminarMiCuenta,
    obtenerUsuarios,
    eliminarUsuario,
    cambiarRol,
    guardarCurso,
}