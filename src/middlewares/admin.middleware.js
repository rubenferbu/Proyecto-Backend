const ApiError = require('../utils/ApiError');

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return next(new ApiError(403, 'Acceso denegado: se reuiere rol de administrador'));
    }
    next();
};

module.exports = isAdmin;