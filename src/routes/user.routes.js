const express = require("express");
const router = express.Router();

const {
  obtenerPerfil,
  actualizarPerfil,
  eliminarMiCuenta,
  obtenerUsuarios,
  eliminarUsuario,
  cambiarRol,
  guardarCurso,
} = require('../controllers/user.controller');
const { actualizarPerfilValidator, cambiarRolValidator } = require('../validators/user.validator');
const validate = require('../middlewares/validate.middleware');
const protect = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/admin.middleware');
const upload = require('../middlewares/upload.middleware');

//Rutas del propio usuario autenticado
router.get('/me', protect, obtenerPerfil);
router.patch('/me', protect, upload.single('image'), actualizarPerfilValidator, validate, actualizarPerfil);
router.delete('/me', protect, eliminarMiCuenta);
router.post('/me/cursos/:cursoId', protect, guardarCurso);

//Rutas exclusivas de Admin
router.get('/', protect, isAdmin, obtenerUsuarios);
router.delete('/:id', protect, isAdmin, eliminarUsuario);
router.patch('/:id/role', protect, isAdmin, cambiarRolValidator, validate, cambiarRol);

module.exports = router;
