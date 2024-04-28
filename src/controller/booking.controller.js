import BookingModel from "../model/booking.model.js";
import { response } from "express";

export const bookingsGet = async (req, res = response) => {
  const { limit, page } = req.query;
  const query = { tp_status: "ACTIVE" };
  const [total, bookings] = await Promise.all([
    BookingModel.countDocuments(query),
    BookingModel.find(query)
      .skip(Number(page) * Number(limit))
      .limit(Number(limit)),
  ]);
  res.status(200).json({
    total,
    bookings,
    page,
  });
};

export const getBookingById = async (req, res) => {
  const { id } = req.params;
  const booking = await BookingModel.findById(id);
  if (!booking) {
    return res.status(404).json({
      msg: "Reservation not found",
    });
  }

  res.status(200).json({
    booking,
  });
};

export const putBooking = async (req, res = response) => {
  const { id } = req.params;
  const { date_start, date_end } = req.body;

  const bookingToUpdate = {
    date_start,
    date_end,
    updated_at: new Date(),
  };

  const oldBooking = await BookingModel.findById(id).select(
    "date_start date_end",
  );

  if (!oldBooking) {
    return res.status(404).json({
      msg: "Reservation not found",
    });
  }

  if (
    new Date(date_end || oldBooking.date_end) <=
    new Date(date_start || oldBooking.date_start)
  ) {
    return res.status(400).json({
      msg: "End date must be greater than start date",
    });
  }

  Object.keys(bookingToUpdate).forEach((key) => {
    if (bookingToUpdate[key] === undefined) {
      delete bookingToUpdate[key];
    }
  });

  const updatedBooking = await BookingModel.findByIdAndUpdate(
    id,
    bookingToUpdate,
    {
      new: true,
    },
  );

  res.status(200).json({
    msg: "Reservation successfully updated",
    booking: updatedBooking,
  });
};

export const bookingDelete = async (req, res) => {
  const { id } = req.params;

  const booking = await BookingModel.findByIdAndUpdate(
    id,
    { tp_status: "INACTIVE" },
    { new: true },
  );

  if (!booking) {
    return res.status(404).json({
      msg: "Reservation not found",
    });
  }

  res.status(200).json({
    msg: "Reservation successfully deleted",
    booking,
  });
};

export const bookingPost = async (req, res) => {
  const { date_start, date_end, room_id, user_id } = req.body;

  const booking = new BookingModel({
    date_start,
    date_end,
    room: room_id,
    user: user_id,
  });

  if (new Date(date_end) <= new Date(date_start)) {
    return res.status(400).json({
      msg: "End date must be greater than start date",
    });
  }

  try {
    await booking.save();
    res.status(201).json({
      booking,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internal Server Error",
      error: error.message,
    });
  }
};
