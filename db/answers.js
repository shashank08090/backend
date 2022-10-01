const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  question: String,
  answer: [],
});

answerSchema.index({ name: "text" });
module.exports = mongoose.model("answer", answerSchema);
