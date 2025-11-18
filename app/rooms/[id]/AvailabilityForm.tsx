"use client";

import { useState, useCallback } from "react";
import { getUserId } from "@/lib/auth";

type Slot = { start: string; end: string };
type BookingAPI = { starts_at: string; ends_at: string };

export default function AvailabilityForm({ roomId }: { roomId: string }) {
  const userId = getUserId();

  // Form states
  const [date, setDate] = useState(() =>
    new Date().toISOString().substring(0, 10)
  );
  const [slots, setSlots] = useState<Slot[]>([]);
  const [roomBookings, setRoomBookings] = useState<Slot[]>([]);

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [people, setPeople] = useState(1);
  const [purpose, setPurpose] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ----------------------------
  // 🔹 Zeit in Minuten umrechnen
  // ----------------------------
  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  // ------------------------------------
  // 🔹 Prüfen ob ein Zeitraum überschneidet
  // ------------------------------------
  const isOverlapping = (s: string, e: string) => {
    const sMin = toMinutes(s);
    const eMin = toMinutes(e);

    return roomBookings.some((b) => {
      const bs = toMinutes(b.start);
      const be = toMinutes(b.end);
      return sMin < be && eMin > bs;
    });
  };

  // -------------------------------------------
  // 🔹 Verfügbarkeit + Buchungen für den Tag laden
  // -------------------------------------------
  const loadAvailability = useCallback(async () => {
    setMessage("");
    setError("");
    setStart("");
    setEnd("");

    // 1) Freie Slots abrufen
    const freeRes = await fetch(
      `${API}/rooms/${roomId}/availability?date=${date}`
    );
    const freeData = await freeRes.json();
    setSlots(freeData.free || []);

    // 2) ALLE Buchungen dieses Raumes an diesem Tag abrufen
    const bookedRes = await fetch(
      `${API}/bookings/by-room-and-date?roomId=${roomId}&date=${date}`
    );
    const bookedData: BookingAPI[] = await bookedRes.json();

    const normalized = bookedData.map((b) => ({
      start: b.starts_at.substring(11, 16),
      end: b.ends_at.substring(11, 16),
    }));

    setRoomBookings(normalized);
  }, [date, roomId]);

  // ----------------------------
  // 🔹 Endzeiten nach Startzeit
  // ----------------------------
  const getEndOptions = () => {
    if (!start) return [];
    const idx = slots.findIndex((s) => s.start === start);
    return slots.slice(idx + 1);
  };

  // ----------------------------
  // 🔹 Buchungs-Anfrage senden
  // ----------------------------
  async function book() {
    if (!start || !end) return;

    if (!userId) {
      setError("Du bist nicht eingeloggt.");
      return;
    }

    // Doppelbuchung verhindern
    if (isOverlapping(start, end)) {
      setError("❌ Dieser Zeitraum ist bereits gebucht.");
      return;
    }

    const payload = {
      roomId,
      userId,
      date,
      start,
      end,
      peopleCount: people,
      purpose,
    };

    const res = await fetch(`${API}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Fehler beim Buchen");
      return;
    }

    setMessage("✔️ Buchung erfolgreich gespeichert!");
    loadAvailability();
  }

  // ------------------------------------
  // 🔹 Styling
  // ------------------------------------
  const inputCls =
    "w-full h-12 rounded-xl border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500";
  const labelCls = "text-sm font-medium text-slate-800";

  // ------------------------------------
  // 🔹 UI Rendering
  // ------------------------------------
  return (
    <div className="bg-white p-7 rounded-3xl shadow border border-slate-100 w-full">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
          📅
        </div>
        <h1 className="text-xl font-semibold text-slate-900">Raum buchen</h1>    
        </div>

      {/* ERROR */}
      {error && (
        <div className="border border-red-300 bg-red-50 text-red-600 p-4 rounded-xl mb-4 text-sm font-medium">
          ❗ {error}
        </div>
      )}

      {/* DATUM */}
      <label className={labelCls}>Datum</label>
      <input
        type="date"
        className={inputCls}
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <button
        type="button"
        onClick={loadAvailability}
        className="mt-4 h-11 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition w-full"
      >
        Verfügbarkeit prüfen
      </button>

      {/* START & END ZEIT */}
      {slots.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div>
            <label className={labelCls}>Startzeit</label>
            <select
              className={inputCls}
              value={start}
              onChange={(e) => setStart(e.target.value)}
            >
              <option value="">Wählen…</option>
              {slots.map((s) => (
                <option key={s.start} value={s.start}>
                  {s.start}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Endzeit</label>
            <select
              className={inputCls}
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              disabled={!start}
            >
              <option value="">Wählen…</option>
              {getEndOptions().map((s) => (
                <option key={s.end} value={s.end}>
                  {s.end}
                </option>
              ))}
            </select>
          </div>
          <p className="text-sm text-gray-500">bitte max. 3 std.</p>
        </div>
      )}

      {/* PERSONEN */}
      {slots.length > 0 && (
        <div className="mt-6">
          <label className={labelCls}>Anzahl Personen</label>
          <input
            type="number"
            min={1}
            className={inputCls}
            value={people}
            onChange={(e) => setPeople(Number(e.target.value))}
          />
        </div>
      )}

      {/* ZWECK */}
      {slots.length > 0 && (
        <div className="mt-6">
          <label className={labelCls}>Zweck (optional)</label>
          <textarea
            className={`${inputCls} h-28 resize-none`}
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />
        </div>
      )}

      {/* BUCHEN */}
      {slots.length > 0 && (
        <button
          type="button"
          onClick={book}
          className="mt-6 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold shadow hover:opacity-90 transition w-full"
        >
          Jetzt buchen
        </button>
      )}

      {/* ALLE BUCHUNGEN DES TAGES */}
      {roomBookings.length > 0 && (
        <div className="mt-8 p-5 rounded-2xl bg-blue-50 border border-blue-200">
          <div className="font-semibold text-slate-900">
            Bereits gebuchte Zeiten am {date}:
          </div>

          <ul className="mt-3 text-slate-700 space-y-1">
            {roomBookings.map((b, i) => (
              <li key={i}>⏰ {b.start} – {b.end} Uhr</li>
            ))}
          </ul>
        </div>
      )}

      {/* SUCCESS MESSAGE */}
      {message && (
        <div className="mt-4 text-green-700 font-medium">{message}</div>
      )}
    </div>
  );
}
