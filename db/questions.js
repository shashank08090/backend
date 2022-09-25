const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  name: String,
  question: [],
});

questionSchema.index({ name: "text" });
module.exports = mongoose.model("question", questionSchema);
