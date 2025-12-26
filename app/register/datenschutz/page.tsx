export default function DatenschutzPage() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Datenschutzerklärung</h1>

      <p className="mb-4">
        Verantwortlich für die Datenverarbeitung:
      </p>

      <p className="mb-4">
        <strong>Sabrina Klausmeier</strong><br />
        E-Mail: deine-email@adresse.de
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        Zweck der Datenverarbeitung
      </h2>
      <p className="mb-4">
        Diese Webanwendung dient der Buchung von Gruppenarbeitsräumen
        für Studierende der Universität Hohenheim.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        Verarbeitete Daten
      </h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Benutzername</li>
        <li>Universitäts-E-Mail-Adresse</li>
        <li>Passwort (verschlüsselt)</li>
        <li>Rolle</li>
        <li>Buchungsdaten</li>
      </ul>

      <p className="mt-8 text-sm text-gray-500">
        Stand: {new Date().toLocaleDateString("de-DE")}
      </p>
    </main>
  );
}
