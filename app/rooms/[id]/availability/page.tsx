"use client";

import { useState, useEffect, useMemo } from "react";

export default function AvailabilityPage(props: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState<{ start: string; end: string }[]>([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const [people, setPeople] = useState(1);
  const [purpose, setPurpose] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // params extrahieren (Next.js 13 Besonderheit)
  useEffect(() => {
    async function unwrap() {
      const resolved = await props.params;
      setId(resolved.id);
    }
    unwrap();
  }, [props.params]);

  // Slots laden
  async function loadAvailability() {
    if (!id || !date) return;
    setLoading(true);
    setSlots([]);
    setStart("");
    setEnd("");
    setMessage("");

    const res = await fetch(
      `http://localhost:4000/rooms/${id}/availability?date=${date}`,
      { cache: "no-store" }
    );

    const data = await res.json();
    setSlots(data.free ?? []);
    setLoading(false);
  }

  // Endzeit hängt von Startzeit ab
  const endOptions = useMemo(() => {
    if (!start) return slots;
    const index = slots.findIndex((s) => s.start === start);
    return slots.slice(index + 1);
  }, [slots, start]);

  // Buchen
  async function book() {
    if (!id || !start || !end) return;

    const payload = {
      roomId: id,
      userId: "703dedca-b5bd-4494-85c7-cfa9576bb6c6", // später dynamisch
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

  if (!id) return <div className="p-10">Wird geladen…</div>;

  // Tailwind Input Styles
  const inputCls =
    "w-full h-12 rounded-xl border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500";

  const labelCls = "text-sm font-medium text-slate-800";
  const groupCls = "flex flex-col gap-2";

  return (
    <div className="p-10 flex justify-center">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-100 p-7">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            📅
          </div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Raum buchen
          </h2>
        </div>

        {/* Formular */}
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

          {/* Button Verfügbarkeit prüfen */}
          <button
            type="button"
            onClick={loadAvailability}
            className="h-11 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
          >
            Verfügbarkeit prüfen
          </button>

          {/* Start / Endzeit */}
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
                  {slots.map((s) => (
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

          {/* Zweck */}
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

          {/* Jetzt buchen */}
          {slots.length > 0 && (
            <button
              type="button"
              onClick={book}
              disabled={!start || !end}
              className="h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold shadow hover:opacity-90 disabled:opacity-40 transition"
            >
              Jetzt buchen
            </button>
          )}

          {/* Message */}
          {message && (
            <div className="mt-3 text-sm text-slate-700">{message}</div>
          )}

          {/* Keine Slots */}
          {slots.length === 0 && !loading && (
            <p className="text-sm text-slate-500">
              Noch keine Zeit ausgewählt oder keine freien Zeitfenster.
            </p>
          )}

          {loading && (
            <p className="text-sm text-slate-500">Verfügbarkeit wird geladen…</p>
          )}
        </form>
      </div>
    </div>
  );
}
