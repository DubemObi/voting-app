const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  contestant: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Contestant",
  },
  votes: {
    type: Number,
    required: [true, "Please enter the number of votes"],
  },
});

const user = mongoose.model("Vote", voteSchema);
module.exports = user;
