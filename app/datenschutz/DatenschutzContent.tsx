export default function DatenschutzPage() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Datenschutzerklärung</h1>

      <p className="mb-4">
        Verantwortlich für die Datenverarbeitung auf dieser Website ist:
      </p>

      <p className="mb-4">
        <strong>Sabrina Klausmeier</strong><br />
        E-Mail: sabrinak2004@gmx.de
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        Zweck der Datenverarbeitung
      </h2>
      <p className="mb-4">
        Diese Webanwendung dient der Buchung von Gruppenarbeitsräumen für
        Studierende der Universität Hohenheim.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        Verarbeitete Daten
      </h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Benutzername</li>
        <li>Universitäts-E-Mail-Adresse</li>
        <li>Passwort (verschlüsselt / gehasht)</li>
        <li>Rolle (z. B. Student oder Administrator)</li>
        <li>Buchungsdaten (Raum, Datum, Uhrzeit, Status)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        Rechte der betroffenen Personen
      </h2>
      <p className="mb-4">
        Nutzer haben das Recht auf Auskunft, Berichtigung, Löschung sowie
        Einschränkung der Verarbeitung ihrer personenbezogenen Daten gemäß DSGVO.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        Cookies / Session
      </h2>
      <p className="mb-4">
        Die Anwendung verwendet technisch notwendige Cookies bzw. Session-Informationen,
        die für die Authentifizierung und den sicheren Betrieb der Plattform erforderlich
        sind. Diese Cookies sind notwendig, um den Login-Status aufrechtzuerhalten und
        die Nutzung der Anwendung zu ermöglichen. 
        
        Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.
      </p>

      <p className="mt-8 text-sm text-gray-500">
        Stand: {new Date().toLocaleDateString("de-DE")}
      </p>
    </main>
  );
}
