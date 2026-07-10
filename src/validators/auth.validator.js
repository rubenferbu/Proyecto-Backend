const { body } = require('express-validator');

const registerValidator = [ 
    body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('Debe ser un email válido').normalizeEmail(),
    body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres'),
];

const loginValidator = [
    body('email').isEmail().withMessage('Debe ser un email valido').normalizeEmail(),
    body('password').notEmpty().withMessage('La contraseña es obligatorio'),
];

module.exports = { registerValidator, loginValidator };
