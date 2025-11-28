"use client";

import "./globals.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isLoggedIn, getCurrentUser, logout } from "@/lib/auth";

const PUBLIC_ROUTES = ["/", "/login", "/register"];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const isClient = typeof window !== "undefined";

  // ⭐ AuthStatus OHNE useEffect berechnen (kein Fehler möglich)
  const authStatus = isClient ? isLoggedIn() : null;

  const [user, setUser] =
    useState<{ displayName: string; email: string } | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // -------------------------------------------
  // Redirect NUR wenn clientseitig
  // -------------------------------------------
  useEffect(() => {
    if (!isClient) return;

    if (authStatus === false && !PUBLIC_ROUTES.includes(pathname)) {
      router.replace("/login");
    }
  }, [isClient, authStatus, pathname, router]);

  // -------------------------------------------
  // User laden, wenn eingeloggt
  // -------------------------------------------
  useEffect(() => {
    async function load() {
      if (authStatus === true) {
        const u = await getCurrentUser();
        setUser(u);
      }
    }
    load();
  }, [authStatus]);

  // -------------------------------------------
  // Loading Screen
  // -------------------------------------------
  if (!isClient || authStatus === null) {
    return (
      <html lang="de">
        <body className="flex items-center justify-center h-screen">
          Lädt...
        </body>
      </html>
    );
  }

  function handleLogout() {
    logout();
    setUser(null);
    router.replace("/login");
  }

  // -------------------------------------------
  // Seiten ohne Sidebar
  // -------------------------------------------
  if (PUBLIC_ROUTES.includes(pathname)) {
    return (
      <html lang="de">
        <body>
          <main>{children}</main>
        </body>
      </html>
    );
  }

  // -------------------------------------------
  // Seiten MIT Sidebar
  // -------------------------------------------
  return (
    <html lang="de">
      <body className="flex min-h-screen bg-white md:flex-row flex-col relative">

        {/* Mobile Menu Button */}
        <button
          className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white shadow rounded-lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "✖️" : "☰"}
        </button>

        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-30"
          ></div>
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed md:static top-0 left-0 h-full md:h-auto w-64 md:w-72
            bg-white shadow
            transform transition-transform duration-300 z-40
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            px-6 py-8 flex flex-col justify-between
          `}
        >
          {/* Logo */}
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-400 text-white text-4xl shadow">
                📖
              </div>
              <div>
                <h1 className="text-lg font-bold">Zentralbibliothek</h1>
                <p className="text-sm text-gray-500">Universität Hohenheim</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2">
              <Link
                href="/rooms"
                className="px-3 py-2 rounded-lg hover:bg-blue-50 text-xl"
                onClick={() => setSidebarOpen(false)}
              >
                🏫 Alle Räume
              </Link>

              <Link
                href="/my-bookings"
                className="px-3 py-2 rounded-lg hover:bg-blue-50 text-xl"
                onClick={() => setSidebarOpen(false)}
              >
                🗒 Meine Buchungen
              </Link>
            </nav>
          </div>

          {/* User */}
          <div className="pt-4 border-t border-gray-200">
            {user ? (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-xl text-3xl">👤</div>
                  <div>
                    <p className="font-medium">{user.displayName}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:underline text-lg"
                >
                  Abmelden
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Lade Benutzer...</p>
            )}
          </div>
        </aside>

        <main className="flex-1 p-10">{children}</main>
      </body>
    </html>
  );
}
