"use client";

import { getUserId, getToken } from "@/lib/auth";
import { useEffect, useState, useCallback } from "react";
import { API } from "@/lib/auth";

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
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    const id = getUserId();
    setUserId(id);
  }, []);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadBookings = useCallback(async () => {
    if (!userId) return;

    setLoading(true);

    try {
      const token = getToken();

      const res = await fetch(`${API}/bookings/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Fehler beim Laden");

      const data = await res.json();
      setBookings(data);
    } catch {
      setMessage("❌ Buchungen konnten nicht geladen werden");
    }

    setLoading(false);
  }, [userId]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  if (!userId) {
    return (
      <div className="p-10 text-red-600 text-lg">
        Du bist nicht eingeloggt.
      </div>
    );
  }

  function getBookingDateTime(dateStr: string, timeStr: string) {
  const d = new Date(dateStr);
  const t = new Date(timeStr);

  // Uhrzeit in das Datum übernehmen
  d.setHours(t.getHours(), t.getMinutes(), 0, 0);

  return d;
}
const now = new Date();

const upcoming = bookings.filter((b) => {
  const start = getBookingDateTime(b.date, b.starts_at);
  return start > now && b.status !== "cancelled";
});

const past = bookings.filter((b) => {
  const end = getBookingDateTime(b.date, b.ends_at);
  return end < now && b.status !== "cancelled";
});

const cancelled = bookings.filter((b) => b.status === "cancelled");


  // -----------------------------
  // Formatierung
  // -----------------------------

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("de-DE", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formatTime = (t: string) => {
    if (t.includes("T")) return t.substring(11, 16);
    return t.substring(0, 5);
  };

  async function cancelBooking(id: string) {
    const res = await fetch(`${API}/bookings/${id}/cancel`, {
      method: "PATCH",
    });

    if (!res.ok) {
      setMessage("❌ Stornierung fehlgeschlagen");
      return;
    }

    setMessage("✔️ Buchung storniert");
    loadBookings();
  }

  const renderList = (title: string, list: Booking[]) => {
    if (list.length === 0) return null;

    return (
      <div className="mt-10">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
        </div>

        <div className="space-y-6 max-w-3xl">
          {list.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 flex justify-between items-center"
            >
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  {b.rooms.name}
                </h3>

                <div className="flex items-center gap-2 mt-3 text-slate-600">
                  <span>📆</span>
                  <span>{formatDate(b.date)}</span>
                </div>

                <div className="flex items-center gap-2 mt-2 text-slate-600">
                  <span>⏰</span>
                  <span>
                    {formatTime(b.starts_at)} – {formatTime(b.ends_at)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                <span
                  className={`px-4 py-1 rounded-full text-sm font-semibold ${
                    b.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {b.status === "cancelled" ? "Storniert" : "Bestätigt"}
                </span>

                {b.status !== "cancelled" && (
                  <button
                    onClick={() => cancelBooking(b.id)}
                    className="text-red-600 text-xl hover:text-red-800"
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
  };

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold text-slate-900">Meine Buchungen</h1>
      <p className="text-slate-600 mt-2">
        Übersicht Ihrer Gruppenraum-Buchungen
      </p>

      {loading && <p className="mt-4">Wird geladen…</p>}
      {message && <p className="mt-4 text-green-600">{message}</p>}

      {renderList("Kommende Buchungen", upcoming)}
      {renderList("Stornierte Buchungen", cancelled)}
      {renderList("Vergangene Buchungen", past)}

      {!loading &&
        upcoming.length === 0 &&
        cancelled.length === 0 &&
        past.length === 0 && (
          <p className="mt-10 text-slate-600">Du hast noch keine Buchungen.</p>
        )}
    </div>
  );
}
