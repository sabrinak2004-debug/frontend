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

  const isAuthPage = PUBLIC_ROUTES.includes(pathname);

  // ------------------------------------------------------------
  // 1) AUTH CHECK – Wenn nicht eingeloggt → redirect
  // ------------------------------------------------------------
  const checkAuth = useCallback(() => {
    if (!PUBLIC_ROUTES.includes(pathname) && !isLoggedIn()) {
      router.replace("/login");
    }
  }, [pathname, router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ------------------------------------------------------------
  // 2) USER LADEN – Nur wenn eingeloggt
  // ------------------------------------------------------------
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

  // ------------------------------------------------------------
  // LOGIN / REGISTER OHNE SIDEBAR
  // ------------------------------------------------------------
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

  // ------------------------------------------------------------
  // HAUPT-LAYOUT (Sidebar + Content)
  // ------------------------------------------------------------
  return (
    <html lang="de">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <title>Hohenheim Gruppenräume</title>
      </head>
      <body className="bg-white min-h-screen flex flex-col md:flex-row">
        <aside className="w-full md:w-72 bg-white px-4 md:px-6 py-4 md:py-8 flex flex-col justify-between shadow-sm border-b md:border-b-0 md:border-r">
          {/* OBERER BEREICH */}
          <div>
            {/* LOGO */}
            <div className="flex items-center gap-3 mb-6 md:mb-10">
              <div className="p-3 rounded-2xl shadow bg-gradient-to-br from-blue-100 to-indigo-400 text-white text-3xl md:text-4xl">
                📖
              </div>
              <div>
                <h1 className="text-base md:text-lg font-bold">
                  Zentralbibliothek
                </h1>
                <p className="text-xs md:text-sm text-gray-500">
                  Universität Hohenheim
                </p>
              </div>
            </div>

            {/* NAVIGATION */}
            <nav className="flex flex-col gap-2">
              <Link
                href="/rooms"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 text-base md:text-xl tracking-wide"
              >
                🏫 <span>Alle Räume</span>
              </Link>
              <Link
                href="/my-bookings"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 text-base md:text-xl tracking-wide"
              >
                🗒 <span>Meine Buchungen</span>
              </Link>
            </nav>

            {/* ÖFFNUNGSZEITEN */}
            <div className="mt-6 md:mt-10">
              <h2 className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 md:mb-3">
                Öffnungszeiten
              </h2>

              <div className="mb-3 md:mb-4">
                <div className="flex items-center gap-2 text-gray-700 font-medium text-sm md:text-base">
                  🕒 <span>Ausleihe & Räume</span>
                </div>
                <p className="text-xs md:text-sm text-gray-600 ml-6 mt-1 leading-tight">
                  Mo–Fr: 08:00 – 21:00
                  <br />
                  Sa–So: 10:00 – 21:00
                </p>
              </div>

              <div className="mb-3 md:mb-4">
                <div className="flex items-center gap-2 text-gray-700 font-medium text-sm md:text-base">
                  📞 <span>Auskunft</span>
                </div>
                <p className="text-xs md:text-sm text-gray-600 ml-6 mt-1 leading-tight">
                  Mo–Fr: 09:00 – 17:00
                  <br />
                  Tel. 0711 / 459-22096
                </p>
              </div>

              <p className="text-[10px] md:text-xs text-gray-500 ml-1 mt-2">
                An gesetzlichen Feiertagen geschlossen
              </p>
            </div>
          </div>

          {/* PROFILBEREICH Unten */}
          <div className="pt-4 border-t mt-4 md:mt-6 md:border-t-0">
            {user ? (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-xl text-2xl md:text-3xl">
                    👤
                  </div>
                  <div>
                    <p className="font-medium text-sm md:text-base">
                      {user.displayName}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500">
                      {user.email}
                    </p>
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

        <main className="flex-1 p-4 md:p-10">{children}</main>
      </body>
    </html>
  );
}
