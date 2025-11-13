import React from "react";

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ⬅️ params müssen awaited werden
  const { id } = await params;

  // Backend abrufen
  const res = await fetch(`http://localhost:4000/rooms/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <div className="p-10">Fehler beim Laden des Raumes.</div>;
  }

  const room = await res.json();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">{room.name}</h1>

      <p className="text-gray-700 mb-2">{room.description}</p>

      <p>
        <strong>Kapazität:</strong> {room.capacity}
      </p>

      <p>
        <strong>Ort:</strong> {room.location}
      </p>

      <p>
        <strong>Ausstattung:</strong> {room.features}
      </p>

      <div className="mt-4">
        <a
          href={`/rooms/${id}/availability`}
          className="text-blue-600 hover:underline"
        >
          Verfügbarkeit prüfen →
        </a>
      </div>
    </div>
  );
}
