"use client";

import { useState } from "react";
import { register } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleRegister() {
    try {
      await register(email, password, name);
      router.push("/rooms");
    } catch {
      setError("❌ Registrierung fehlgeschlagen");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
      <div className="bg-white shadow-xl border border-slate-200 rounded-3xl p-10 w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 text-2xl mb-3">
            📝
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Registrieren</h1>
          <p className="text-slate-500 mt-2">Neues Konto erstellen</p>
        </div>

        {error && (
          <div className="mb-4 text-red-600 bg-red-50 border border-red-200 rounded-xl p-3 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Inputs */}
        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-700">Name</label>
            <input
              placeholder="Vor- und Nachname"
              className="mt-1 w-full h-12 px-4 border rounded-xl border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">E-Mail</label>
            <input
              type="email"
              placeholder="Uni-Hohenheim E-Mail"
              className="mt-1 w-full h-12 px-4 border rounded-xl border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Passwort</label>
            <input
              type="password"
              placeholder="Passwort"
              className="mt-1 w-full h-12 px-4 border rounded-xl border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleRegister}
          className="mt-8 w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow hover:opacity-90 transition"
        >
          Registrieren
        </button>

        {/* Link */}
        <p className="text-center mt-6 text-sm text-slate-600">
          Schon ein Konto?{" "}
          <a href="/login" className="text-indigo-600 font-semibold hover:underline">
            Jetzt einloggen →
          </a>
        </p>
      </div>
    </div>
  );
}
