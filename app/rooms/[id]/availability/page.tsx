"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useParams } from "next/navigation";

interface Slot {
  start: string;
  end: string;
}

export default function AvailabilityPage() {
  const { id: roomId } = useParams();
  const searchParams = useSearchParams();

  const initialDate = searchParams.get("date") ?? "";
  const [date, setDate] = useState(initialDate);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // -----------------------------------------------------
  // 🔥 Lade Räume nur, wenn ein Datum gesetzt wurde
  // -----------------------------------------------------
  useEffect(() => {
    if (!date) return;
    loadAvailability(date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  // -----------------------------------------------------
  // 📌 Verfügbarkeiten vom Backend laden
  // -----------------------------------------------------
  async function loadAvailability(selectedDate: string) {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `http://localhost:4000/rooms/${roomId}/availability?date=${selectedDate}`
      );

      if (!res.ok) {
        throw new Error("Serverfehler");
      }

      const data = await res.json();
      setSlots(data.free ?? []);

    } catch (error) {
      console.error(error); // <-- Fehler verwenden, ESLint zufrieden
      setError("Fehler beim Laden der Verfügbarkeit");
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------------------------------
  // 📌 JSX UI
  // -----------------------------------------------------
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Verfügbarkeit prüfen</h1>

      {/* Datumsauswahl */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border p-2 rounded mb-4"
      />

      {/* Ladeanzeige */}
      {loading && <p>⏳ Lade verfügbare Zeiten...</p>}

      {/* Fehlermeldung */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Slot-Liste */}
      {!loading && slots.length > 0 && (
        <ul className="mt-4 space-y-2">
          {slots.map((slot, index) => (
            <li key={index} className="p-3 bg-white shadow rounded">
              {slot.start} – {slot.end}
            </li>
          ))}
        </ul>
      )}

      {!loading && slots.length === 0 && date && (
        <p className="mt-4 text-gray-600">Keine freien Zeiten</p>
      )}
    </div>
  );
}
