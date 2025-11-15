"use client";

export async function login(email: string, password: string) {
  const res = await fetch("http://localhost:4000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Login failed");

  // JWT speichern
  localStorage.setItem("token", data.token);
  localStorage.setItem("userId", data.userId);

  return data;
}

export async function registerUser(
  email: string,
  password: string,
  displayName: string
) {
  const res = await fetch("http://localhost:4000/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, displayName }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Registrierung fehlgeschlagen");

  return data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
}

export function isLoggedIn(): boolean {
  return !!localStorage.getItem("token");
}
