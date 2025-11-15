"use client";

import { useState } from "react";
import { registerUser, login } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");

  async function handleRegister() {
    try {
      setError("");
      await registerUser(email, password, displayName);
      await login(email, password);
      router.push("/rooms");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unbekannter Fehler");
      }
    }
  }

  return (
    <div className="p-10 w-full max-w-md mx-auto mt-20 bg-white rounded-3xl shadow-xl border border-slate-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Registrieren</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      <label>Vor- & Nachname</label>
      <input
        className="w-full border rounded px-3 py-2 mb-4"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />

      <label>Uni E-Mail</label>
      <input
        className="w-full border rounded px-3 py-2 mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label>Passwort</label>
      <input
        type="password"
        className="w-full border rounded px-3 py-2 mb-6"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleRegister}
        className="w-full bg-indigo-600 text-white py-2 rounded-xl"
      >
        Registrieren
      </button>

      <p className="text-center mt-4 text-sm">
        Schon ein Konto?{" "}
        <a href="/login" className="text-blue-600 underline">
          Login →
        </a>
      </p>
    </div>
  );
}
