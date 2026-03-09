const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");

const { protect } = require("../middleware/authMiddleware"); // ✅ FIX
const adminOnly = require("../middleware/adminMiddleware");

// GET all recipes
router.get("/recipes", protect, adminOnly, async (req, res) => {
  const recipes = await Recipe.find().populate("user", "username");
  res.json(recipes);
});

// DELETE recipe
router.delete("/recipes/:id", protect, adminOnly, async (req, res) => {
  await Recipe.findByIdAndDelete(req.params.id);
  res.json({ message: "Recipe deleted" });
});

// UPDATE recipe
router.put("/recipes/:id", protect, adminOnly, async (req, res) => {
  const updated = await Recipe.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

module.exports = router;
