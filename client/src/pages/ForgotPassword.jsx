import { useState } from "react";
import api from "../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Email is required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/forgot-password", { email });

      setMessage("Password reset link sent to your email");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send reset link"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="bg-white p-6 rounded-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Forgot Password
        </h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}
        {message && <p className="text-green-600 mb-3">{message}</p>}

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-2 border mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white py-2 rounded"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
