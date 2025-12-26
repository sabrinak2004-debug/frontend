"use client";

import { useState, useCallback } from "react";
import { getUserId } from "@/lib/auth";
import { API } from "@/lib/auth";
import {
  CalendarDays,
  Clock,
  Users,
  FileText,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";

type Slot = { start: string; end: string };
type BookingAPI = { starts_at: string; ends_at: string };

export default function AvailabilityForm({ roomId }: { roomId: string }) {
  const userId = getUserId();

  // Form states
  const [date, setDate] = useState(() =>
    new Date().toISOString().substring(0, 10)
  );
  const [slots, setSlots] = useState<Slot[]>([]);
  const [roomBookings, setRoomBookings] = useState<Slot[]>([]);

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [people, setPeople] = useState(1);
  const [purpose, setPurpose] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ----------------------------
  // Helper: Zeit in Minuten
  // ----------------------------
  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  // ----------------------------
  // Helper: Zeitüberschneidung
  // ----------------------------
  const isOverlapping = (s: string, e: string) => {
    const sMin = toMinutes(s);
    const eMin = toMinutes(e);

    return roomBookings.some((b) => {
      const bs = toMinutes(b.start);
      const be = toMinutes(b.end);
      return sMin < be && eMin > bs;
    });
  };

  // ----------------------------
  // Verfügbarkeit laden
  // ----------------------------
  const loadAvailability = useCallback(async () => {
    setError("");
    setMessage("");
    setStart("");
    setEnd("");

    const freeRes = await fetch(
      `${API}/rooms/${roomId}/availability?date=${date}`
    );
    const freeData = await freeRes.json();
    setSlots(freeData.free || []);

    const bookedRes = await fetch(
      `${API}/bookings/by-room-and-date?roomId=${roomId}&date=${date}`
    );
    const bookedData: BookingAPI[] = await bookedRes.json();

    setRoomBookings(
      bookedData.map((b) => ({
        start: b.starts_at.substring(11, 16),
        end: b.ends_at.substring(11, 16),
      }))
    );
  }, [date, roomId]);

  // ----------------------------
  // Endzeiten abhängig von Startzeit
  // ----------------------------
  const getEndOptions = () => {
    if (!start) return [];
    const idx = slots.findIndex((s) => s.start === start);
    return slots.slice(idx + 1);
  };

  // ----------------------------
  // Buchung senden
  // ----------------------------
  async function book() {
    if (!start || !end) {
      setError("Bitte Start- und Endzeit auswählen.");
      return;
    }

    if (!userId) {
      setError("Bitte zuerst einloggen.");
      return;
    }

    if (isOverlapping(start, end)) {
      setError("❌ Dieser Zeitraum ist bereits belegt.");
      return;
    }

    const payload = {
      roomId,
      userId,
      date,
      start,
      end,
      peopleCount: people,
      purpose,
    };

    const res = await fetch(`${API}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Fehler beim Buchen");
      return;
    }

    setMessage("✔️ Buchung erfolgreich gespeichert!");
    loadAvailability();
  }

  const inputCls =
    "w-full h-12 rounded-xl border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500";
  const labelCls = "text-sm font-semibold text-slate-800 flex items-center gap-2";

  return (
    <div className="bg-white p-7 rounded-2xl shadow-md border border-slate-200">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-7">
        <div className="h-11 w-11 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
          <CalendarDays className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Raum buchen</h2>
      </div>

      {/* ERRORS */}
      {error && (
        <div className="flex items-start gap-2 mb-4 p-4 rounded-xl border border-red-300 bg-red-50 text-red-700">
          <AlertCircle className="w-5 h-5 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* SUCCESS */}
      {message && (
        <div className="flex items-start gap-2 mb-4 p-4 rounded-xl border border-green-300 bg-green-50 text-green-700">
          <CheckCircle2 className="w-5 h-5 mt-0.5" />
          <span>{message}</span>
        </div>
      )}

      {/* DATUM */}
      <label className={labelCls}>
        <CalendarDays className="w-4 h-4" />
        Datum
      </label>
      <input
        type="date"
        value={date}
        className={inputCls}
        onChange={(e) => setDate(e.target.value)}
      />

      <button
        onClick={loadAvailability}
        type="button"
        className="mt-4 w-full h-12 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition"
      >
        Verfügbarkeit prüfen
      </button>

      {/* INFOBOX: BUCHUNGSREGELN */}
      {slots.length > 0 && (
        <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-700 text-red " />
            Hinweise zur Buchung (Fair-Use)
          </h3>
          <ul className="mt-3 text-slate-700 space-y-1 text-sm list-disc pl-5">
            <li>Buchungen sind nur für 14 Tage im Voraus möglich.</li>
            <li>Pro Person sind nur 3 aktive Buchungen erlaubt.</li>
            <li>Bitte storniert eure Buchung, wenn ihr den Raum nicht nutzen könnt.</li>
            <li>Der Raum ist pünktlich zu verlassen und ordentlich zu hinterlassen.</li>
            <li>Eine Buchung hat eine Maximaldauer von 3 Stunden</li>
          </ul>
        </div>
      )}

      {/* START & END ZEIT */}
      {slots.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-7">
          <div>
            <label className={labelCls}>
              <Clock className="w-4 h-4" />
              Startzeit
            </label>
            <select
              className={inputCls}
              value={start}
              onChange={(e) => setStart(e.target.value)}
            >
              <option value="">Wählen…</option>
              {slots.map((s) => (
                <option key={s.start} value={s.start}>
                  {s.start}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>
              <Clock className="w-4 h-4" />
              Endzeit
            </label>
            <select
              className={inputCls}
              value={end}
              disabled={!start}
              onChange={(e) => setEnd(e.target.value)}
            >
              <option value="">Wählen…</option>
              {getEndOptions().map((s) => (
                <option key={s.end} value={s.end}>
                  {s.end}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* PERSONEN */}
      {slots.length > 0 && (
        <div className="mt-6">
          <label className={labelCls}>
            <Users className="w-4 h-4" />
            Anzahl Personen
          </label>
          <input
            type="number"
            min={1}
            value={people}
            onChange={(e) => setPeople(Number(e.target.value))}
            className={inputCls}
          />
        </div>
      )}

      {/* ZWECK */}
      {slots.length > 0 && (
        <div className="mt-6">
          <label className={labelCls}>
            <FileText className="w-4 h-4" />
            Zweck (optional)
          </label>
          <textarea
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className={`${inputCls} h-28 resize-none`}
          />
        </div>
      )}

      {/* BUCHEN */}
      {slots.length > 0 && (
        <button
          onClick={book}
          type="button"
          className="mt-8 w-full h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold hover:opacity-90 transition"
        >
          Jetzt buchen
        </button>
      )}

      {/* BEREITS GEBUCHTE ZEITEN */}
      {roomBookings.length > 0 && (
        <div className="mt-8 p-5 rounded-2xl bg-indigo-50 border border-indigo-200">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-700" />
            Belegte Zeiten am {date}:
          </h3>
          <ul className="mt-3 text-slate-700 space-y-1">
            {roomBookings.map((b, i) => (
              <li key={i}>
                ⏰ {b.start} – {b.end} Uhr
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
