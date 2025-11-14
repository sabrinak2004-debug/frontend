import Image from "next/image";
import { MapPin, Users, Info } from "lucide-react";

type Room = {
  id: string;
  name: string;
  location: string;
  capacity: number;
  features: string[];
  photo_url: string | null;
};

export default async function RoomsPage() {
  const res = await fetch("http://localhost:4000/rooms", { cache: "no-store" });
  const rooms: Room[] = await res.json();

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-6">Alle Gruppenräume</h1>

      <div className="flex flex-col gap-10">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-xl shadow border overflow-hidden w-full max-w-4xl"
          >
            {/* FOTO */}
            {room.photo_url && (
              <Image
                src={room.photo_url}
                alt={room.name}
                width={1600}
                height={600}
                className="w-full h-64 object-cover"
              />
            )}

            {/* TEXTE */}
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-3">{room.name}</h2>

              <div className="flex flex-col gap-2 text-gray-700">

                <p className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  {room.location}
                </p>

                <p className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  {room.capacity} Personen
                </p>

                <p className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  {room.features.join(", ")}
                </p>
              </div>
            </div>

            {/* FOOTER BUTTON */}
            <a
              href={`/rooms/${room.id}`}
              className="block text-center bg-blue-600 text-white py-3 font-medium hover:bg-blue-700 transition"
            >
              → Details & Verfügbarkeit
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
