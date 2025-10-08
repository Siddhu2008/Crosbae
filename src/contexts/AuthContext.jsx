// src/contexts/AuthContext.jsx
import { createContext, useContext, useState } from "react";
import axios from "axios";
import API_URL from "../api/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const loginWithGoogle = async (googleToken) => {
    try {
      const res = await axios.post(API_URL + "/api/auth/google/", {
        token: googleToken,
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      if (res.data.user_data && res.data.user_data.email) {
        localStorage.setItem("userEmail", res.data.user_data.email);
      }
      setUser(res.data.user_data);
      return res.data;
    } catch (err) {
      console.error("Google auth failed:", err);
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  };

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refresh");
    if (!refreshToken) throw new Error("No refresh token found");

    const response = await fetch(API_URL + "/api/auth/token/refresh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    localStorage.setItem("access", data.access);
    return data.access;
  };

  const fetchWithAuth = async (url, options = {}) => {
    let accessToken = localStorage.getItem("access");

    options.headers = {
      ...(options.headers || {}),
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    let response = await fetch(url, options);

    if (response.status === 401) {
      // Token expired, try refresh
      try {
        accessToken = await refreshAccessToken();
        options.headers.Authorization = `Bearer ${accessToken}`;
        response = await fetch(url, options);
      } catch (err) {
        logout();
        throw new Error("Authentication failed. Please login again.");
      }
    }

    return response;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loginWithGoogle,
        logout,
        fetchWithAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
