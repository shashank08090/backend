const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  question: String,
  likedBy: [],
  dislikedBy: [],
});

module.exports = mongoose.model("likes", likeSchema);
