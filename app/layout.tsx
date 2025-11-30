"use client";

import "./globals.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { isLoggedIn, getCurrentUser, logout } from "@/lib/auth";

const PUBLIC_ROUTES = ["/", "/login", "/register"];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] =
    useState<{ displayName: string; email: string } | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAuthPage = PUBLIC_ROUTES.includes(pathname);

  // -----------------------------------------------
  // AUTH REDIRECT
  // -----------------------------------------------
  const checkAuth = useCallback(() => {
    if (!PUBLIC_ROUTES.includes(pathname) && !isLoggedIn()) {
      router.replace("/login");
    }
  }, [pathname, router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // -----------------------------------------------
  // USER LADEN
  // -----------------------------------------------
  useEffect(() => {
    async function loadUser() {
      if (!PUBLIC_ROUTES.includes(pathname) && isLoggedIn()) {
        const u = await getCurrentUser();
        setUser(u);
      }
    }
    loadUser();
  }, [pathname]);

  function handleLogout() {
    logout();
    setUser(null);
    router.replace("/login");
  }

  // -----------------------------------------------
  // LOGIN / REGISTER LAYOUT OHNE SIDEBAR
  // -----------------------------------------------
  if (isAuthPage) {
    return (
      <html lang="de">
        <head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1"
          />
          <title>Hohenheim Gruppenräume</title>
        </head>
        <body className="bg-white min-h-screen">
          <main>{children}</main>
        </body>
      </html>
    );
  }

  // -----------------------------------------------
  // HAUPT-LAYOUT MIT SIDEBAR
  // -----------------------------------------------
  return (
    <html lang="de">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <title>Hohenheim Gruppenräume</title>
      </head>

      <body className="bg-white min-h-screen flex flex-col md:flex-row relative">

        {/* Hamburger Button (nur mobil) */}
        <button
          className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white shadow rounded-lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "✖️" : "☰"}
        </button>

        {/* Overlay (mobil) */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-white/40 backdrop-blur-sm md:hidden z-30"
          ></div>
        )}

        {/* SIDEBAR */}
        <aside
  className={`
    fixed md:static
    top-0 left-0
    h-full md:h-auto
    w-64 md:w-72
    bg-white
    transform transition-transform duration-300
    z-40
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
    px-6 py-8 flex flex-col justify-between

    /* ⭐ feiner rechter Rand */
    border-r border-gray-200

    /* ⭐ kein Shadow */
    shadow-none
  `}
>
  {/* OBERER BEREICH */}
  <div>

    {/* LOGO */}
    <div className="flex items-center gap-3 mb-10">
      <div className="p-3 rounded-2xl bg-blue-100 text-blue-600 text-3xl">
        📚
      </div>
      <div>
        <h1 className="text-lg font-semibold text-gray-900">
          Zentralbibliothek
        </h1>
        <p className="text-sm text-gray-500">Universität Hohenheim</p>
      </div>
    </div>

    {/* NAVIGATION */}
    <nav className="flex flex-col gap-1">
      <Link
        href="/rooms"
        onClick={() => setSidebarOpen(false)}
        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-base
          ${pathname === "/rooms"
            ? "bg-blue-50 text-blue-600"
            : "text-gray-700 hover:bg-gray-50"}
        `}
      >
        🏫 <span>Alle Räume</span>
      </Link>

      <Link
        href="/my-bookings"
        onClick={() => setSidebarOpen(false)}
        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-base
          ${pathname === "/my-bookings"
            ? "bg-blue-50 text-blue-600"
            : "text-gray-700 hover:bg-gray-50"}
        `}
      >
        🗒 <span>Meine Buchungen</span>
      </Link>
    </nav>

    {/* ÖFFNUNGSZEITEN */}
    <div className="mt-10">
      <h2 className="text-xs font-semibold text-gray-400 uppercase mb-2">
        Öffnungszeiten
      </h2>

      <div className="mb-4">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          🕒 <span>Ausleihe & Räume</span>
        </div>
        <p className="text-sm text-gray-500 ml-7 mt-1 leading-tight">
          Mo–Fr: 08:00 – 21:00 <br />
          Sa–So: 10:00 – 21:00
        </p>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          📞 <span>Auskunft</span>
        </div>
        <p className="text-sm text-gray-500 ml-7 mt-1 leading-tight">
          Mo–Fr: 09:00 – 17:00 <br />
          Tel. 0711 / 459-22096
        </p>
      </div>

      <p className="text-xs text-gray-400 ml-1">
        An gesetzlichen Feiertagen geschlossen
      </p>
    </div>
  </div>

  {/* USER BEREICH UNTEN */}
  <div className="pt-4 border-t border-gray-200 mt-8">
    {user ? (
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-xl text-3xl">
          👤
        </div>
        <div>
          <p className="font-medium text-gray-800">{user.displayName}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>
    ) : (
      <p className="text-sm text-gray-400">Lade Benutzer...</p>
    )}

    <button
      onClick={handleLogout}
      className="mt-3 text-sm text-red-600 hover:underline"
    >
      Abmelden
    </button>
  </div>
</aside>

        {/* HAUPTINHALT */}
        <main className="flex-1 p-4 md:p-10">{children}</main>

      </body>
    </html>
  );
}
