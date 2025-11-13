"use client";

import { useEffect, useState } from "react";

interface Slot {
  start: string;
  end: string;
}

export default function AvailabilityPage({
  params,
}: {
  params: { id: string };
}) {
  const roomId = params.id;

  const [date, setDate] = useState<string>("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);

  // Verfügbarkeit laden
  async function loadAvailability(selectedDate: string) {
    setLoading(true);

    const res = await fetch(
      `http://localhost:4000/rooms/${roomId}/availability?date=${selectedDate}`
    );

    const data = await res.json();

    setSlots(data.free ?? []);
    setLoading(false);
  }

  // Wenn Datum ausgewählt wurde → neu laden
 useEffect(() => {
  if (!date) return;

  async function fetchData() {
    await loadAvailability(date);
  }

  fetchData();
}, [date]);


  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Verfügbarkeit prüfen</h1>

      {/* Datumsauswahl */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border p-2 rounded mb-6"
      />

      {/* Ladeanzeige */}
      {loading && <p>🔄 Lädt...</p>}

      {/* Keine Slots */}
      {!loading && date && slots.length === 0 && (
        <p className="text-red-600">❌ Keine freien Zeiten an diesem Tag.</p>
      )}

      {/* Slots anzeigen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {slots.map((slot, i) => (
          <div
            key={i}
            className="bg-white border shadow p-4 rounded text-gray-700"
          >
            ⏰ {slot.start} — {slot.end}
          </div>
        ))}
      </div>
    </div>
  );
}
