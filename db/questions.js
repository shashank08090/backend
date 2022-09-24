const mongoose = require("mongoose");
const questionSchema = new mongoose.Schema({
  name: String,
  question: String,
});
questionSchema.index({ name: "text" });
module.exports = mongoose.model("question", questionSchema);
