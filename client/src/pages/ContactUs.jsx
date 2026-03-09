import React, { useState } from "react";
import api from "../services/api";

const ContactUs = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      await api.post("/contact", form);

      alert("Message sent successfully! We’ll get back to you soon.");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send message. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 px-6 py-10">
      <div className="max-w-5xl mx-auto bg-white dark:bg-stone-900 rounded-3xl shadow-lg p-8">

        {/* Header */}
        <h1 className="text-3xl font-bold text-orange-500 mb-2">
          Contact Us
        </h1>
        <p className="text-stone-600 dark:text-stone-400 mb-8">
          We’d love to hear from you! Whether you have a question, feedback, or suggestion.
        </p>

        <div className="grid md:grid-cols-2 gap-10">

          {/* Contact Info */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>

            <p className="text-stone-600 dark:text-stone-400 mb-4">
              CookBook is your personal recipe companion. If you face any issues
              or have ideas to improve the platform, feel free to reach out.
            </p>

            <div className="space-y-3 text-stone-700 dark:text-stone-300">
              <p><strong>Email:</strong> vikashgupta67429@gmail.com</p>
              <p><strong>Phone:</strong> +91 93998 99184</p>
              <p><strong>Address:</strong> Indore, Madhya Pradesh, India</p>
              <p><strong>Support Hours:</strong> Mon – Sat, 10:00 AM – 6:00 PM</p>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold mb-2">Send a Message</h2>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-xl border outline-none dark:bg-stone-800"
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-xl border outline-none dark:bg-stone-800"
            />

            <textarea
              name="message"
              placeholder="Your Message"
              rows="4"
              value={form.message}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-xl border outline-none dark:bg-stone-800"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-xl disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
