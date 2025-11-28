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

  // Auth nur einmal beim Client berechnen
  const [authStatus] = useState<null | boolean>(() => {
    if (!isClient) return null;
    return isLoggedIn();
  });

  const [user, setUser] = useState<{ displayName: string; email: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect
  useEffect(() => {
    if (!isClient) return;
    if (authStatus === false && !PUBLIC_ROUTES.includes(pathname)) {
      router.replace("/login");
    }
  }, [isClient, authStatus, pathname, router]);

  // User laden nach Login
  useEffect(() => {
    async function loadUser() {
      if (authStatus === true && !PUBLIC_ROUTES.includes(pathname)) {
        const u = await getCurrentUser();
        setUser(u);
      }
    }
    loadUser();
  }, [authStatus, pathname]);

  // Loading-State
  if (!isClient || authStatus === null) {
    return <div className="flex items-center justify-center h-screen">Lädt ...</div>;
  }

  function handleLogout() {
    logout();
    setUser(null);
    router.replace("/login");
  }

  // AUTH-PAGES → layout ohne html/body
  if (PUBLIC_ROUTES.includes(pathname)) {
    return (
      <div className="min-h-screen bg-white">
        <main>{children}</main>
      </div>
    );
  }

  // MAIN LAYOUT
  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row relative">

      {/* Mobile Hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white shadow rounded-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? "✖️" : "☰"}
      </button>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm md:hidden z-30"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static
          top-0 left-0
          h-full md:h-auto
          w-64 md:w-72
          bg-white shadow-sm
          transform transition-transform duration-300
          z-40
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          px-4 md:px-6 py-4 md:py-8
          flex flex-col justify-between
          border-r border-gray-200
        `}
      >
        {/* LOGO */}
        <div>
          <div className="flex items-center gap-3 mb-6 md:mb-10">
            <div className="p-3 rounded-2xl shadow bg-gradient-to-br from-blue-100 to-indigo-400 text-white text-3xl md:text-4xl">
              📖
            </div>
            <div>
              <h1 className="text-base md:text-lg font-bold">Zentralbibliothek</h1>
              <p className="text-xs md:text-sm text-gray-500">Universität Hohenheim</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            <Link
              href="/rooms"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 text-base md:text-xl tracking-wide"
            >
              🏫 <span>Alle Räume</span>
            </Link>

            <Link
              href="/my-bookings"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 text-base md:text-xl tracking-wide"
            >
              🗒 <span>Meine Buchungen</span>
            </Link>
          </nav>

          {/* Öffnungszeiten */}
          <div className="mt-6 md:mt-10">
            <h2 className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Öffnungszeiten
            </h2>

            <div className="mb-3">
              <div className="flex items-center gap-2 text-gray-700 font-medium text-sm md:text-base">
                🕒 Ausleihe & Räume
              </div>
              <p className="text-xs md:text-sm text-gray-600 ml-6 mt-1 leading-tight">
                Mo–Fr: 08:00 – 21:00 <br />
                Sa–So: 10:00 – 21:00
              </p>
            </div>

            <div className="mb-3">
              <div className="flex items-center gap-2 text-gray-700 font-medium text-sm md:text-base">
                📞 Auskunft
              </div>
              <p className="text-xs md:text-sm text-gray-600 ml-6 mt-1 leading-tight">
                Mo–Fr: 09:00 – 17:00 <br />
                Tel. 0711 / 459-22096
              </p>
            </div>

            <p className="text-[10px] md:text-xs text-gray-500 ml-1 mt-2">
              An gesetzlichen Feiertagen geschlossen
            </p>
          </div>
        </div>

        {/* PROFIL */}
        <div className="pt-4 border-t border-gray-200 mt-4 md:mt-6 md:border-t-0">
          {user ? (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-xl text-2xl md:text-3xl">👤</div>
                <div>
                  <p className="font-medium text-sm md:text-base">{user.displayName}</p>
                  <p className="text-xs md:text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm md:text-lg hover:underline text-red-600"
              >
                Abmelden
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-400">Lade Benutzer...</p>
          )}
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-4 md:p-10">{children}</main>
    </div>
  );
}
