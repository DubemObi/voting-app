const Flutterwave = require("flutterwave-node-v3");
const Contestant = require("../models/contestant-model");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const nodemailer = require("nodemailer");
const newEmail = require("../utils/email");

const flw = new Flutterwave(
  process.env.FLW_PUBLIC_KEY,
  process.env.FLW_SECRET_KEY
);
// exports.getAllVotes = factory.getAll(Vote);

exports.checkout = catchAsync(async (req, res, next) => {
  try {
    const constestantID = req.params.id;
    const findContestant = await Contestant.findById(constestantID).populate({
      path: "name category votes",
    });

    if (findContestant) {
      let payload = req.body;
      try {
        payload = {
          ...payload,
          amount: req.body.votes * 50,
          tx_ref: "hy_ " + Math.floor(Math.random() * 1000000000 + 1),
          enckey: process.env.FLW_ENCRYPTION_KEY,
        };
        const response = await flw.Charge.card(payload);

        // For PIN transactions
        if (response.meta.authorization.mode === "pin") {
          let payload2 = payload;
          payload2.authorization = {
            mode: "pin",
            fields: ["pin"],
            pin: 3310,
          };
          const reCallCharge = await flw.Charge.card(payload2);

          // Add the OTP to authorize the transaction
          const callValidate = await flw.Charge.validate({
            otp: "12345",
            flw_ref: reCallCharge.data.flw_ref,
          });

          if (callValidate.status === "success") {
            await newEmail({
              email: req.body.email,
              subject: "Vote successful",
              text: `You have purchased ${req.body.votes} amount of votes for ${constestantID}`,
            });

            const newVotes = findContestant.votes + req.body.votes * 1;
            const update = {
              votes: newVotes,
            };

            const doc = await Contestant.findByIdAndUpdate(
              constestantID,
              update,
              {
                new: true,
                runValidators: true,
              }
            );

            return res.status(200).json({
              status: "success",
              data: doc,
              message: "Vote has been added successfully",
            });
          }

          if (callValidate.status === "error") {
            return res.status(400).send("please try again");
          } else {
            return res.status(400).send("payment failed");
          }
        }
      } catch (error) {
        console.log(error);
        return res.send("An error occured");
      }
    } else {
      return next(new AppError("No document found with that ID", 404));
    }
  } catch (err) {
    return res.status(400).json({ message: "Incomplete requirements" });
  }
  next();
});

exports.results = catchAsync(async (req, res, next) => {
  const result = await Contestant.find({}, "name votes").select("+votes");
  return res.status(200).json({
    status: "success",
    results: result.length,
    data: {
      data: result,
    },
  });

  next();
});
