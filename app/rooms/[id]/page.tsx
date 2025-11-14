"use client";
import Image from "next/image";
export default async function RoomDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;

  const res = await fetch(`http://localhost:4000/rooms/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <div>Fehler beim Laden des Raumes.</div>;
  }

  const room = await res.json();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">{room.name}</h1>

      <Image
        src={room.photo_url}
        alt="Raumbild"
        width={400}
        height={300}
        className="rounded shadow mb-4"
      />

      <p>{room.description}</p>

      <p className="mt-3">
        <strong>Kapazität:</strong> {room.capacity}
      </p>

      <a
        className="block mt-6 text-blue-600 underline"
        href={`/rooms/${id}/availability`}
      >
        → Verfügbarkeit prüfen
      </a>
    </div>
  );
}
