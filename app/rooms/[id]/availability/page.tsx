"use client";

import { useState } from "react";

export default function AvailabilityPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;

  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<{ start: string; end: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadAvailability() {
    if (!date) return;

    setLoading(true);
    setError("");
    setSlots([]);

    try {
      const res = await fetch(
        `http://localhost:4000/rooms/${id}/availability?date=${date}`
      );

      if (!res.ok) {
        setError("Serverfehler");
        setLoading(false);
        return;
      }

      const data = await res.json();

      // Backend liefert: { free: [...] }
      setSlots(data.free ?? []);
    } catch (_err) {
      setError("Fehler beim Laden.");
    }

    setLoading(false);
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Verfügbarkeit prüfen</h1>

      {/* Date Input */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border px-3 py-2 rounded"
      />

      <button
        onClick={loadAvailability}
        className="ml-3 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Prüfen
      </button>

      {/* Ausgabebereich */}
      <div className="mt-6">
        {loading && <p>⏳ Wird geladen...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && slots.length === 0 && date && !error && (
          <p className="text-red-600">❌ Keine freien Zeiten</p>
        )}

        {slots.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">
              Freie Zeitfenster:
            </h2>

            <ul className="list-disc ml-6">
              {slots.map((slot, index) => (
                <li key={index}>
                  {slot.start} – {slot.end}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
