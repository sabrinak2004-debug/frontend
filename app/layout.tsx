"use client";

import "./globals.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isLoggedIn, getCurrentUser, logout } from "@/lib/auth";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<{ displayName: string; email: string } | null>(null);

  // Login-Redirect + User laden
  useEffect(() => {
    const publicRoutes = ["/login", "/register"];

    async function checkAuth() {
      if (!publicRoutes.includes(pathname)) {
        if (!isLoggedIn()) {
          router.replace("/login");
          return;
        }

        const u = await getCurrentUser();
        setUser(u);
      }
    }

    checkAuth();
  }, [pathname, router]);

  const isAuthPage = pathname === "/login" || pathname === "/register";

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <html lang="de">
      <body className="flex bg-white min-h-screen">

        {isAuthPage ? (
          <main className="flex-1">{children}</main>
        ) : (
          <>
            {/* SIDEBAR */}
            <aside className="w-72 bg-white px-6 py-8 flex flex-col justify-between shadow-sm ">

              <div>
                {/* LOGO */}
                <div className="flex items-center gap-3 mb-10">
                  <div className="bg-blue-50 text-white p-3 rounded-xl shadow">
                    📘
                  </div>
                  <div>
                    <h1 className="text-lg font-bold">Zentralbibliothek</h1>
                    <p className="text-xs text-gray-500">Universität Hohenheim</p>
                  </div>
                </div>

                {/* NAVIGATION */}
                <nav className="flex flex-col gap-2">
                  <Link href="/rooms" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50">
                    📅 Alle Räume
                  </Link>
                  <Link href="/my-bookings" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50">
                    ⭐ Meine Buchungen
                  </Link>
                </nav>
              </div>

              {/* PROFIL UNTERER BEREICH */}
              <div className="mt-10 pt-4">
                {user ? (
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-100 rounded-full text-lg">
                        👤
                      </div>
                      <div>
                        <p className="font-medium">{user.displayName}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="text-red-600 text-sm hover:underline"
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
          </>
        )}
      </body>
    </html>
  );
}
