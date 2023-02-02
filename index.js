const express = require("express");
const fs = require("fs");
const path = require("path");
const cookieParser = require("cookie-parser");
const AppError = require("./src/utils/appError");
const globalErrorHandler = require("./src/controllers/error-controller");
const userRouter = require("./src/routes/user-routes");
const contestantRouter = require("./src/routes/contestant-routes");
const voteRouter = require("./src/routes/vote-routes");

const app = express();
app.use(express.json());
app.use(cookieParser());

// app.use("/api/v1/users", (req, res, next) => {
//   console.log("Middleware is running");
//   res.status(200).json({
//     message: "This Middleware is working properly",
//   });
//   next();
// });

app.use("/api/v1/user", userRouter);
app.use("/api/v1/contestant", contestantRouter);
app.use("/api/v1/vote", voteRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
