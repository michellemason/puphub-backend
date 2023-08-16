"use strict";

/** Express app for puphub **/

const express = require("express");

const cors = require("cors");


const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const dogRoutes = require("./routes/dogs");
const usersRoutes = require("./routes/users");
const bookingRoutes = require("./routes/bookings");

const morgan = require("morgan");

const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://abounding-sea-mm.surge.sh/' : 'http://localhost:3002',
  credentials: true
}));

app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/dogs", dogRoutes);
app.use("/users", usersRoutes);
app.use("/bookings", bookingRoutes);

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;