// /lib/auth.ts

export function saveToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}

export async function getCurrentUser() {
  const token = getToken();
  if (!token) return null;

  const res = await fetch("http://localhost:4000/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return null;

  return await res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch("http://localhost:4000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Login fehlgeschlagen");
  }

  saveToken(data.token);
  return data;
}

export async function register(email: string, password: string, displayName: string) {
  const res = await fetch("http://localhost:4000/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, displayName }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Registrierung fehlgeschlagen");
  }

  saveToken(data.token);
  return data;
}
