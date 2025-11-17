// /lib/auth.ts
const API = process.env.NEXT_PUBLIC_API_URL!;

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

export function getUserId(): string | null {
  const token = getToken();
  if (!token) return null;

  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.userId || null;
}


export async function getCurrentUser() {
  const token = getToken();
  if (!token) return null;

  const res = await fetch(`${API}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return null;

  return await res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API}//auth/login`, {
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
  const res = await fetch(`${API}//auth/register`, {
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
