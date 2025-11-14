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
  const [selectedSlot, setSelectedSlot] = useState<null | {
    start: string;
    end: string;
  }>(null);
  const [people, setPeople] = useState(1);
  const [purpose, setPurpose] = useState("");
  const [message, setMessage] = useState("");

  async function loadAvailability() {
    if (!date) return;
    setSlots([]);

    const res = await fetch(
      `http://localhost:4000/rooms/${id}/availability?date=${date}`
    );

    const data = await res.json();
    setSlots(data.free ?? []);
  }

  // BUCHEN ------------------------------
  async function book() {
    if (!selectedSlot) return;

    const payload = {
      roomId: id,
      userId: "703dedca-b5bd-4494-85c7-cfa9576bb6c6", // später dynamisch
      date,
      start: selectedSlot.start,
      end: selectedSlot.end,
      peopleCount: people,
      purpose,
    };

    const res = await fetch("http://localhost:4000/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok) setMessage("✔️ Buchung erfolgreich gespeichert");
    else setMessage("❌ Fehler: " + data.error);
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Verfügbarkeit prüfen</h1>

      {/* DATUM */}
      <input
        type="date"
        className="border px-3 py-2 rounded"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <button
        onClick={loadAvailability}
        className="ml-3 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Prüfen
      </button>

      {/* ZEITSLOTS */}
      <div className="mt-6">
        {slots.length === 0 && date && <p>Keine freien Zeiten</p>}

        {slots.length > 0 && (
          <ul>
            {slots.map((slot) => (
              <li key={slot.start} className="mb-2">
                <button
                  className={`px-3 py-2 rounded border ${
                    selectedSlot?.start === slot.start
                      ? "bg-blue-600 text-white"
                      : "bg-white"
                  }`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot.start} – {slot.end}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedSlot && (
        <div className="mt-6 p-4 border rounded w-80 bg-gray-50">
          <h2 className="text-lg font-semibold mb-2">Buchung</h2>

          <label>Personen:</label>
          <input
            type="number"
            min={1}
            value={people}
            onChange={(e) => setPeople(Number(e.target.value))}
            className="border px-2 py-1 w-full mb-3"
          />

          <label>Zweck:</label>
          <input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="border px-2 py-1 w-full mb-3"
          />

          <button
            onClick={book}
            className="bg-green-600 text-white px-4 py-2 rounded w-full"
          >
            Jetzt buchen
          </button>

          {message && <p className="mt-3">{message}</p>}
        </div>
      )}
    </div>
  );
}
