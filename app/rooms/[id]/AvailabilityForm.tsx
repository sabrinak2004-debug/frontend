"use client";

import { useState, useMemo } from "react";

type Slot = { start: string; end: string };
type BookingAPI = { starts_at: string; ends_at: string };

export default function AvailabilityForm({ roomId }: { roomId: string }) {
  const [date, setDate] = useState(() =>
    new Date().toISOString().substring(0, 10)
  );

  const [slots, setSlots] = useState<Slot[]>([]);
  const [booked, setBooked] = useState<Slot[]>([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [people, setPeople] = useState(1);
  const [purpose, setPurpose] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadAvailability() {
    setError("");
    setMessage("");

    // freie Slots
    const freeRes = await fetch(
      `http://localhost:4000/rooms/${roomId}/availability?date=${date}`
    );
    const freeData = await freeRes.json();
    setSlots(freeData.free || []);

    // gebuchte Slots
    const bookedRes = await fetch(
      `http://localhost:4000/bookings/by-room-and-date?roomId=${roomId}&date=${date}`
    );

    const bookedRaw = await bookedRes.json();
    const normalized = (bookedRaw || []).map((b: BookingAPI) => ({
      start: b.starts_at.substring(0, 5),
      end: b.ends_at.substring(0, 5),
    }));

    setBooked(normalized);
  }

  // Endzeiten abhängig vom Start
  const endOptions = useMemo(() => {
    if (!start) return slots;
    const idx = slots.findIndex((s) => s.start === start);
    return slots.slice(idx + 1);
  }, [slots, start]);

  function isOverlapping(startTime: string, endTime: string) {
    return booked.some(
      (b) => startTime < b.end && endTime > b.start
    );
  }

  async function book() {
    if (!start || !end) return;

    if (isOverlapping(start, end)) {
      setError("Dieser Zeitraum ist bereits gebucht");
      return;
    }

    const payload = {
      roomId,
      userId: "703dedca-b5bd-4494-85c7-cfa9576bb6c6",
      date,
      start,
      end,
      peopleCount: people,
      purpose,
    };

    const res = await fetch("http://localhost:4000/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("✔️ Buchung erfolgreich gespeichert");
      loadAvailability();
    } else {
      setError(data.error || "Fehler beim Buchen");
    }
  }

  const inputCls =
    "w-full h-12 rounded-xl border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500";

  const labelCls = "text-sm font-medium text-slate-800";

  return (
    <div className="bg-white p-7 rounded-3xl shadow border border-slate-100 w-full">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
          📅
        </div>
        <h2 className="text-2xl font-semibold text-slate-900">Raum buchen</h2>
      </div>

      {error && (
        <div className="border border-red-300 bg-red-50 text-red-600 p-4 rounded-xl mb-4 text-sm font-medium">
          ❗ {error}
        </div>
      )}

      {/* Datum */}
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

      {/* Start / Endzeit */}
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
              {endOptions.map((s) => (
                <option key={s.end} value={s.end}>
                  {s.end}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Personen */}
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

      {/* Zweck */}
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

      {slots.length > 0 && (
        <button
          type="button"
          onClick={book}
          className="mt-6 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold shadow hover:opacity-90 transition w-full"
        >
          Jetzt buchen
        </button>
      )}

      {/* Gebuchte Slots */}
      {booked.length > 0 && (
        <div className="mt-8 p-5 rounded-2xl bg-blue-50 border border-blue-200">
          <div className="text-lg font-semibold text-slate-900">
            Gebuchte Zeiten am {date}:
          </div>

          <ul className="mt-3 text-slate-700 space-y-1">
            {booked.map((b, i) => (
              <li key={i}>
                ⏰ {b.start} – {b.end}
              </li>
            ))}
          </ul>
        </div>
      )}

      {message && (
        <div className="mt-4 text-green-700 font-medium">{message}</div>
      )}
    </div>
  );
}
