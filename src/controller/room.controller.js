import RoomModel from "../model/room.model.js";
import { response } from "express";

export const roomsGet = async (req, res = response) => {
  const { limit, page } = req.query;
  const query = { tp_status: "ACTIVE" };

  const [total, rooms] = await Promise.all([
    RoomModel.countDocuments(query),
    RoomModel.find(query)
      .skip(Number(page) * Number(limit))
      .limit(Number(limit)),
  ]);

  res.status(200).json({
    total,
    rooms,
  });
};

export const getRoomById = async (req, res) => {
  const { id } = req.params;
  const room = await RoomModel.findById({ _id: id });
  if (!room) {
    return res.status(404).json({
      msg: "Room not found",
    });
  }

  res.status(200).json({
    room,
  });
};

export const putRoom = async (req, res = response) => {
  const { id } = req.params;
  const { description, people_capacity, night_price, room_type } = req.body;

  const roomToUpdate = {
    description,
    people_capacity,
    night_price,
    room_type,
    updated_at: new Date(),
  };

  Object.keys(roomToUpdate).forEach((key) => {
    if (roomToUpdate[key] === undefined) {
      delete roomToUpdate[key];
    }
  });

  const updatedRoom = await RoomModel.findByIdAndUpdate(id, roomToUpdate, {
    new: true,
  });

  if (!updatedRoom) {
    return res.status(404).json({
      msg: "Room not found",
    });
  }

  res.status(200).json({
    msg: "Room updated successfully",
    room: updatedRoom,
  });
};

export const roomDelete = async (req, res) => {
  const { id } = req.params;

  const room = await RoomModel.findByIdAndUpdate(
    id,
    { tp_status: "INACTIVE" },
    { new: true },
  );

  if (!room) {
    return res.status(404).json({
      msg: "Room not found",
    });
  }

  res.status(200).json({
    msg: "Room deleted successfully",
    room,
  });
};

export const roomPost = async (req, res) => {
  const { description, people_capacity, night_price, room_type } = req.body;
  const room = new RoomModel({
    description,
    people_capacity,
    night_price,
    room_type,
  });

  await room.save();
  res.status(201).json({
    room,
  });
};