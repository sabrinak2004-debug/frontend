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
      <body className="flex bg-gray-100 min-h-screen">

        {/* SIDEBAR */}
        <aside className="w-64 bg-white border-r shadow-sm p-6">
          <h1 className="text-xl font-bold mb-6">📚 Hohenheim</h1>

          <nav className="flex flex-col gap-4">
            <a href="/rooms" className="text-gray-700 hover:text-blue-600">
              📅 Alle Räume
            </a>

            <a href="/my-bookings" className="text-gray-700 hover:text-blue-600">
              ⭐ Meine Buchungen
            </a>

            {/* Öffnungszeiten stehen direkt in der Sidebar */}
            <div>
              <p className="text-gray-500 text-sm mt-6 font-semibold">
                Öffnungszeiten
              </p>
              <p className="text-gray-600 text-sm">Mo–Fr: 08:00 – 21:00</p>
              <p className="text-gray-600 text-sm">Sa–So: 10:00 – 21:00</p>
            </div>
          </nav>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 p-10">{children}</main>

      </body>
    </html>
  );
}
