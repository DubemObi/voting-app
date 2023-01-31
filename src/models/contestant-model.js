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
    select: false,
  },
});

const user = mongoose.model("Contestant", contestantSchema);
module.exports = user;
