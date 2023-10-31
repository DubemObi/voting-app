const multer = require("multer");
const sharp = require("sharp");
const cloudinary = require("../utils/cloudinary");
const Contestant = require("../models/contestant-model");
const factory = require("../controllers/handlerFactory");
const catchAsync = require("../utils/catchAsync");

const multerStorage = multer.memoryStorage();

const upload = multer({ storage: multerStorage });

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  const b64 = Buffer.from(req.file.buffer).toString("base64");
  let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
  const result = await cloudinary.uploader.upload(dataURI, {
    width: 500,
    height: 500,
    crop: "fill",
  });

  req.body.photo = result.url;
  req.body.cloudinary_id = result.public_id;
  next();
});

// exports.vote = catchAsync(async (req, res, next) => {
//   const update = req.user.votes + req.body.votes;
//   const doc = await Contestant.findByIdAndUpdate(req.params.id, update, {
//     new: true,
//     runValidators: true,
//   });

//   if (!doc) {
//     return next(new AppError("No document found with that ID", 404));
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       data: doc,
//     },
//   });
// });

exports.createContestant = factory.createOne(Contestant);
exports.getContestant = factory.getOne(Contestant);
exports.getAllContestants = factory.getAll(Contestant);

exports.updateContestant = factory.updateOne(Contestant); //Check vulnerability
exports.deleteContestant = factory.deleteOne(Contestant);
