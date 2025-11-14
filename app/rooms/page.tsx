"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Room = {
  id: string;
  name: string;
  capacity: number;
  location: string;
  description: string;
  features: string[];
  photo_url: string | null;
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [search, setSearch] = useState("");

  // Räume laden
  useEffect(() => {
    async function loadRooms() {
      const res = await fetch("http://localhost:4000/rooms", {
        cache: "no-store",
      });

      const data = await res.json();
      setRooms(data);
    }

    loadRooms();
  }, []);

  // Filterlogik für die Suche
  const filteredRooms = rooms.filter((room) => {
    const text = search.toLowerCase();

    return (
      room.name.toLowerCase().includes(text) ||
      room.location.toLowerCase().includes(text) ||
      room.description.toLowerCase().includes(text) ||
      room.features.some((f) => f.toLowerCase().includes(text))
    );
  });

  return (
    <div className="p-10">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-10 rounded-2xl shadow-lg mb-10">
        <h1 className="text-4xl font-bold">Gruppenräume buchen</h1>
        <p className="text-lg mt-2">
          Finden Sie den perfekten Raum für Ihre Lerngruppe oder Ihr Projekt in
          der Zentralbibliothek der Universität Hohenheim
        </p>
      </div>

      {/* SUCHFELD */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Raum suchen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl px-4 py-3 shadow-sm"
        />
      </div>

      {/* RAUMKARTEN */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden"
          >
            {/* Bild */}
            <div className="relative">
              <Image
                src={room.photo_url ?? "/placeholder.png"}
                alt={room.name}
                width={600}
                height={400}
                className="w-full h-48 object-cover"
              />

              <div className="absolute top-3 right-3 bg-white/100 text-black-700 text-sm px-3 py-1 rounded-lg">
                👥 {room.capacity} Personen
              </div>
            </div>

            <div className="p-5">
              <h2 className="text-xl font-semibold">{room.name}</h2>
              <p className="text-gray-500 mt-1">📍 {room.location}</p>

              <p className="mt-2 text-gray-700 line-clamp-2">
                {room.description}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mt-4">
                {room.features.map((f) => (
                  <span
                    key={f}
                    className="bg-gray-100 px-2 py-1 rounded-lg text-sm"
                  >
                    💬 {f}
                  </span>
                ))}
              </div>

              {/* Button */}
              <a
                href={`/rooms/${room.id}`}
                className="block mt-5 bg-gradient-to-r from-indigo-500 to-blue-500
                           text-white text-center py-2 rounded-xl font-semibold
                           hover:opacity-90 transition"
              >
                Jetzt buchen
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <p className="mt-10 text-gray-500 text-lg">Keine Räume gefunden.</p>
      )}
    </div>
  );
}
