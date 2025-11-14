"use client";

import { useState } from "react";
import { loginUser } from "@/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = await loginUser(email, password);

    if (data.error) {
      setMsg(data.error);
      return;
    }
        
    document.cookie = `token=${data.token}; path=/; max-age=604800`; 

    localStorage.setItem("userId", data.userId);

    setMsg("Login erfolgreich!");
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Uni E-Mail" value={email}
               onChange={(e) => setEmail(e.target.value)} />

        <input type="password" placeholder="Passwort" value={password}
               onChange={(e) => setPassword(e.target.value)} />

        <button type="submit">Login</button>
      </form>

      <p>{msg}</p>
    </div>
  );
}
