const mongoose = require("mongoose");

const contestantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the name!"],
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  category: {
    type: String,
    required: [true, "Please enter the category!"],
  },
  votes: {
    type: Number,
    default: 0,
    select: false,
  },
  cloudinary_id: String,
});

const user = mongoose.model("Contestant", contestantSchema);
module.exports = user;
