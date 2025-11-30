import Image from "next/image";
import Link from "next/link";
import AvailabilityForm from "./AvailabilityForm";
import { API } from "@/lib/auth";
import {
  ArrowLeft,
  MapPin,
  Users,
  Info,
  CheckCircle2,
  XCircle,
} from "lucide-react";

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
  const { id } = await params;

  // Raum laden
  const res = await fetch(`${API}/rooms/${id}`, { cache: "no-store" });

  if (!res.ok) {
    return (
      <div className="p-10 text-red-600 text-lg">
        Fehler beim Laden des Raumes.
      </div>
    );
  }

  const room: Room = await res.json();

  return (
    <div className="p-4 md:p-10 max-w-6xl mx-auto">

      {/* Zurück */}
      <Link
        href="/rooms"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Zurück zur Übersicht
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* ----------------------------- */}
        {/* LEFT COLUMN — Raumdetails      */}
        {/* ----------------------------- */}
        <div>

          {/* Headerbild */}
          <div className="w-full h-64 md:h-80 relative rounded-xl overflow-hidden shadow-sm border border-gray-200">
            <Image
              src={room.photo_url ?? "/fallback.jpg"}
              alt={room.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Titel */}
          <h1 className="mt-8 text-4xl font-bold text-slate-900">
            {room.name}
          </h1>

          {/* Ort */}
          <div className="flex items-center gap-2 text-gray-600 mt-2">
            <MapPin className="w-4 h-4" />
            <span>{room.location}</span>
          </div>

          {/* Beschreibung */}
          <div className="mt-6 flex items-start gap-2 text-gray-700 leading-relaxed">
            <Info className="w-5 h-5 text-indigo-600 mt-1" />
            <p>{room.description}</p>
          </div>

          {/* Kapazität */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-1">
              Kapazität
            </h2>

            <div className="flex items-center gap-2 text-gray-700">
              <Users className="w-5 h-5" />
              <span>{room.capacity} Personen</span>
            </div>
          </div>

          {/* Ausstattung */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              Ausstattung
            </h2>

            {room.features?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {room.features.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-sm flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 flex items-center gap-1">
                <XCircle className="w-4 h-4" /> Keine Angaben
              </p>
            )}
          </div>
        </div>

        {/* ----------------------------- */}
        {/* RIGHT COLUMN — BUCHUNGSFORM    */}
        {/* ----------------------------- */}
        <div className="lg:sticky lg:top-20 h-fit">
          <div className="bg-white shadow-md border border-gray-200 rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Raum buchen
            </h2>

            <p className="text-gray-600 mb-6">
              Wählen Sie Datum & Uhrzeit, um eine Buchung anzulegen.
            </p>

            <AvailabilityForm roomId={room.id} />
          </div>
        </div>

      </div>
    </div>
  );
}
