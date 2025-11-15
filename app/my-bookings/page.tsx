"use client";

import { useEffect, useState } from "react";

type Booking = {
  id: string;
  date: string;
  starts_at: string;
  ends_at: string;
  status: string;
  rooms: {
    name: string;
    photo_url: string | null;
  };
};

export default function MyBookingsPage() {
  const userId = "703dedca-b5bd-4494-85c7-cfa9576bb6c6"; // später dynamisch

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Buchungen laden
  async function loadBookings() {
    setLoading(true);

    const res = await fetch(
      `http://localhost:4000/bookings/me?userId=${userId}`,
      { cache: "no-store" }
    );

    const data = await res.json();
    setBookings(data);
    setLoading(false);
  }

  // beim Seitenstart laden
  useEffect(() => {
    (async () => {
      await loadBookings();
    })();
  }, []);

  // Stornieren
  async function cancelBooking(id: string) {
    const res = await fetch(
      `http://localhost:4000/bookings/${id}/cancel`,
      { method: "PATCH" }
    );

    if (!res.ok) {
      setMessage("❌ Stornierung fehlgeschlagen");
      return;
    }

    setMessage("✔️ Buchung storniert");
    loadBookings();
  }

  // Datum formatieren
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("de-DE", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  // Uhrzeit formatieren (Postgres TIME → "HH:MM:SS")
  const formatTime = (t: string) => t.slice(0, 5);

  return (
    <div className="p-10">
      {/* HEADER */}
      <h1 className="text-4xl font-bold text-slate-900">Meine Buchungen</h1>
      <p className="text-slate-600 mt-2 mb-10">
        Übersicht Ihrer gebuchten Gruppenräume in der Zentralbibliothek Hohenheim
      </p>

      {/* SECTION TITLE */}
      <div className="flex items-center gap-3 mb-6">
        <div className="text-indigo-600 text-xl">📅</div>
        <h2 className="text-2xl font-semibold text-slate-900">
          Kommende Buchungen
        </h2>
      </div>

      {/* Loading */}
      {loading && <p className="text-slate-600">Wird geladen…</p>}

      {/* Message */}
      {message && (
        <p className="mb-4 text-green-700 font-medium">{message}</p>
      )}

      {/* Keine Buchungen */}
      {!loading && bookings.length === 0 && (
        <p className="text-slate-600">Du hast noch keine Buchungen.</p>
      )}

      {/* Buchungskarten */}
      <div className="space-y-6 max-w-3xl">
        {bookings.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 flex justify-between items-center"
          >
            {/* Left side */}
            <div>
              <h3 className="text-xl font-semibold text-slate-900">
                {b.rooms.name}
              </h3>

              {/* Datum */}
              <div className="flex items-center gap-2 mt-3 text-slate-600">
                <span>📆</span>
                <span>{formatDate(b.date)}</span>
              </div>

              {/* Uhrzeit */}
              <div className="flex items-center gap-2 mt-2 text-slate-600">
                <span>⏰</span>
                <span>
                  {formatTime(b.starts_at)} – {formatTime(b.ends_at)}
                </span>
              </div>

              {/* Personen */}
              <div className="flex items-center gap-2 mt-2 text-slate-600">
                <span>👥</span>
                <span>1 Personen</span>
              </div>
            </div>

            {/* Right side */}
            <div className="flex flex-col items-end gap-3">
              {/* Status Badge */}
              <span
                className={`px-4 py-1 rounded-full text-sm font-semibold ${
                  b.status === "cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {b.status === "cancelled" ? "Storniert" : "Bestätigt"}
              </span>

              {/* Delete button */}
              {b.status !== "cancelled" && (
                <button
                  onClick={() => cancelBooking(b.id)}
                  className="text-red-600 text-xl hover:text-red-800 transition"
                  title="Buchung löschen"
                >
                  🗑️
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
