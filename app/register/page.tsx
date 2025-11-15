"use client";

import { useState } from "react";
import { register } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleRegister() {
    try {
      await register(email, password, displayName);
      router.push("/rooms");
    } catch {
      setError("Registrierung fehlgeschlagen");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-3xl font-bold">Registrieren</h1>

      {error && <p className="text-red-600">{error}</p>}

      <input className="border p-2 rounded w-80"
             placeholder="Name"
             value={displayName}
             onChange={(e) => setDisplayName(e.target.value)} />

      <input className="border p-2 rounded w-80"
             placeholder="Uni-Hohenheim E-Mail"
             value={email}
             onChange={(e) => setEmail(e.target.value)} />

      <input className="border p-2 rounded w-80"
             placeholder="Passwort"
             type="password"
             value={password}
             onChange={(e) => setPassword(e.target.value)} />

      <button onClick={handleRegister}
              className="bg-blue-600 text-white px-5 py-2 rounded">
        Registrieren
      </button>

      <a href="/login" className="text-blue-600">Schon ein Konto?</a>
    </div>
  );
}
