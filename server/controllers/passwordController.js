const crypto = require("crypto");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

/* ============================
   FORGOT PASSWORD
============================ */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    // 🔐 Do not reveal whether user exists
    if (!user) {
      return res.status(200).json({
        message: "If an account exists, a reset link has been sent",
      });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const message = `
You requested a password reset.

Click the link below to reset your password:
${resetUrl}

This link will expire in 15 minutes.
If you did not request this, please ignore this email.
`;

    await sendEmail(user.email, "Password Reset Request", message);

    res.status(200).json({
      message: "Password reset link sent to email",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   RESET PASSWORD
============================ */
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // ✅ Plain password (User model hashes it)
    user.password = password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // 🔥 IMPORTANT FIX
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  forgotPassword,
  resetPassword,
};
