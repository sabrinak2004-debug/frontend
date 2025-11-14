"use client";

import { useState, useEffect } from "react";

export default function AvailabilityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  // Lokaler State für die ID
  const [roomId, setRoomId] = useState<string>("");

  // params korrekt aus Promise auslesen
  useEffect(() => {
    async function loadParams() {
      const p = await params;
      setRoomId(p.id);
    }
    loadParams();
  }, [params]);

  // --- Ab hier dein Verfügbarkeits-Code ---
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<{ start: string; end: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checked, setChecked] = useState(false);

  async function loadAvailability() {
    if (!date || !roomId) return;

    setLoading(true);
    setError("");
    setSlots([]);
    setChecked(false);

    try {
      const res = await fetch(
        `http://localhost:4000/rooms/${roomId}/availability?date=${date}`
      );

      if (!res.ok) {
        setError("Serverfehler");
        setLoading(false);
        setChecked(true);
        return;
      }

      const data = await res.json();
      setSlots(data.free ?? []);
    } catch {
      setError("Fehler beim Laden.");
    }

    setLoading(false);
    setChecked(true);
  }

  // Wenn params noch lädt → Spinner
  if (!roomId) {
    return <p className="p-10">Wird geladen...</p>;
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Verfügbarkeit prüfen</h1>

      <input
        type="date"
        value={date}
        onChange={(e) => {
          setDate(e.target.value);
          setChecked(false);
        }}
        className="border px-3 py-2 rounded"
      />

      <button
        onClick={loadAvailability}
        className="ml-3 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Prüfen
      </button>

      <div className="mt-6">
        {loading && <p>⏳ Wird geladen...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && checked && slots.length === 0 && !error && (
          <p className="text-red-600">❌ Keine freien Zeiten</p>
        )}

        {slots.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Freie Zeitfenster:</h2>
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
