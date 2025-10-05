// src/contexts/AuthContext.jsx
import { createContext, useContext, useState } from "react";
import axios from "axios";
import API_URL from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const loginWithGoogle = async (googleToken) => {
    try {
      // const res = await axios.post("http://127.0.0.1:8000/api/auth/google/", {
      const res = await axios.post(API_URL + "/api/auth/google/", {
        token: googleToken,
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      setUser(res.data.user_data);
      // return full response data so callers can act on tokens/user
      return res.data;
    } catch (err) {
      console.error("Google auth failed:", err);
      return null;
    }
  };

  const logout = () => {
    // Clear tokens and user state
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
    // Optionally: navigate or trigger other cleanup in callers
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
