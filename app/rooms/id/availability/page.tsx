"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";

type Slot = {
  start: string;
  end: string;
};

export default function RoomAvailabilityPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const roomId = params.id as string;
  const date = searchParams.get("date") ?? "";

  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Daten vom Backend laden
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
    } catch (err) {
      setError("Fehler beim Laden der Verfügbarkeit");
    } finally {
      setLoading(false);
    }
  }

  // 🔹 Effekt ohne ESLint-Warnung
  useEffect(() => {
    if (!date) return;

    async function fetchData() {
      await loadAvailability(date);
    }

    fetchData();
  }, [date]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Verfügbarkeit am {date}
      </h1>

      {!date && (
        <p className="text-red-600">❗ Bitte ?date=YYYY-MM-DD in der URL angeben.</p>
      )}

      {loading && <p>⏳ Laden…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* Liste der freien Slots */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {slots.map((slot) => (
          <div
            key={slot.start}
            className="p-4 border rounded bg-white shadow hover:bg-blue-50 transition"
          >
            <p className="font-semibold">
              🕒 {slot.start} – {slot.end}
            </p>
          </div>
        ))}

        {!loading && slots.length === 0 && (
          <p className="text-gray-600">Keine freien Zeiten mehr.</p>
        )}
      </div>
    </div>
  );
}
