"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { saveAuth } from "@/lib/auth";

const API = "http://localhost:4000";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();

  const redirect = params.get("redirect") || "/rooms";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Login fehlgeschlagen");
      return;
    }

    saveAuth(data.userId, data.token);

    router.push(redirect);
  }

  return (
    <div>
      <h1>Einloggen</h1>
      <form onSubmit={handleLogin}>
        <label>E-Mail</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Passwort</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="submit">Einloggen</button>
      </form>

      <p>Noch kein Konto? <a href={`/register?redirect=${redirect}`}>Registrieren</a></p>
    </div>
  );
}
