"use client";

import dynamic from "next/dynamic";
import type { LocationData } from "@/components/MapPicker";
import { MapPin, Loader2 } from "lucide-react";

const MapPicker = dynamic(() => import("@/components/MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="w-full flex items-center gap-3 rounded-xl border border-primary/15 bg-background/80 px-4 py-3 text-sm text-muted-foreground">
      <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
        <MapPin className="w-4 h-4 text-amber-400" />
      </div>
      <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
      <span>Loading map...</span>
    </div>
  ),
});

export default function MapPickerWrapper({
  type,
  value,
  onChange,
}: {
  type: "pickup" | "dropoff";
  value: LocationData | null;
  onChange: (data: LocationData) => void;
}) {
  return <MapPicker type={type} value={value} onChange={onChange} />;
}

export type { LocationData };
