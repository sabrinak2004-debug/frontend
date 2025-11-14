"use client";

export function saveAuth(userId: string, token: string) {
  localStorage.setItem("auth_userId", userId);
  localStorage.setItem("auth_token", token);
}

export function getAuth() {
  const userId = typeof window !== "undefined" ? localStorage.getItem("auth_userId") : null;
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  if (!userId || !token) return null;

  return { userId, token };
}

export function logout() {
  localStorage.removeItem("auth_userId");
  localStorage.removeItem("auth_token");
}
export async function registerUser(displayName: string, email: string, password: string) {
  const res = await fetch("http://localhost:4000/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ displayName, email, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Registrierung fehlgeschlagen");
  }

  return data;
}
