const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  verifyEmail,
  changePassword,
} = require("../controllers/authController");

const {
  forgotPassword,
  resetPassword,
} = require("../controllers/passwordController");

const { protect } = require("../middleware/authMiddleware");

/* ======================
   NORMAL AUTH
====================== */
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.post("/verify-email", verifyEmail);
router.put("/change-password", protect, changePassword);

/* ======================
   PASSWORD
====================== */
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

/* ======================
   🔥 GOOGLE OAUTH
====================== */

// STEP 1: Redirect to Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// STEP 2: Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  (req, res) => {
    // Generate JWT
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Redirect to frontend with token
    res.redirect(
      `${process.env.CLIENT_URL}/oauth-success?token=${token}`
    );
  }
);

module.exports = router;
