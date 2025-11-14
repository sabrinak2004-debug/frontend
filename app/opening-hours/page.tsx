"use client";

import { useEffect, useState } from "react";

type OpeningHour = {
  weekday: number;       // 0–6
  opens: string;         // Zeit als String
  closes: string;
  is_closed: boolean;
  note: string | null;
};

type Exception = {
  id: number;
  date: string;
  opens: string | null;
  closes: string | null;
  is_closed: boolean;
  reason: string | null;
};

const WEEKDAYS = [
  "Sonntag",
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
];

export default function OpeningHoursPage() {
  const [week, setWeek] = useState<OpeningHour[]>([]);
  const [exceptions, setExceptions] = useState<Exception[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch("http://localhost:4000/opening-hours");
      const data = await res.json();
      setWeek(data.week ?? []);
      setExceptions(data.exceptions ?? []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <div className="p-10">Öffnungszeiten werden geladen…</div>;
  }

  return (
    <div className="p-10 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Öffnungszeiten</h1>

      {/* Wöchentliche Zeiten */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Reguläre Zeiten</h2>
        <div className="bg-white border rounded shadow p-4">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Tag</th>
                <th className="py-2">Zeit</th>
                <th className="py-2">Hinweis</th>
              </tr>
            </thead>
            <tbody>
              {week.map((row) => (
                <tr key={row.weekday} className="border-b last:border-b-0">
                  <td className="py-2 font-medium">
                    {WEEKDAYS[row.weekday]}
                  </td>
                  <td className="py-2">
                    {row.is_closed
                      ? "Geschlossen"
                      : `${row.opens.slice(0, 5)} – ${row.closes.slice(0, 5)}`}
                  </td>
                  <td className="py-2 text-sm text-gray-600">
                    {row.note || ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Ausnahmen */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Feiertage & Ausnahmen</h2>

        {exceptions.length === 0 ? (
          <p>Aktuell sind keine Ausnahmen eingetragen.</p>
        ) : (
          <ul className="space-y-2 bg-white border rounded shadow p-4">
            {exceptions.map((ex) => (
              <li key={ex.id} className="flex justify-between">
                <span>
                  {new Date(ex.date).toLocaleDateString("de-DE")} –{" "}
                  {ex.reason || "Sonderregelung"}
                </span>
                <span className="text-sm text-gray-700">
                  {ex.is_closed
                    ? "Geschlossen"
                    : ex.opens && ex.closes
                    ? `${ex.opens.slice(0, 5)} – ${ex.closes.slice(0, 5)}`
                    : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
