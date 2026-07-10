const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const protect = catchAsync(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new ApiError(401, 'No autorizado, token no proporcionado'));
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    }catch (error) {
        return next(new ApiError(401, 'Token inválido o expirado'));
    }

    const usuario = await User.findById(decoded.id);
    if (!usuario) {
        return next(new ApiError(401, 'El usuario asociado a este token ya no existe'));
    }

    req.user = usuario;
    next();
});

module.exports = protect;