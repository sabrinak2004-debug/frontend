"use client";

import { useState } from "react";
import { login } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    try {
      await login(email, password);
      router.push("/rooms");
    } catch {
      setError("Login fehlgeschlagen");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-3xl font-bold">Login</h1>

      {error && <p className="text-red-600">{error}</p>}

      <input className="border p-2 rounded w-80"
             placeholder="E-Mail"
             value={email}
             onChange={(e) => setEmail(e.target.value)} />

      <input className="border p-2 rounded w-80"
             placeholder="Passwort"
             type="password"
             value={password}
             onChange={(e) => setPassword(e.target.value)} />

      <button onClick={handleLogin}
              className="bg-blue-600 text-white px-5 py-2 rounded">
        Login
      </button>

      <a href="/register" className="text-blue-600">Noch kein Konto?</a>
    </div>
  );
}
