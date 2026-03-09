import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("Password is required");
      return;
    }

    try {
      setLoading(true);

      await api.post(`/auth/reset-password/${token}`, { password });

      alert("Password reset successful");
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid or expired link"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="bg-white p-6 rounded-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Reset Password
        </h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <input
          type="password"
          placeholder="New Password"
          className="w-full p-2 border mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white py-2 rounded"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
