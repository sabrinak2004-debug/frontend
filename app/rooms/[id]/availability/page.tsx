"use client";

import { useState, useEffect, useMemo } from "react";

type Slot = { start: string; end: string };
type BookingAPI = { starts_at: string; ends_at: string };

export default function AvailabilityPage(props: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState<Slot[]>([]);
  const [bookedSlots, setBookedSlots] = useState<Slot[]>([]);

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const [people, setPeople] = useState(1);
  const [purpose, setPurpose] = useState("");

  const [message, setMessage] = useState("");


  // -------------------------------------
  // PARAMS EXTRACT (NO CONDITIONAL HOOKS)
  // -------------------------------------
  useEffect(() => {
    (async () => {
      const resolved = await props.params;
      setId(resolved.id);
    })();
  }, [props.params]);


  // -------------------------------------
  // LOAD FREE + BOOKED SLOTS
  // -------------------------------------
  async function loadAvailability() {
    if (!id || !date) return;

    setSlots([]);
    setBookedSlots([]);
    setStart("");
    setEnd("");
    setMessage("");

    // 1) freie Slots
    const freeRes = await fetch(
      `http://localhost:4000/rooms/${id}/availability?date=${date}`
    );
    const freeData = await freeRes.json();
    setSlots(freeData.free ?? []);

    // 2) gebuchte Slots
    const bookedRes = await fetch(
      `http://localhost:4000/bookings/by-room-and-date?roomId=${id}&date=${date}`
    );
    const bookedData: BookingAPI[] = await bookedRes.json();

    const normalized = bookedData.map((b) => ({
      start: b.starts_at.substring(11, 16),
      end: b.ends_at.substring(11, 16),
    }));

    setBookedSlots(normalized);
  }


  // -------------------------------------
  // OVERLAPPING CHECK (HOOK-SAFE VERSION)
  // -------------------------------------
  const error = useMemo(() => {
    if (!start || !end) return "";

    for (const b of bookedSlots) {
      const overlaps = !(end <= b.start || start >= b.end);
      if (overlaps) return "Dieser Zeitraum ist bereits gebucht";
    }

    return "";
  }, [start, end, bookedSlots]);


  // -------------------------------------
  // MERGE FREE + BOOKED TIMES
  // -------------------------------------
  const allTimes: Slot[] = useMemo(() => {
    const combined = [...slots, ...bookedSlots];
    // Duplikate entfernen
    const unique = new Map<string, Slot>();
    for (const s of combined) {
      unique.set(s.start + s.end, s);
    }
    return Array.from(unique.values()).sort((a, b) =>
      a.start.localeCompare(b.start)
    );
  }, [slots, bookedSlots]);


  // -------------------------------------
  // BOOKING SEND
  // -------------------------------------
  async function book() {
    if (!id || !start || !end || error) return;

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

    if (res.ok) setMessage("✔️ Buchung erfolgreich gespeichert!");
    else setMessage("❌ Fehler: " + (data.error || "Unbekannter Fehler"));
  }


  // -------------------------------------
  // SAFE EARLY RETURN (AFTER ALL HOOKS)
  // -------------------------------------
  if (!id) return <div className="p-10">Wird geladen…</div>;


  // -------------------------------------
  // UI
  // -------------------------------------

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
          <div className="border border-red-300 bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-2">
            ❗ {error}
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-6">

          {/* DATUM */}
          <div className={groupCls}>
            <label className={labelCls}>Datum</label>
            <input
              type="date"
              className={inputCls}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={loadAvailability}
            className="h-11 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
          >
            Verfügbarkeit prüfen
          </button>

          {/* START / END */}
          {slots.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className={groupCls}>
                <label className={labelCls}>Startzeit</label>
                <select
                  className={inputCls}
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                >
                  <option value="">Wählen…</option>
                  {allTimes.map((s, i) => (
                    <option key={i} value={s.start}>
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
                  {allTimes.map((s, i) => (
                    <option key={i} value={s.end}>
                      {s.end}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          )}

          {/* PERSONEN */}
          {slots.length > 0 && (
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

          {/* ZWECK */}
          {slots.length > 0 && (
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

          {/* BOOKED TIMES */}
          {bookedSlots.length > 0 && (
            <div className="mt-3 p-5 rounded-2xl border border-slate-200 bg-blue-50">
              <div className="flex items-center gap-2 mb-2 text-slate-800">
                🕒
                <h3 className="font-semibold text-xl">
                  Gebuchte Zeiten am {new Date(date).toLocaleDateString("de-DE")}:
                </h3>
              </div>

              {bookedSlots.map((s, i) => (
                <p key={i} className="text-slate-700 text-lg">
                  {s.start} – {s.end}
                </p>
              ))}
            </div>
          )}

          {/* BUCHEN BUTTON */}
          {slots.length > 0 && (
            <button
              type="button"
              onClick={book}
              disabled={!start || !end || !!error}
              className="h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold shadow hover:opacity-90 disabled:opacity-40 transition"
            >
              Jetzt buchen
            </button>
          )}

          {message && <div className="mt-3 text-sm text-slate-700">{message}</div>}
        </form>
      </div>
    </div>
  );
}
