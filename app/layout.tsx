"use client";

import "./globals.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { isLoggedIn, getCurrentUser, logout } from "@/lib/auth";
import {
  BookOpen,
  Home,
  NotebookTabs,
  Clock,
  Phone,
  User,
  LogOut,
} from "lucide-react";

const PUBLIC_ROUTES = ["/", "/login", "/register"];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = PUBLIC_ROUTES.includes(pathname);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ displayName: string; email: string } | null>(null);

  // ---------------------------
  // AUTH REDIRECT
  // ---------------------------
  const checkAuth = useCallback(() => {
    if (!PUBLIC_ROUTES.includes(pathname) && !isLoggedIn()) {
      router.replace("/login");
    }
  }, [pathname, router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ---------------------------
  // USER LADEN
  // ---------------------------
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

  // ---------------------------
  // LOGIN / REGISTER → ohne Sidebar
  // ---------------------------
  if (isAuthPage) {
    return (
      <html lang="de">
        <body className="bg-gray-100 min-h-screen">
          <main>{children}</main>
        </body>
      </html>
    );
  }

  // ---------------------------
  // HAUPTLAYOUT
  // ---------------------------
  return (
    <html lang="de">
      <body className="bg-blue-30 min-h-screen">

        {/* MOBILE HAMBURGER */}
        <button
          className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white shadow rounded-lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "✖️" : "☰"}
        </button>

        {/* MOBILE OVERLAY */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR – FIXED */}
        <aside
          className={`
            fixed top-0 left-0
            h-full w-72
            bg-white
            border-r border-gray-200
            z-50
            flex flex-col justify-between
            px-6 py-8
            transition-transform duration-300
            shadow-sm
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          {/* TOP */}
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Zentralbibliothek</h1>
                <p className="text-sm text-gray-500">Universität Hohenheim</p>
              </div>
            </div>

            {/* Navigation */}
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
                <Home className="w-5 h-5" />
                <span>Alle Räume</span>
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
                <NotebookTabs className="w-5 h-5" />
                <span>Meine Buchungen</span>
              </Link>
            </nav>

            {/* Öffnungszeiten */}
            <div className="mt-10">
              <h2 className="text-xs font-semibold text-gray-400 uppercase mb-2">Öffnungszeiten</h2>

              <div className="mb-4">
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Ausleihe & Räume</span>
                </div>
                <p className="text-sm text-gray-500 ml-6 mt-1">
                  Mo–Fr: 08–21 <br /> Sa–So: 10–21
                </p>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span>Auskunft</span>
                </div>
                <p className="text-sm text-gray-500 ml-6 mt-1">
                  Mo–Fr: 09–17 <br /> Tel.: 0711 / 459-22096
                </p>
              </div>

              <p className="text-xs text-gray-400 ml-1">An gesetzlichen Feiertagen geschlossen</p>
            </div>
          </div>

          {/* USER UNTEN */}
          <div className="pt-4 border-t border-gray-200 mt-8">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <User className="w-6 h-6 text-blue-600" />
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
              className="mt-3 flex items-center gap-2 text-sm text-red-600 hover:underline"
            >
              <LogOut className="w-4 h-4" />
              Abmelden
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT – SCROLLBAR */}
        <main className="md:ml-72 p-4 md:p-10 min-h-screen bg-blue-30">
          {children}
        </main>
      </body>
    </html>
  );
}
