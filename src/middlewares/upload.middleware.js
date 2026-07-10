const multer = require('multer');
const ApiError = require('../utils/ApiError');

const Storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }else{
        cb(new ApiError(400, 'Solo se permiten archivos de imagen(jpg, png, ect.)'), false);
    }
};

const upload = multer({
    Storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;