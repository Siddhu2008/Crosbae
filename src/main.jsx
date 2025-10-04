import React from "react";
import ReactDOM from "react-dom/client";
import "./main.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { CategoryProvider } from "./contexts/CategoryContext";
import AppProvider from "./contexts/AppProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <AppProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </AppProvider>
  </AuthProvider>
);
