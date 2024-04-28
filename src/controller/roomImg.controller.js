import RoomImage from "../model/roomImg.model.js";
import { response } from "express";

export const roomImagesGet = async (req, res = response) => {
  try {
    const { room_id } = req.query;
    const images = await RoomImage.find({ room_id });
    res.status(200).json({ images });
  } catch (error) {
    console.error("Error al obtener las imágenes de la habitación:", error);
    res.status(500).json({ message: "Error interno del Servidor" });
  }
};
export const roomImagePost = async (req, res) => {
  try {
    const { image_url, room_id, is_main_image } = req.body;
    const image = new RoomImage({ image_url, room_id, is_main_image });
    await image.save();
    res.status(201).json({ image });
  } catch (error) {
    console.error("Error al crear la imagen:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const changeMainImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { room_id, is_main_image } = req.body;

    await RoomImage.findOneAndUpdate(
      { room_id, is_main_image: true },
      { is_main_image: false },
    );

    const updatedImage = await RoomImage.findByIdAndUpdate(
      id,
      { room_id, is_main_image },
      { new: true },
    );
    if (!updatedImage) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.status(200).json({ image: updatedImage });
  } catch (error) {
    console.error("Error al actualizar la imagen:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const roomImageDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedImage = await RoomImage.findByIdAndDelete(id);
    if (!deletedImage) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }
    res.status(200).json({ deletedImage });
  } catch (error) {
    console.error("Error al eliminar la imagen:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
