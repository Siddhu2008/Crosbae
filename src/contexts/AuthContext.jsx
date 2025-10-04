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
        "token": googleToken,
      });
      
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      setUser(res.data.user_data); 
      return true;
    } catch (err) {
      console.error("Google auth failed:", err);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
