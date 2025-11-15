"use client";

import { use, useState, useMemo } from "react";

type Slot = { start: string; end: string };
type BookingAPI = { starts_at: string; ends_at: string; };

export default function AvailabilityPage(props: { params: Promise<{ id: string }> }) {
  // ✔ params korrekt entpacken (Next.js 13+)
  const { id } = use(props.params);

  // ----------------------
  // STATE
  // ----------------------
  const [date, setDate] = useState(() =>
    new Date().toISOString().substring(0, 10)
  );

  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [bookedSlots, setBookedSlots] = useState<Slot[]>([]);

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const [people, setPeople] = useState(1);
  const [purpose, setPurpose] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ----------------------
  // HELFER
  // ----------------------
  const formatTime = (t: string) => t.substring(0, 5);

  const isOverlapping = (start: string, end: string) => {
    const s = formatTime(start);
    const e = formatTime(end);

    return bookedSlots.some((b) => {
      return !(e <= b.start || s >= b.end);
    });
  };

  const endOptions = useMemo(() => {
    if (!start) return [];
    const startIndex = availableSlots.findIndex((s) => s.start === start);
    return availableSlots.slice(startIndex + 1);
  }, [start, availableSlots]);

  // ----------------------
  // VERFÜGBARKEIT LADEN
  // ----------------------
  async function loadAvailability() {
    if (!id || !date) return;

    setMessage("");
    setError("");
    setAvailableSlots([]);
    setBookedSlots([]);
    setStart("");
    setEnd("");

    // 1. freie Slots holen
    const freeRes = await fetch(
      `http://localhost:4000/rooms/${id}/availability?date=${date}`,
      { cache: "no-store" }
    );
    const freeData = await freeRes.json();
    const freeSlots: Slot[] = Array.isArray(freeData.free) ? freeData.free : [];
    setAvailableSlots(freeSlots);

    // 2. gebuchte Zeiten holen
    const bookedRes = await fetch(
      `http://localhost:4000/bookings/by-room-and-date?roomId=${id}&date=${date}`,
      { cache: "no-store" }
    );

    const bookedRaw = await bookedRes.json();

    const normalized: Slot[] = Array.isArray(bookedRaw)
      ? bookedRaw.map((b: BookingAPI) => ({
          start: b.starts_at.substring(11, 16),
          end: b.ends_at.substring(11, 16),
        }))
      : [];

    setBookedSlots(normalized);
  }

  // ----------------------
  // BUCHEN
  // ----------------------
  async function book() {
    if (!start || !end) return;

    setError("");
    setMessage("");

    if (isOverlapping(start, end)) {
      setError("Dieser Zeitraum ist bereits gebucht");
      return;
    }

    const payload = {
      roomId: id,
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
      setMessage("✔️ Buchung erfolgreich gespeichert!");
      loadAvailability(); // neu laden
    } else {
      setError(data.error || "Unbekannter Fehler");
    }
  }

  // ----------------------
  // RENDER
  // ----------------------
  const inputCls =
    "w-full h-12 rounded-xl border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500";
  const labelCls = "text-sm font-medium text-slate-800";
  const groupCls = "flex flex-col gap-2";

  return (
    <div className="p-10 flex justify-center">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-100 p-7">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            📅
          </div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Raum buchen
          </h2>
        </div>

        {/* ERROR BANNER */}
        {error && (
          <div className="p-4 rounded-xl border border-red-300 bg-red-50 text-red-700 text-center font-medium mb-5">
            ❗ {error}
          </div>
        )}

        {/* FORMULAR */}
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-6">

          {/* Datum */}
          <div className={groupCls}>
            <label className={labelCls}>Datum</label>
            <input
              type="date"
              className={inputCls}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Verfügbarkeit prüfen */}
          <button
            type="button"
            onClick={loadAvailability}
            className="h-11 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
          >
            Verfügbarkeit prüfen
          </button>

          {/* Startzeit */}
          {availableSlots.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={groupCls}>
                <label className={labelCls}>Startzeit</label>
                <select
                  className={inputCls}
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                >
                  <option value="">Wählen…</option>
                  {availableSlots.map((s) => (
                    <option key={s.start} value={s.start}>
                      {s.start}
                    </option>
                  ))}
                </select>
              </div>

              <div className={groupCls}>
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
          {availableSlots.length > 0 && (
            <div className={groupCls}>
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
          {availableSlots.length > 0 && (
            <div className={groupCls}>
              <label className={labelCls}>Zweck (optional)</label>
              <textarea
                className={`${inputCls} h-28 resize-none`}
                placeholder="z.B. Lerngruppe, Projektarbeit…"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>
          )}

          {/* Gebuchte Zeiten Box */}
          {bookedSlots.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mt-3">
              <div className="flex items-center gap-2 text-blue-700 font-semibold mb-3">
                ⏰ Gebuchte Zeiten am {date}:
              </div>

              {bookedSlots.map((b, i) => (
                <div key={i} className="text-blue-900 text-lg">
                  {b.start} – {b.end}
                </div>
              ))}
            </div>
          )}

          {/* Buchungsbutton */}
          {availableSlots.length > 0 && (
            <button
              type="button"
              onClick={book}
              disabled={!start || !end}
              className="h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold shadow hover:opacity-90 disabled:opacity-40 transition mt-6"
            >
              Jetzt buchen
            </button>
          )}

          {/* Success Message */}
          {message && (
            <div className="text-green-700 font-medium text-center mt-3">
              {message}
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
