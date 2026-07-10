require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const errorHandler = require('./middlewares/error.middleware');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const cursoRoutes = require('./routes/curso.routes');


const app = express();

//Middlewares globales de seguridad y utilidades

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if(process.env.NODE_ENV !== 'production'){
    app.use(morgan('dev'));
}

//Comprobacion rapida
app.get('/', (rep, res) => {
    res.status(200).json({
        success: true,
        message: 'API funcionando correctamente',
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cursos', cursoRoutes);


// 404 - sintaxis nueva de Espress 5 para comodines
app.use('/*splat', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada',
    });
});

//Middleware global de errores - SIEMPRE el último
app.use(errorHandler);

module.exports = app;