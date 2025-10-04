import  {  useState } from "react";
import { login } from "../api/auth";

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ username, password });
      onLogin(res.data);
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
