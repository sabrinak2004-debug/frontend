"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function RoomDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
type Room = {
  id: string;
  name: string;
  description: number;
  capacity: number;
  photo_url?: string;
  location?: string;
  equipment?: string; 
};
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRoom() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:4000/rooms/${id}`);
        if (res.ok) {
          const data = await res.json();
          setRoom(data);
        }
      } catch {
        setRoom(null);
      }
      setLoading(false);
    }

    loadRoom();
  }, [id]);

  if (loading) return <div className="p-10">Lade Raum...</div>;
  if (!room) return <div className="p-10">Fehler beim Laden des Raumes.</div>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">{room.name}</h1>

      {room.photo_url && (
        <Image
          src={room.photo_url}
          alt={room.name}
          width={400}
          height={300}
          className="rounded shadow mb-4"
        />
      )}

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
