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

  // BUCHUNGEN LADEN -----------------------
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

  // BEI SEITENSTART LADEN -------------------
  useEffect(() => {
    loadBookings();
  }, []);

  // BUCHUNG STORNIEREN
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
    loadBookings(); // neu laden
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Meine Buchungen</h1>

      {loading && <p>Wird geladen...</p>}

      {message && <p className="mb-4 text-green-700">{message}</p>}

      {bookings.length === 0 && !loading && (
        <p>Du hast noch keine Buchungen.</p>
      )}

      <ul className="space-y-4">
        {bookings.map((b) => (
          <li key={b.id} className="border rounded p-4 bg-white shadow">
            <h2 className="text-xl font-semibold">{b.rooms.name}</h2>

            <p>
              <strong>Datum:</strong>{" "}
              {new Date(b.date).toLocaleDateString("de-DE")}
            </p>

            <p>
              <strong>Zeit:</strong> {b.starts_at.slice(11, 16)} –{" "}
              {b.ends_at.slice(11, 16)}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                className={
                  b.status === "cancelled"
                    ? "text-red-600"
                    : "text-green-600"
                }
              >
                {b.status}
              </span>
            </p>

            {b.status !== "cancelled" && (
              <button
                onClick={() => cancelBooking(b.id)}
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded"
              >
                Stornieren
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
