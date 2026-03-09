import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { ChefHat } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("prefer_not_to_say");

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  /* ======================
     REGISTER (EMAIL/PASS)
  ====================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

    if (!passwordRegex.test(password)) {
      alert(
        "Password must be at least 8 characters long and contain 1 number & 1 symbol."
      );
      return;
    }

    try {
      await register({ username, email, password, gender });
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  /* ======================
     GOOGLE REGISTER
  ====================== */
  const handleGoogleRegister = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 dark:bg-stone-950 px-4">
      <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl shadow-lg w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 text-orange-600 font-bold text-2xl mb-8">
          <ChefHat size={32} />
          <span>CookBook</span>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Account
        </h2>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl border"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl border"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Min 8 chars, 1 number, 1 symbol"
              className="w-full px-4 py-2 rounded-xl border"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600"
          >
            Register
          </button>
        </form>

        {/* OR Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-sm text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Google Register */}
        <button
          type="button"
          onClick={handleGoogleRegister}
          className="w-full flex items-center justify-center gap-3 border py-3 rounded-xl hover:bg-stone-50"
        >
          <FcGoogle size={22} />
          Continue with Google
        </button>

        <p className="mt-5 text-center text-stone-600">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-600 font-bold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
