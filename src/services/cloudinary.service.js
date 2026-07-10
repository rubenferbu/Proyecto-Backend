const cloudinary = require("../config/cloudinary");

const uploadImage = async (file, folder = "usuarios") => {
  const base64String = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

  const resultado = await cloudinary.uploader.upload(base64String, {
    folder,
  });

  return{
    url: resultado.secure_url,
    public_id: resultado.public_id,
  };
};

//Eliminar una imagen

const deleteImage = async (public_id) => {
    if (!public_id) return;
    await cloudinary.uploader.destroy(public_id);
};

module.exports = { uploadImage, deleteImage };
