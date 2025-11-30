"use client";

import { useState } from "react";
import { login } from "@/lib/auth";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ----------------------------------------------------
  // LOGIN HANDLER
  // ----------------------------------------------------
  async function handleLogin() {
    setError("");
    setLoading(true);

    const result = await login(email, password);

    if (!result.ok) {
      if (result.data.error === "Benutzer existiert nicht") {
        setError("Es existiert kein Konto mit dieser E-Mail.");
      } else if (result.data.error === "Falsches Passwort") {
        setError("Das eingegebene Passwort ist falsch.");
      } else {
        setError("Login fehlgeschlagen.");
      }

      setLoading(false);
      return;
    }

    router.push("/rooms");
  }

  // ----------------------------------------------------
  // UI
  // ----------------------------------------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
      <div className="bg-white shadow-xl border border-slate-200 rounded-3xl p-10 w-full max-w-md">

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Anmelden</h1>
          <p className="text-slate-500 mt-2">Willkommen zurück 👋</p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="flex items-start gap-2 mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
            <AlertCircle className="w-5 h-5 mt-0.5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* FORM */}
        <div className="space-y-6">

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium text-slate-800">E-Mail</label>
            <div className="mt-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                placeholder="Uni-Hohenheim E-Mail"
                className="w-full h-12 rounded-xl border border-slate-300 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* PASSWORT */}
          <div>
            <label className="text-sm font-medium text-slate-800">Passwort</label>

            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Passwort"
                className="w-full h-12 rounded-xl border border-slate-300 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* TOGGLE VISIBILITY */}
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

        </div>

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`mt-8 w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow transition ${
            loading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"
          }`}
        >
          {loading ? "Wird geprüft…" : "Einloggen"}
        </button>

        {/* REGISTER LINK */}
        <p className="text-center mt-6 text-sm text-slate-600">
          Noch kein Konto?{" "}
          <a
            href="/register"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Jetzt registrieren →
          </a>
        </p>
      </div>
    </div>
  );
}
