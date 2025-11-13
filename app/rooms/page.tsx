// Datei: frontend/app/rooms/page.tsx
import Image from "next/image";
import React from "react";

type Room = {
  id: string;
  name: string;
  description: string;
  capacity: number;
  location: string;
  features: string[];
  photo_url: string | null;
};

export default async function RoomsPage() {
  // Backend-API abrufen
  const res = await fetch("http://localhost:4000/rooms", {
    cache: "no-store",
  });

  if (!res.ok) {
    return <div>Fehler beim Laden der Räume.</div>;
  }

  const rooms: Room[] = await res.json();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Alle Räume</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white shadow rounded p-4">
            {room.photo_url && (
              <Image
                src={room.photo_url}
                alt={room.name}
                width={400}
                height={200}
                className="w-full h-40 object-cover rounded"
              />
            )}

            <h2 className="text-xl font-semibold">{room.name}</h2>
            <p className="text-gray-600 text-sm">{room.description}</p>

            <p className="mt-2">
              <strong>Kapazität:</strong> {room.capacity} Personen
            </p>

            <p className="mt-1">
              <strong>Ort:</strong> {room.location}
            </p>

            <p className="mt-1">
              <strong>Ausstattung:</strong> {room.features.join(", ")}
            </p>

            <a
              href={`/rooms/${room.id}`}
              className="inline-block mt-4 text-blue-600 hover:underline"
            >
              Verfügbarkeit prüfen →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

