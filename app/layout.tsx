import "./globals.css";
import type { Metadata } from "next";
import { useEffect, useState } from "react";

export const metadata: Metadata = {
  title: "Hohenheim Booking App",
  description: "Gruppenräume buchen",
};

type OpeningHour = {
  weekday: number;
  opens: string;
  closes: string;
  is_closed: boolean;
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [hours, setHours] = useState<OpeningHour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("http://localhost:4000/opening-hours");
      const data = await res.json();
      setHours(data.week);     // <-- aus Backend
      setLoading(false);
    }
    load();
  }, []);

  // Hilfsfunktion: Wochentage
  const weekdayName = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

  return (
    <html lang="de">
      <body className="flex bg-gray-100 min-h-screen">

        {/* SIDEBAR */}
        <aside className="w-64 bg-white border-r shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h1 className="text-xl font-bold mb-6">📚 Hohenheim</h1>

            {/* Navigation */}
            <nav className="flex flex-col gap-4 mb-8">
              <a href="/rooms" className="text-gray-700 hover:text-blue-600">
                📅 Alle Räume
              </a>

              <a href="/my-bookings" className="text-gray-700 hover:text-blue-600">
                ⭐ Meine Buchungen
              </a>
            </nav>

            {/* ÖFFNUNGSZEITEN */}
            <h2 className="text-gray-500 text-sm uppercase mb-3">Öffnungszeiten</h2>

            {loading && <p className="text-sm text-gray-500">Laden…</p>}

            {!loading && (
              <ul className="text-sm text-gray-700 space-y-1">
                {hours.map((h) => (
                  <li key={h.weekday} className="flex justify-between">
                    <span>{weekdayName[h.weekday]}</span>
                    {h.is_closed ? (
                      <span className="text-red-600">geschlossen</span>
                    ) : (
                      <span>
                        {h.opens.slice(0, 5)} – {h.closes.slice(0, 5)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <p className="mt-4 text-xs text-gray-500">
              An gesetzlichen Feiertagen geschlossen
            </p>
          </div>

          {/* USER INFO */}
          <div className="mt-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full" />
              <div>
                <p className="font-semibold">Sabrina Klausmeier</p>
                <p className="text-xs text-gray-600">sabrinak2004@gmail.com</p>
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
