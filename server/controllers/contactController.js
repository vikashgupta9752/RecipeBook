const Contact = require("../models/contactMessage");
const sendEmail = require("../utils/sendEmail");

// USER: submit contact message
const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Save to DB
    await Contact.create({ name, email, message });

    // Email to admin
    const adminMessage = `
New Contact Us Message

Name: ${name}
Email: ${email}

Message:
${message}
    `;

    await sendEmail(
      process.env.FROM_EMAIL,
      "📩 New Contact Us Message",
      adminMessage
    );

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("CONTACT ERROR:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
};

// ADMIN: view all messages
const getContactMessages = async (req, res) => {
  const messages = await Contact.find().sort({ createdAt: -1 });
  res.json(messages);
};

module.exports = {
  sendContactMessage,
  getContactMessages,
};
