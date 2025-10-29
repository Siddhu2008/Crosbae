import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";
import { login as loginAPI, googleLogin as googleLoginAPI, logout as logoutAPI } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user
  useEffect(() => {
    const initUser = async () => {
      const token = localStorage.getItem("access");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get("/api/auth/me/");
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };
    initUser();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await loginAPI(credentials);
      setUser(res.user_data || null);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (token) => {
    setLoading(true);
    try {
      const res = await googleLoginAPI(token);
      setUser(res.data.user_data || null);
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutAPI();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, loginWithGoogle, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
