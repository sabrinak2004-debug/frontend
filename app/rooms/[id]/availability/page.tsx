"use client";

import { useState } from "react";

export default function AvailabilityPage({ params }: { params: { id: string } }) {
  const id = params.id;

  const [date, setDate] = useState("");
  const [availability, setAvailability] = useState<null | boolean>(null);
  const [loading, setLoading] = useState(false);

  async function checkAvailability() {
    if (!date) return;

    setLoading(true);
    setAvailability(null);

    try {
      const res = await fetch(
        `http://localhost:4000/rooms/${id}/availability?date=${date}`
      );

      if (!res.ok) {
        setAvailability(null);
        return;
      }

      const data = await res.json();
      setAvailability(data.available);

    } catch (error) {
      console.error("Fehler beim Abrufen:", error);
    }

    setLoading(false);
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Verfügbarkeit prüfen</h1>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border px-3 py-2 rounded"
      />

      <button
        onClick={checkAvailability}
        className="ml-3 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Prüfen
      </button>

      <div className="mt-6">
        {loading && <p>Wird geladen...</p>}

        {availability === true && (
          <p className="text-green-600 font-semibold">
            ✔ Der Raum ist frei!
          </p>
        )}

        {availability === false && (
          <p className="text-red-600 font-semibold">
            ❌ Der Raum ist belegt.
          </p>
        )}
      </div>
    </div>
  );
}
