const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/auth.controller');
const { registerValidator, loginValidator } = require('../validators/auth.validator');
const validate = require('../middlewares/validate.middleware');
const upload = require('../middlewares/upload.middleware');

router.post('/register', upload.single('image'), registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);

module.exports = router;