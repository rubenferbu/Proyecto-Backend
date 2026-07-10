const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        nombre:{
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'El email es obligatorio'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'La contraseña es obligatoria'],
            minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
            select: false,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        image: {
            url: { type: String, default: null },
            public_id: { type: String, default: null },
        },
        cursosGuardados:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Curso',
            },
        ],
    },
    {
        timestamps: true,
    }
);

//Hashear la contraseña antes de guardar
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

//Comparar contraseñas
userSchema.methods.compararPassword = async function (passwordIngresada) {
  return await bcrypt.compare(passwordIngresada, this.password);
};

module.exports = mongoose.model('User', userSchema);