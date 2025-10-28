import  {  useState } from "react";
import { login } from "../api/auth";

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ username, password });
      console.log("Login response:", res.data);
      onLogin(res.data);
      localStorage.setItem("access", res.data.access);

      // Try all possible locations for user ID
      if (res.data.user && res.data.user.id) {
        localStorage.setItem("userId", res.data.user.id);
      } else if (res.data.id) {
        localStorage.setItem("userId", res.data.id);
      } else if (res.data.customer && res.data.customer.id) {
        localStorage.setItem("userId", res.data.customer.id);
      } else {
        alert("User ID not found in login response.");
      }
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="username" className="form-label">
          Email address or Username
        </label>
        <input
          type="username"
          id="username"
          className="form-control"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter email or username"
          required
          autoComplete="username"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="password"
          id="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          autoComplete="current-password"
        />
      </div>
      <div className="mb-2 text-end">
        <a
          href="#"
          style={{ fontSize: 14, color: "#0d6efd", textDecoration: "none" }}
        >
          Forgotten your password?
        </a>
      </div>
      <button
        type="submit"
        className="btn w-100 mb-3"
        style={{ background: "#f19e04ff" }}
      >
        Sign in
      </button>
    </form>
  );
}
