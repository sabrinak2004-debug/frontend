import Link from "next/dist/client/link";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hohenheim Booking App",
  description: "Gruppenräume buchen",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="flex bg-gray-50 min-h-screen">

        {/* SIDEBAR */}
        <aside className="w-72 bg-white border-r px-6 py-8 flex flex-col justify-between shadow-sm">
          {/* LOGO */}
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="big-blue-600 text-white p-3 rounded-xl shadow">
                📘
              </div>  
              <div>
                <h1 className="text-lg font-bold">Zentralbibliothek</h1>
                <p className="text-xs text-gray-500">Universität Hohenheim</p>
              </div>
            </div>
            {/* NAVIGATION */}
            <nav className="flex flex-col gap-2">
              <Link 
                href="/rooms"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600`}
              >
                <span>📅</span> Alle Räume
              </Link>
              <Link
                href="/my-bookings"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg
                  text-gray-700 hover:bg-blue-50 hover:text-blue-600`}
              >
                <span>⭐</span> Meine Buchungen
              </Link>
            </nav>

            {/* ÖFFNUNGSZEITEN */}
            <div className="mt-10">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Öffnungszeiten
              </h2>

              {/* Bereich 1 */}
              <div className="mb-4">
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <span>🕒</span> Ausleihe & Räume
                </div>
                <p className="text-sm text-gray-600 ml-7 mt-1">
                  Mo - Fr: 08:00 - 22:00<br />
                  Sa - So: 10:00 - 18:00
                </p>
              </div>
              {/* Bereich 2 */}
              <div className="mb-4">
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <span>📞</span> Auskunft
                </div>
                <p className="text-sm text-gray-600 ml-7 mt-1">
                  Mo - Fr: 09:00 - 17:00<br />
                  Tel. 0711 / 459-22096
                </p>
              </div>

              <p className="text-xs text-gray-500 ml-1 mt-1">
                An gesetzlichen Feiertagen geschlossen
              </p>
            </div>
          </div>
          {/* PROFIL-BEREICH-UNTEN */}
          <div className="mt-10 border-t pt-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white p-3 rounded-full">👤</div>
              <div>
                <p className="font-medium">Max Mustermann</p>
                <p className="text-sm text-gray-500">max.mustermann@example.com</p>
              </div>
            </div>
          </div>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 p-10">{children}</main>

      </body>
    </html>
  );
}
