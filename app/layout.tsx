import Link from "next/link";
import {
  BookOpen,
  CalendarCheck,
  Clock,
  Phone,
  User,
} from "lucide-react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="flex bg-gray-100 min-h-screen">

        {/* SIDEBAR */}
        <aside className="w-72 bg-white border-r shadow-sm p-6 flex flex-col justify-between">

          <div>
            {/* LOGO */}
            <div className="mb-10">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                Zentralbibliothek
              </h1>
              <p className="text-sm text-gray-500 -mt-1 ml-8">
                Universität Hohenheim
              </p>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1 mb-10">
              <Link
                href="/rooms"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                <CalendarCheck className="w-5 h-5" />
                Alle Räume
              </Link>

              <Link
                href="/my-bookings"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                <BookOpen className="w-5 h-5" />
                Meine Buchungen
              </Link>
            </nav>

            {/* Öffnungszeiten */}
            <div>
              <h2 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                Öffnungszeiten
              </h2>

              <div className="flex items-start gap-3 mb-4">
                <Clock className="w-5 h-5 text-blue-600" />
                <div className="text-sm">
                  <p className="font-medium">Ausleihe & Räume</p>
                  <p className="text-gray-600">Mo–Fr: 08:00 – 21:00</p>
                  <p className="text-gray-600">Sa–So: 10:00 – 21:00</p>
                </div>
              </div>

              <div className="flex items-start gap-3 mb-4">
                <Phone className="w-5 h-5 text-blue-600" />
                <div className="text-sm">
                  <p className="font-medium">Auskunft</p>
                  <p className="text-gray-600">Mo–Fr: 09:00 – 17:00</p>
                  <p className="text-gray-600">Tel. 0711 / 459-22096</p>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                An gesetzlichen Feiertagen geschlossen
              </p>
            </div>
          </div>

          {/* USER */}
          <div className="flex items-center gap-3 border-t pt-4 mt-6">
            <User className="w-10 h-10 text-blue-600" />
            <div>
              <p className="font-medium">Sabrina Klausmeier</p>
              <p className="text-sm text-gray-500">sabrinak2004@gmail.com</p>
            </div>
          </div>

        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-10">{children}</main>

      </body>
    </html>
  );
}
