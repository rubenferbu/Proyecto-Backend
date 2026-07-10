const { body } = require('express-validator');

const actualizarPerfilValidator = [
    body('nombre').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío'),
    body('email').optional().isEmail().withMessage('Debe ser un email válido').normalizeEmail(),
];
const cambiarRolValidator = [
    body('role').isIn(['user', 'admin']).withMessage("El rol ser 'user' o 'admin'"),
];

module.exports = { actualizarPerfilValidator, cambiarRolValidator};