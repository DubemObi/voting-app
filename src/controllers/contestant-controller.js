const multer = require("multer");
const sharp = require("sharp");
const Contestant = require("../models/contestant-model");
const factory = require("../controllers/handlerFactory");
const catchAsync = require("../utils/catchAsync");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

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
