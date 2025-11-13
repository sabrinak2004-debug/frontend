// app/rooms/[id]/page.tsx

import Image from "next/image";

export default async function RoomDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  // Raum aus dem Backend abrufen
  const res = await fetch(`http://localhost:4000/rooms/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <div>Fehler beim Laden des Raumes.</div>;
  }

  const room = await res.json();

  return (
    <div className="max-w-3xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">{room.name}</h1>

      {/* Bild */}
      <div className="relative w-full h-64 mb-6">
        <Image
          src={room.photo_url}
          alt={room.name}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      {/* Details */}
      <p className="text-gray-700 mb-4">{room.description}</p>

      <p><strong>Kapazität:</strong> {room.capacity} Personen</p>
      <p><strong>Ort:</strong> {room.location}</p>
      <p><strong>Ausstattung:</strong> {room.features}</p>

      <hr className="my-6" />

      <a
        href={`/rooms/${id}/availability`}
        className="text-blue-600 underline"
      >
        ➜ Verfügbarkeit anzeigen
      </a>
    </div>
  );
}
