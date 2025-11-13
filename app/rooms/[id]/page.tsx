export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // params aus Promise holen
  const { id } = await params;

  // Raum laden
  const res = await fetch(`http://localhost:4000/rooms/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <div>Fehler beim Laden des Raumes.</div>;
  }

  const room = await res.json();

  return (
    <div style={{ padding: "40px" }}>
      <h1 className="text-2xl font-bold mb-4">{room.name}</h1>
      <p className="mb-4">{room.description}</p>

      <p>
        <strong>Kapazität:</strong> {room.capacity}
      </p>

      <p>
        <strong>Ort:</strong> {room.location}
      </p>

      <p>
        <strong>Ausstattung:</strong> {room.equipment}
      </p>

      {/* ➤ HIER DER WICHTIGE BUTTON */}
      <a
        href={`/rooms/${id}/availability`}
        className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Verfügbarkeit prüfen →
      </a>
    </div>
  );
}
