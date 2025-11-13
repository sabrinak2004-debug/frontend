import "./globals.css";

export const metadata = {
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

            <a href="/opening-hours" className="text-gray-700 hover:text-blue-600">
              🕒 Öffnungszeiten
            </a>
          </nav>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 p-10">{children}</main>

      </body>
    </html>
  );
}
