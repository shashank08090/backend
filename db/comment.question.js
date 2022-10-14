const mongoose = require("mongoose");

const questioncommentSchema = new mongoose.Schema({
  question: String,
  comment: String,
  commentedBy: String,
});

module.exports = mongoose.model("commentonquestion", questioncommentSchema);
