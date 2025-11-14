import Image from "next/image";

type Room = {
  id: string;
  name: string;
  capacity: number;
  location: string;
  description: string;
  features: string[];
  photo_url: string | null;
};

export default async function RoomsPage() {
  const res = await fetch("http://localhost:4000/rooms", { cache: "no-store" });
  const rooms: Room[] = await res.json();

  return (
    <div className="p-10">

      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-10 rounded-2xl shadow-lg mb-10">
        <h1 className="text-4xl font-bold">Gruppenräume buchen</h1>
        <p className="text-lg mt-2">
          Finden Sie den perfekten Raum für Ihre Lerngruppe oder Ihr Projekt in der
          Zentralbibliothek der Universität Hohenheim
        </p>
      </div>

      {/* SUCHFELD */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Raum suchen..."
          className="w-full border rounded-xl px-4 py-3 shadow-sm"
        />
      </div>

      {/* RAUMKARTEN 3-SPALTIG */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-2xl shadow-md border overflow-hidden"
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

              {/* Kapazitäts-Badge */}
              <div className="absolute top-3 right-3 bg-black/70 text-white text-sm px-3 py-1 rounded-lg">
                👥 {room.capacity} Personen
              </div>
            </div>

            {/* Inhalt */}
            <div className="p-5">
              <h2 className="text-xl font-semibold">{room.name}</h2>
              <p className="text-gray-500 mt-1 flex items-center gap-1">
                📍 {room.location}
              </p>

              <p className="mt-2 text-gray-700 line-clamp-2">
                {room.description}
              </p>

              {/* FEATURES */}
              <div className="flex flex-wrap gap-2 mt-4">
                {room.features?.map((f) => (
                  <span
                    key={f}
                    className="bg-gray-100 border px-2 py-1 rounded-lg text-sm flex items-center"
                  >
                    💬 {f}
                  </span>
                ))}

                {room.features?.length === 0 && (
                  <span className="bg-gray-100 border px-2 py-1 rounded-lg text-sm">
                    WLAN
                  </span>
                )}
              </div>

              {/* BUTTON */}
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
    </div>
  );
}
