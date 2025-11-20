// frontend/src/Login.jsx
import { useState } from "react";
import BASE_URL from "./api/api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async () => {
    setMsg("Logging in...");

    // FastAPI /token expects x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const res = await fetch(`${BASE_URL}/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      const data = await res.json();
      console.log("Token response:", data);

      if (res.ok && data.access_token) {
        localStorage.setItem("token", data.access_token);
        setMsg("Login successful! Token saved.");
      } else {
        setMsg(data.detail || "Login failed");
      }
    } catch (err) {
      console.error("Network error:", err);
      setMsg("Network or server error");
    }
  };

  return (
    <div style={{ maxWidth: 320, margin: "80px auto", display: "flex", flexDirection: "column", gap: 10 }}>
      <h2>Login</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>

      {msg && <p>{msg}</p>}
    </div>
  );
}

export default Login;
