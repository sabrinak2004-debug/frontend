export default async function RoomDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  // params aus dem Promise holen
  const { id } = await props.params;

  // Daten aus dem Backend laden
  const res = await fetch(`http://localhost:4000/rooms/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <div>Fehler beim Laden des Raumes.</div>;
  }

  const room = await res.json();

  return (
    <div style={{ padding: "40px" }}>
      <h1>{room.name}</h1>
      <p>{room.description}</p>

      <p>
        <strong>Kapazität:</strong> {room.capacity}
      </p>

      <p>
        <strong>Ort:</strong> {room.location}
      </p>

      <p>
        <strong>Ausstattung:</strong> {room.equipment}
      </p>
    </div>
  );
}
