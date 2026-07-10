const { boby, body } = require('express-validator');

const cursoValidator = [
    body('titulo').trim().notEmpty().withMessage('El titulo es obligatorio'),
    body('descripcion').trim().notEmpty().withMessage('La descripcion es obligatorio'),
    body('categoria').trim().notEmpty().withMessage('La categoría es obligatoria'),
    body('duracion')
        .isFloat({ min: 1 })
        .withMessage('La duración debe ser un número mayor o igual a 1'),
    body('nivel')
        .optional()
        .isIn(['principiante', 'intermedio', 'avanzado'])
        .withMessage('Nivel inválido'),
    body('instructor').trim().notEmpty().withMessage('El instructor es obligatorio'),
    body('precio')
        .isFloat({ min: 0 })
        .withMessage('El precio no puede ser negativo'),
];

module.exports = { cursoValidator };
