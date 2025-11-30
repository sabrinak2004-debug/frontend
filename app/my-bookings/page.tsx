"use client";

import { getUserId } from "@/lib/auth";
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
  const userId = getUserId();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Buchungen laden
  const loadBookings = useCallback(async () => {
    if (!userId) return;

    setLoading(true);

    try {
      const res = await fetch(`${API}/bookings/me?userId=${userId}`, {
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
    if (userId) {
      loadBookings();
    }
  }, [userId, loadBookings]);

  // Falls nicht eingeloggt
  if (!userId) {
    return (
      <div className="p-10 text-red-600 text-xl">Du bist nicht eingeloggt.</div>
    );
  }

  // Hilfsfunktionen
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

  const now = new Date();

  // Kategorien
  const upcoming = bookings.filter(
    (b) => new Date(b.date + "T" + b.starts_at) >= now && b.status !== "cancelled"
  );
  const expired = bookings.filter(
    (b) => new Date(b.date + "T" + b.starts_at) < now && b.status !== "cancelled"
  );
  const cancelled = bookings.filter((b) => b.status === "cancelled");

  // Buchung stornieren
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

  // Komponente für einzelne Buchung
  const BookingCard = (b: Booking) => (
    <div
      key={b.id}
      className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 flex justify-between items-center"
    >
      <div>
        <h3 className="text-xl font-semibold text-slate-900">{b.rooms.name}</h3>

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

        <div className="flex items-center gap-2 mt-2 text-slate-600">
          <span>👥</span>
          <span>1 Personen</span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-3">
        <span
          className={`px-4 py-1 rounded-full text-sm font-semibold ${
            b.status === "cancelled"
              ? "bg-red-100 text-red-700"
              : new Date(b.date + "T" + b.starts_at) < now
              ? "bg-gray-200 text-gray-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {b.status === "cancelled"
            ? "Storniert"
            : new Date(b.date + "T" + b.starts_at) < now
            ? "Abgelaufen"
            : "Bestätigt"}
        </span>

        {b.status !== "cancelled" &&
          new Date(b.date + "T" + b.starts_at) >= now && (
            <button
              onClick={() => cancelBooking(b.id)}
              className="text-red-600 text-xl hover:text-red-800"
              title="Buchung löschen"
            >
              🗑️
            </button>
          )}
      </div>
    </div>
  );

  return (
    <div className="p-10 max-w-4xl">
      <h1 className="text-4xl font-bold text-slate-900">Meine Buchungen</h1>
      <p className="text-slate-600 mt-2 mb-8">
        Übersicht Ihrer gebuchten Gruppenräume in der Zentralbibliothek Hohenheim
      </p>

      {loading && <p className="text-slate-500">Wird geladen…</p>}
      {message && <p className="mb-6 text-green-700 font-medium">{message}</p>}

      {/* 🔵 Kommende Buchungen */}
      {upcoming.length > 0 && (
        <>
          <div className="flex items-center gap-3 mb-4 mt-10">
            <div className="text-indigo-600 text-xl">📅</div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Kommende Buchungen
            </h2>
          </div>

          <div className="space-y-6">
            {upcoming.map((b) => BookingCard(b))}
          </div>
        </>
      )}

      {/* 🟠 Abgelaufene Buchungen */}
      {expired.length > 0 && (
        <>
          <div className="flex items-center gap-3 mb-4 mt-12">
            <div className="text-gray-600 text-xl">⏳</div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Vergangene Buchungen
            </h2>
          </div>

          <div className="space-y-6">
            {expired.map((b) => BookingCard(b))}
          </div>
        </>
      )}

      {/* 🔴 Stornierte Buchungen */}
      {cancelled.length > 0 && (
        <>
          <div className="flex items-center gap-3 mb-4 mt-12">
            <div className="text-red-600 text-xl">❌</div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Stornierte Buchungen
            </h2>
          </div>

          <div className="space-y-6">
            {cancelled.map((b) => BookingCard(b))}
          </div>
        </>
      )}

      {/* Keine Buchungen */}
      {!loading &&
        bookings.length === 0 && (
          <p className="text-slate-600 mt-6">
            Du hast noch keine Buchungen.
          </p>
        )}
    </div>
  );
}
