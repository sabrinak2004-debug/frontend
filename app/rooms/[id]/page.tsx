import Image from "next/image";

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

  // Daten laden
  const res = await fetch(`http://localhost:4000/rooms/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <div className="p-10 text-red-600">Fehler beim Laden des Raumes.</div>;
  }

  const room: Room = await res.json();

  return (
    <div className="p-10 max-w-4xl mx-auto">

      {/* NAME */}
      <h1 className="text-4xl font-bold mb-6">{room.name}</h1>

      {/* BILD */}
      <div className="w-full h-72 relative mb-6 rounded-xl overflow-hidden shadow-md">
        <Image
          src={room.photo_url ?? "/fallback.jpg"}
          alt="Raumbild"
          fill
          className="object-cover"
        />
      </div>

      {/* ZWEI SPALTEN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* LINKS: Beschreibung */}
        <div className="bg-gray-50 p-20 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Beschreibung</h2>
          <p className="text-gray-700 leading-relaxed">{room.description}</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">Ort</h2>
          <p className="text-gray-700">{room.location}</p>
          <h2 className="text-lg font-semibold mb-2">Kapazität</h2>
          <p className="text-gray-700 mb-4">
            👥 {room.capacity} Personen
          </p>

          <h2 className="text-lg font-semibold mb-2">Ausstattung</h2>

          <div className="flex flex-wrap gap-2">
            {room.features && room.features.length > 0 ? (
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

          {/* Button */}
          <a
            href={`/rooms/${id}/availability`}
            className="mt-6 block bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Verfügbarkeit prüfen →
          </a>
        </div>
      </div>
    </div>
  );
}
