const User = require("../models/User.model");
const generateToken = require("../utils/generateToken");
const sendResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { uploadImage } = require("../services/cloudinary.service");

const register = catchAsync(async (req, res, next) => {
  const { nombre, email, password } = req.body;

  const existeUsuario = await User.findOne({ email });
  if (existeUsuario) {
    return next(new ApiError(409, "Ya existe un usuario con ese email"));
  }

  let imagenData = { url: null, public_id: null };

  if (req.file) {
    imagenData = await uploadImage(req.file, "usuarios");
  }

  const nuevoUsuario = await User.create({
    nombre,
    email,
    password,
    image: imagenData,
  });

  const token = generateToken(nuevoUsuario._id, nuevoUsuario.role);

  sendResponse(res, 201, true, "Usuario registrado correctamente", {
    usuario: {
      id: nuevoUsuario._id,
      nombre: nuevoUsuario.nombre,
      email: nuevoUsuario.email,
      role: nuevoUsuario.role,
      image: nuevoUsuario.image,
    },
    token,
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const usuario = await User.findOne({ email }).select("+password");

  if (!usuario) {
    return next(new ApiError(401, "Credenciales inválidas"));
  }

  const passwordCorrecta = await usuario.compararPassword(password);
  if (!passwordCorrecta) {
    return next(new ApiError(401, "Credenciales inválidas"));
  }

  const token = generateToken(usuario._id, usuario.role);

  sendResponse(res, 200, true, "Login exitoso", {
    usuario: {
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      role: usuario.role,
      image: usuario.image,
    },
    token,
  });
});

module.exports = { register, login };
