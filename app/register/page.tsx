"use client";

import { useState } from "react";
import { registerUser } from "@/lib/auth";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [msg, setMsg] = useState("");

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = await registerUser(email, password, displayName);

    if (data.error) setMsg(data.error);
    else setMsg("Registrierung erfolgreich!");
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Registrieren</h1>

      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Name" value={displayName}
               onChange={(e) => setDisplayName(e.target.value)} />

        <input type="email" placeholder="Uni E-Mail" value={email}
               onChange={(e) => setEmail(e.target.value)} />

        <input type="password" placeholder="Passwort" value={password}
               onChange={(e) => setPassword(e.target.value)} />

        <button type="submit">Registrieren</button>
      </form>

      <p>{msg}</p>
    </div>
  );
}
