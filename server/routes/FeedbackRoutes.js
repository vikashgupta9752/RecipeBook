const express = require("express");
const router = express.Router();
const Feedback = require("../models/feedback");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

// submit feedback (user)
router.post("/", protect, async (req, res) => {
  const feedback = await Feedback.create({
    user: req.user._id,
    message: req.body.message,
    rating: req.body.rating,
  });
  res.status(201).json(feedback);
});

// view feedback (admin)
router.get("/", protect, adminOnly, async (req, res) => {
  const data = await Feedback.find().populate("user", "username");
  res.json(data);
});

// delete feedback (admin)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    await feedback.deleteOne();
    res.json({ message: "Feedback deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
