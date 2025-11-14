"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Room = {
  id: string;
  name: string;
  description: string;
  capacity: number;
  photo_url?: string;
  location?: string;
  equipment?: string;
};

export default function RoomDetailPage(props: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  // ⬇️ params korrekt aus Promise extrahieren!
  useEffect(() => {
    async function extractParams() {
      const resolved = await props.params;
      setId(resolved.id);
    }
    extractParams();
  }, [props.params]);

  // ⬇️ Raum laden, sobald id verfügbar ist
  useEffect(() => {
    if (!id) return;

    async function loadRoom() {
      setLoading(true);

      try {
        const res = await fetch(`http://localhost:4000/rooms/${id}`, {
          cache: "no-store",
        });

        if (res.ok) {
          setRoom(await res.json());
        } else {
          setRoom(null);
        }
      } catch {
        setRoom(null);
      }

      setLoading(false);
    }

    loadRoom();
  }, [id]);

  if (!id) return <div className="p-10">Lade Raumparameter...</div>;
  if (loading) return <div className="p-10">Lade Raum...</div>;
  if (!room) return <div className="p-10">Fehler beim Laden.</div>;

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
