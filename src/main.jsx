// src/index.js (Example)
import React from "react";
import ReactDOM from "react-dom/client";
import "./main.css"; // Your custom styles
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS
import "bootstrap-icons/font/bootstrap-icons.css"; // Bootstrap Icons CSS
import "@fortawesome/fontawesome-free/css/all.min.css";

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
