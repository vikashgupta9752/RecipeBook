const express = require("express");
const router = express.Router();

const {
  sendContactMessage,
  getContactMessages,
} = require("../controllers/contactController");

const { protect } = require("../middleware/authMiddleware"); // ✅ FIX
const adminOnly = require("../middleware/adminMiddleware");

router.post("/", sendContactMessage);
router.get("/", protect, adminOnly, getContactMessages);

module.exports = router;
