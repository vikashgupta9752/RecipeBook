const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  message: String,
  rating: Number,
}, { timestamps: true });

module.exports = mongoose.model("Feedback", feedbackSchema);
