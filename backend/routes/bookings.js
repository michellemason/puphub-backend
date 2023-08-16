"use strict";

// Routes for bookings

const jsonschema = require("jsonschema");
const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Booking = require("../models/booking");
const bookingSchema = require("../schemas/bookingSchema.json");

const router = express.Router();

//Getting dates in correct format 
Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

// Create a booking for a user
router.post("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, bookingSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const { start_date, end_date } = req.body;

    const isFullyBooked = await Booking.isDateRangeFullyBooked(start_date, end_date);

    if (isFullyBooked) {
      throw new BadRequestError({ error: "Selected date range is fully booked." });
    }
    const booking = await Booking.createBooking(req.body, req.params.username);
    return res.status(201).json({ booking });
  } catch (error) {
    return next(error);

  }
}
);

// Get a users bookings
router.get("/:username", async function (req, res, next) {
  try {
    const bookings = await Booking.userBookings(req.params.username);
    return res.json({ bookings });
  } catch (err) {
    return next(err);
  }
});

// Delete a booking
router.delete("/:id", async function (req, res, next) {
  try {
    await Booking.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
