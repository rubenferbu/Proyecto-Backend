const mongoose = require('mongoose');

const cursoSchema = new mongoose.Schema(
    {
        titulo: {
            type: String,
            required: [true, 'El titulo es obligatorio'],
            trim: true,
        },
        descripcion: {
            type: String,
            required: [true, 'La descripcion es obligatorio'],
        },
        categoria: {
            type: String,
            required: [true, 'La categoria es obligatorio'],
            trim: true,
        },
        duracion: {
            type: Number,
            required: [true, 'La duracion es obligatorio'],
            main: [1, 'La duracion debe ser al menos 1 hora'],
        },
        nivel: {
            type: String,
            enum: ['principiante', 'intermedio', 'avanzado'],
            default: 'principiante',
        },
        instructor: {
            type: String,
            required: [true, 'El instructor es obligatorio'],
            trim: true,
        },
        precio: {
            type: Number,
            required: [true, 'El precio es obligatorio'],
            main: [0, 'El precio no puede ser negativo'],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Curso', cursoSchema);