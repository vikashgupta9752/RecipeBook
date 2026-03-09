import { createContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Load user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // 📝 REGISTER
  const register = async (userData) => {
    const response = await api.post("/auth/register", userData);
    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
      setUser(response.data);
    }
    return response.data;
  };

  // 🔐 LOGIN
  const login = async (userData) => {
    const response = await api.post("/auth/login", userData);
    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
      setUser(response.data);
    }
    return response.data;
  };

  // ✅ GOOGLE / OAUTH LOGIN HANDLER (THIS WAS MISSING)
  const setUserFromToken = async (token) => {
    // Option 1 (BEST): ask backend for user using token
    const response = await api.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userData = {
      ...response.data,
      token,
    };

    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // 🔄 UPDATE USER
  const updateUser = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // 🔑 FORGOT PASSWORD
  const forgotPassword = async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  };

  // 🔁 RESET PASSWORD
  const resetPassword = async (token, password) => {
    const response = await api.post(`/auth/reset-password/${token}`, {
      password,
    });
    return response.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        updateUser,
        forgotPassword,
        resetPassword,
        setUserFromToken, // ✅ NOW AVAILABLE
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
