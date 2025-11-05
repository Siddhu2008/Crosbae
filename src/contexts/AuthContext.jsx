import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api"; // axios instance with interceptors
import {
  login as loginAPI,
  googleLogin as googleLoginAPI,
  logout as logoutAPI,
} from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Check and load current user on app start
  useEffect(() => {
    const initUser = async () => {
      const access = localStorage.getItem("access");
      if (!access) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/me/");
        setUser(res.data);
      } catch (err) {
        console.error("Auth check failed:", err);
        handleLogout(); 
      } finally {
        setLoading(false);
      }
    };

    initUser();
  }, []);

  // 🔹 Login with credentials
  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await loginAPI(credentials);
      setUser(res.user_data || null);
      return res;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Google Login
  const loginWithGoogle = async (token) => {
    setLoading(true);
    try {
      const res = await googleLoginAPI(token);
      setUser(res.data.user_data || null);
      return res.data;
    } catch (error) {
      console.error("Google login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Logout
  const handleLogout = () => {
    logoutAPI(); // clears tokens + redirects (handled in auth.js)
    setUser(null);
  };

  // 🔹 Fetch helper that attaches Authorization header for fetch-based calls
  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem("access");
    const headers = { ...(options.headers || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;
    const opts = { ...options, headers };
    return fetch(url, opts);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        fetchWithAuth,
        loginWithGoogle,
        logout: handleLogout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
