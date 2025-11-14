import { MapPin, Users, Info } from "lucide-react";
import Image from "next/image";

type Room = {
  id: string;
  name: string;
  location: string;
  capacity: number;
  features: string[];
  photo_url: string | null;
};

export default async function RoomsPage() {
  const res = await fetch("http://localhost:4000/rooms", {
    cache: "no-store",
  });

  if (!res.ok) {
    return <div>Fehler beim Laden der Räume.</div>;
  }

  const rooms: Room[] = await res.json();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Alle Gruppenräume</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <a
            key={room.id}
            href={`/rooms/${room.id}`}
            className="group block rounded-2xl overflow-hidden bg-white shadow hover:shadow-xl transition border border-gray-200"
          >
            {/* Bild */}
            <div className="relative h-44 w-full">
              {room.photo_url ? (
                <Image
                  src={room.photo_url}
                  alt={room.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>

            {/* Inhalt */}
            <div className="p-5">
              <h2 className="text-xl font-semibold mb-1">{room.name}</h2>

              {/* Ort */}
              <p className="text-gray-600 flex items-center gap-2 mb-2">
                <MapPin size={18} className="text-blue-700" />
                {room.location}
              </p>

              {/* Kapazität */}
              <p className="text-gray-700 flex items-center gap-2 mb-2">
                <Users size={18} className="text-blue-700" />
                {room.capacity} Personen
              </p>

              {/* Ausstattung */}
              <p className="text-gray-700 flex items-center gap-2">
                <Info size={18} className="text-blue-700" />
                {room.features?.length > 0
                  ? room.features.join(", ")
                  : "Standard-Ausstattung"}
              </p>
            </div>

            {/* Footer */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white text-center py-3 text-sm font-medium">
              → Details & Verfügbarkeit
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
