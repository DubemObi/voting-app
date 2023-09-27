const express = require("express");
const fs = require("fs");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const AppError = require("./src/utils/appError");
const globalErrorHandler = require("./src/controllers/error-controller");
const userRouter = require("./src/routes/user-routes");
const contestantRouter = require("./src/routes/contestant-routes");
const voteRouter = require("./src/routes/vote-routes");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(helmet());

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message:
    "Too many request from the same IP address. Try again in 1 hour time.",
});
app.use("/api", limiter);

app.use(mongoSanitize());

app.use(xss());

app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/contestant", contestantRouter);
app.use("/api/v1/vote", voteRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
