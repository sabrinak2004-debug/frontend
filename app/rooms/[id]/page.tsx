import Image from "next/image";
import Link from "next/link";
import AvailabilityForm from "./AvailabilityForm";

type Room = {
  id: string;
  name: string;
  description: string;
  capacity: number;
  features: string[];
  photo_url: string | null;
  location: string;
};

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Params auflösen
  const { id } = await params;

  // Raumdaten laden
  const res = await fetch(`http://localhost:4000//rooms/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div className="p-10 text-red-600">Fehler beim Laden des Raumes.</div>
    );
  }

  const room: Room = await res.json();

  return (
    <div className="p-10 max-w-6xl mx-auto">
      
      <Link href="/rooms" className="text-slate-600 hover:underline mb-6 block">
      ← Zurück zur Übersicht
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* LEFT: Raumdetails */}
        <div>
          <div className="w-full h-72 relative mb-6 rounded-xl overflow-hidden shadow-md">
            <Image
              src={room.photo_url ?? "/fallback.jpg"}
              alt="Raumbild"
              fill
              className="object-cover"
            />
          </div>

          <h1 className="text-3xl font-bold">{room.name}</h1>
          <p className="text-gray-700 mt-2">{room.location}</p>

          <p className="text-gray-700 leading-relaxed mt-6">
            {room.description}
          </p>

          <h2 className="text-lg font-semibold mt-6">Kapazität</h2>
          <p className="text-gray-700 mb-4">👤 {room.capacity} Personen</p>

          <h2 className="text-lg font-semibold mb-2">Ausstattung</h2>

          <div className="flex flex-wrap gap-2">
            {room.features?.length > 0 ? (
              room.features.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {item}
                </span>
              ))
            ) : (
              <p className="text-gray-500">Keine Angaben</p>
            )}
          </div>
        </div>

        {/* RIGHT: Buchungsformular */}
        <AvailabilityForm roomId={room.id} />
      </div>
    </div>
  );
}
