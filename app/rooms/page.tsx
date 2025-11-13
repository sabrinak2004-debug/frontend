export default async function RoomsPage() {
  // Backend URL
  const res = await fetch("http://localhost:4000/rooms", {
    cache: "no-store", // immer frische Daten
  });

  const rooms = await res.json();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">📅 Alle Gruppenräume</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {rooms.map((room: any) => (
          <div
            key={room.id}
            className="bg-white p-4 rounded shadow hover:shadow-md transition"
          >
            {/* Bild */}
            <img
              src={room.photo_url}
              alt={room.name}
              className="w-full h-40 object-cover rounded"
            />

            <h2 className="text-lg font-semibold mt-3">{room.name}</h2>

            <p className="text-gray-600">{room.location}</p>
            <p className="text-sm text-gray-500 mb-3">
              Kapazität: {room.capacity} Personen
            </p>

            <a
              href={`/rooms/${room.id}`}
              className="text-blue-600 hover:underline"
            >
              → Details ansehen
            </a>
          </div>
        ))}

      </div>
    </div>
  );
}
