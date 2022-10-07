const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  question: String,
  likedBy: [],
});

module.exports = mongoose.model("likes", likeSchema);
