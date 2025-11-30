"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Users,
  MapPin,
  Search,
  Monitor,
  Wifi,
  Info,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

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
      const res = await fetch(`${API_URL}/rooms`, { cache: "no-store" });
      const data = await res.json();
      setRooms(data);
    }
    loadRooms();
  }, []);

  // Suche
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
    <div className="p-4 md:p-10">

      {/* HEADER Banner */}
      <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-10 rounded-2xl shadow-lg mb-10">
        <h1 className="text-4xl font-bold">Gruppenräume buchen</h1>
        <p className="text-lg mt-2 opacity-90">
          Finden Sie den perfekten Raum für Ihre Lerngruppe oder Ihr Projekt.
        </p>
      </div>

      {/* SUCHFELD */}
      <div className="mb-10 relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Raum, Ausstattung oder Standort suchen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl px-12 py-3 border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      {/* RAUMKARTEN */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition"
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

              {/* Kapazität */}
              <div className="absolute top-3 right-3 bg-white shadow-sm text-gray-700 text-sm px-3 py-1 rounded-lg flex items-center gap-1">
                <Users className="w-4 h-4" /> {room.capacity}
              </div>
            </div>

            <div className="p-5">
              {/* Name */}
              <h2 className="text-xl font-semibold text-gray-900">{room.name}</h2>

              {/* Standort */}
              <p className="flex items-center gap-2 text-gray-500 mt-1">
                <MapPin className="w-4 h-4" />
                {room.location}
              </p>

              {/* Beschreibung */}
              <p className="mt-3 text-gray-700 line-clamp-2">
                {room.description}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mt-4">
                {room.features.map((f) => (
                  <span
                    key={f}
                    className="bg-gray-100 px-3 py-1 rounded-lg text-sm text-gray-700 flex items-center gap-1"
                  >
                    {f.includes("WLAN") && <Wifi className="w-4 h-4" />}
                    {f.includes("Monitor") && <Monitor className="w-4 h-4" />}
                    {(!f.includes("WLAN") && !f.includes("Monitor")) && (
                      <Info className="w-4 h-4" />
                    )}
                    {f}
                  </span>
                ))}
              </div>

              {/* Button */}
              <a
                href={`/rooms/${room.id}`}
                className="block mt-6 bg-gradient-to-r from-indigo-500 to-blue-500
                           text-white text-center py-2.5 rounded-xl font-semibold
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
