"use client";

import { useState } from "react";
import { register } from "@/lib/auth";
import { useRouter } from "next/navigation";

import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 NEU: State für Datenschutz-Popup
  const [showPrivacy, setShowPrivacy] = useState(false);

  async function handleRegister() {
    setError("");
    setLoading(true);

    try {
      await register(email, password, name);
      router.push("/rooms");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Registrierung fehlgeschlagen.";
      setError(errorMessage);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
      <div className="bg-white shadow-xl border border-slate-200 rounded-3xl p-10 w-full max-w-md">

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 mb-4">
            <User className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Registrieren</h1>
          <p className="text-slate-500 mt-2">Neues Konto erstellen</p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="flex items-start gap-2 mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
            <AlertCircle className="w-5 h-5 mt-0.5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* FORM */}
        <div className="space-y-6">

          {/* NAME */}
          <div>
            <label className="text-sm font-medium text-slate-800">Name</label>
            <div className="mt-1 relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Vor- und Nachname"
                className="w-full h-12 rounded-xl border border-slate-300 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

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

          {/* PASSWORD */}
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

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className={`mt-8 w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow transition ${
            loading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"
          }`}
        >
          {loading ? "Wird erstellt…" : "Registrieren"}
        </button>

        {/* DATENSCHUTZHINWEIS + POPUP-TRIGGER */}
        <p className="text-sm text-gray-500 mt-4">
          Mit der Registrierung erkläre ich mich mit der Verarbeitung meiner
          personenbezogenen Daten zum Zweck der Raumbuchung einverstanden.
          Weitere Informationen finde ich in der{" "}
          <button
            type="button"
            onClick={() => setShowPrivacy(true)}
            className="underline hover:text-gray-700"
          >
            Datenschutzerklärung
          </button>.
        </p>

        {/* LINK LOGIN */}
        <p className="text-center mt-6 text-sm text-slate-600">
          Schon ein Konto?{" "}
          <a
            href="/login"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Jetzt einloggen →
          </a>
        </p>
      </div>

      {/* 🔽 DATENSCHUTZ MODAL */}
      {showPrivacy && (
        <DatenschutzModal onClose={() => setShowPrivacy(false)} />
      )}
    </div>
  );
}

/* ============================================================
   DATENSCHUTZ MODAL
   ============================================================ */
function DatenschutzModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white max-w-3xl w-full max-h-[80vh] overflow-y-auto rounded-2xl p-6 relative">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4">Datenschutzerklärung</h2>

     <p className="mb-4">
        Verantwortlich für die Datenverarbeitung auf dieser Website ist:
      </p>

        <p className="mb-4">
          <strong>Sabrina Klausmeier</strong><br />
          E-Mail: sabrinak2004@gmx.de
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          Zweck der Datenverarbeitung
        </h2>
        <p className="mb-4">
          Diese Webanwendung dient der Buchung von Gruppenarbeitsräumen für
          Studierende der Universität Hohenheim.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          Verarbeitete Daten
        </h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Benutzername</li>
          <li>Universitäts-E-Mail-Adresse</li>
          <li>Passwort (verschlüsselt / gehasht)</li>
          <li>Rolle (z. B. Student oder Administrator)</li>
          <li>Buchungsdaten (Raum, Datum, Uhrzeit, Status)</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          Rechte der betroffenen Personen
        </h2>
        <p className="mb-4">
          Nutzer haben das Recht auf Auskunft, Berichtigung, Löschung sowie
          Einschränkung der Verarbeitung ihrer personenbezogenen Daten gemäß DSGVO.
        </p>
        <p className="text-sm text-slate-500 mt-6">
          Stand: {new Date().toLocaleDateString("de-DE")}
        </p>
      </div>
    </div>
  );
}
