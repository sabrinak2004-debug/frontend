"use client";

import { getUserId, getToken } from "@/lib/auth";
import { useEffect, useState, useCallback } from "react";
import { API } from "@/lib/auth";
import React from "react";
import {
  CalendarDays,
  Clock,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

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
    setUserId(getUserId());
  }, []);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ---------------------------------------------------
  // BUCHUNGEN LADEN
  // ---------------------------------------------------
  const loadBookings = useCallback(async () => {
    if (!userId) return;

    setLoading(true);

    try {
      const token = getToken();

      const res = await fetch(`${API}/bookings/me`, {
        headers: { Authorization: `Bearer ${token}` },
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

  // ---------------------------------------------------
  // DATUMSLOGIK
  // ---------------------------------------------------
  function getDateTime(dateStr: string, timeStr: string) {
    const d = new Date(dateStr);
    const t = new Date(timeStr);
    d.setHours(t.getHours(), t.getMinutes(), 0, 0);
    return d;
  }

  const now = new Date();

  const upcoming = bookings.filter((b) => {
    const start = getDateTime(b.date, b.starts_at);
    return start > now && b.status !== "cancelled";
  });

  const past = bookings.filter((b) => {
    const end = getDateTime(b.date, b.ends_at);
    return end < now && b.status !== "cancelled";
  });

  const cancelled = bookings.filter((b) => b.status === "cancelled");

  // ---------------------------------------------------
  // FORMATIERUNG
  // ---------------------------------------------------
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("de-DE", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formatTime = (t: string) =>
    t.includes("T") ? t.substring(11, 16) : t.substring(0, 5);

  // ---------------------------------------------------
  // STORNIEREN
  // ---------------------------------------------------
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

  // ---------------------------------------------------
  // ABSCHNITT RENDER
  // ---------------------------------------------------
  const renderSection = (title: string, icon: React.ReactNode, list: Booking[]) => {
    if (list.length === 0) return null;

    return (
      <div className="mt-12">
        <div className="flex items-center gap-3 mb-4">
          {icon}
          <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
        </div>

        <div className="space-y-6 max-w-3xl">
          {list.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex justify-between items-center hover:shadow-md transition"
            >
              <div>
                {/* Raumname */}
                <h3 className="text-xl font-semibold text-slate-900">
                  {b.rooms.name}
                </h3>

                {/* Datum */}
                <div className="flex items-center gap-2 mt-3 text-slate-600">
                  <CalendarDays className="w-5 h-5" />
                  <span>{formatDate(b.date)}</span>
                </div>

                {/* Uhrzeit */}
                <div className="flex items-center gap-2 mt-2 text-slate-600">
                  <Clock className="w-5 h-5" />
                  <span>
                    {formatTime(b.starts_at)} – {formatTime(b.ends_at)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                {/* Status Badge */}
                <span
                  className={`px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1
                    ${
                      b.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                >
                  {b.status === "cancelled" ? (
                    <>
                      <XCircle className="w-4 h-4" /> Storniert
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Bestätigt
                    </>
                  )}
                </span>

                {/* Papierkorb */}
                {b.status !== "cancelled" && (
                  <button
                    onClick={() => cancelBooking(b.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Buchung stornieren"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ---------------------------------------------------
  // RENDER PAGE
  // ---------------------------------------------------
  return (
    <div className="p-4 md:p-10">
      <h1 className="text-4xl font-bold text-slate-900">Meine Buchungen</h1>
      <p className="text-slate-600 mt-2 mb-6">
        Übersicht Ihrer Gruppenraum-Buchungen
      </p>

      {loading && <p>⏳ Wird geladen…</p>}
      {message && (
        <p className="mt-4 text-green-700 font-medium">{message}</p>
      )}

      {renderSection("Kommende Buchungen", <Clock className="w-6 h-6 text-indigo-600" />, upcoming)}

      {renderSection("Stornierte Buchungen", <XCircle className="w-6 h-6 text-red-600" />, cancelled)}

      {renderSection("Vergangene Buchungen", <CalendarDays className="w-6 h-6 text-gray-600" />, past)}

      {!loading &&
        upcoming.length === 0 &&
        cancelled.length === 0 &&
        past.length === 0 && (
          <p className="mt-10 text-slate-600">
            Du hast noch keine Buchungen.
          </p>
        )}
    </div>
  );
}
