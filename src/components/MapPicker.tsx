"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { MapPin, Search, Crosshair, X, Loader2, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Fix default marker icons for Leaflet in Next.js
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const pickupIcon = L.divIcon({
  html: `<div style="background: #0ff; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid #fff; box-shadow: 0 0 15px rgba(0,255,255,0.6); display: flex; align-items: center; justify-content: center;">
    <div style="width: 10px; height: 10px; background: #fff; border-radius: 50%; transform: rotate(45deg);"></div>
  </div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  className: "",
});

const dropoffIcon = L.divIcon({
  html: `<div style="background: #ff6b35; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid #fff; box-shadow: 0 0 15px rgba(255,107,53,0.6); display: flex; align-items: center; justify-content: center;">
    <div style="width: 10px; height: 10px; background: #fff; border-radius: 50%; transform: rotate(45deg);"></div>
  </div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  className: "",
});

export interface LocationData {
  address: string;
  lat: number;
  lng: number;
  mapUrl: string;
}

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
  place_id: number;
}

// Inner component: handles map click events
function MapClickHandler({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Inner component: flies to position
function FlyToPosition({ position }: { position: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 15, { duration: 1.2 });
    }
  }, [map, position]);
  return null;
}

// Main MapPicker component
export default function MapPicker({
  type,
  value,
  onChange,
}: {
  type: "pickup" | "dropoff";
  value: LocationData | null;
  onChange: (data: LocationData) => void;
}) {
  const [open, setOpen] = useState(false);
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(
    value ? [value.lat, value.lng] : null
  );
  const [address, setAddress] = useState(value?.address || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [reverseLoading, setReverseLoading] = useState(false);
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isPickup = type === "pickup";
  const label = isPickup ? "Pickup Location" : "Drop-off Location";
  const color = isPickup ? "cyan" : "orange";

  // Sri Lanka center
  const sriLankaCenter: [number, number] = [7.8731, 80.7718];

  // Reverse geocode: coords → address (Nominatim, free)
  const reverseGeocode = useCallback(
    async (lat: number, lng: number) => {
      setReverseLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
          {
            headers: {
              "Accept-Language": "en",
            },
          }
        );
        const data = await res.json();
        const addr = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        setAddress(addr);
        return addr;
      } catch {
        const fallback = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        setAddress(fallback);
        return fallback;
      } finally {
        setReverseLoading(false);
      }
    },
    []
  );

  // Handle map click
  const handleMapClick = useCallback(
    async (lat: number, lng: number) => {
      setMarkerPos([lat, lng]);
      setFlyTo([lat, lng]);
      await reverseGeocode(lat, lng);
    },
    [reverseGeocode]
  );

  // Search places (Nominatim, free)
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&countrycodes=lk&limit=5`,
        {
          headers: {
            "Accept-Language": "en",
          },
        }
      );
      const data: SearchResult[] = await res.json();
      setSearchResults(data);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  // Debounce search
  const onSearchInputChange = (val: string) => {
    setSearchQuery(val);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => handleSearch(val), 600);
  };

  // Select a search result
  const selectSearchResult = async (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setMarkerPos([lat, lng]);
    setFlyTo([lat, lng]);
    setAddress(result.display_name);
    setSearchResults([]);
    setSearchQuery("");
  };

  // Confirm selected location
  const confirmLocation = () => {
    if (markerPos && address) {
      const mapUrl = `https://www.openstreetmap.org/?mlat=${markerPos[0]}&mlon=${markerPos[1]}#map=15/${markerPos[0]}/${markerPos[1]}`;
      onChange({
        address,
        lat: markerPos[0],
        lng: markerPos[1],
        mapUrl,
      });
      setOpen(false);
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setMarkerPos([lat, lng]);
        setFlyTo([lat, lng]);
        await reverseGeocode(lat, lng);
      },
      () => {
        // Fallback to Sri Lanka center
        setFlyTo(sriLankaCenter);
      }
    );
  };

  return (
    <div className="space-y-2">
      {/* Trigger button area */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all duration-300 cursor-pointer ${
          value
            ? `border-${color === "cyan" ? "cyan" : "orange"}-500/30 bg-${color === "cyan" ? "cyan" : "orange"}-500/5`
            : "border-cyan-500/15 bg-dark/80"
        } hover:border-${color === "cyan" ? "cyan" : "orange"}-400 hover:shadow-[0_0_15px_rgba(${color === "cyan" ? "0,255,255" : "255,107,53"},0.15)]`}
      >
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            isPickup ? "bg-cyan-500/15" : "bg-orange-500/15"
          }`}
        >
          <MapPin className={`w-4 h-4 ${isPickup ? "text-cyan-400" : "text-orange-400"}`} />
        </div>
        <div className="flex-1 min-w-0">
          {value ? (
            <>
              <div className="text-xs text-gray-500 mb-0.5">{label}</div>
              <div className="text-gray-200 truncate text-sm">{value.address}</div>
            </>
          ) : (
            <span className="text-gray-500">Tap to select {label.toLowerCase()}...</span>
          )}
        </div>
        {value && (
          <Badge variant={isPickup ? "default" : "orange"} className="shrink-0 text-[10px]">
            <Navigation className="w-3 h-3 mr-1" />
            Selected
          </Badge>
        )}
      </button>

      {/* Map preview when selected */}
      {value && (
        <div className="flex items-center gap-2">
          <a
            href={value.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs ${isPickup ? "text-cyan-400" : "text-orange-400"} hover:underline flex items-center gap-1`}
          >
            <MapPin className="w-3 h-3" />
            View on OpenStreetMap
          </a>
          <span className="text-gray-600 text-xs">
            ({value.lat.toFixed(4)}, {value.lng.toFixed(4)})
          </span>
        </div>
      )}

      {/* Map Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl h-[85vh] flex flex-col p-0 gap-0 bg-darker border-card-border">
          {/* Header */}
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="font-orbitron flex items-center gap-2 text-lg">
              <MapPin className={`w-5 h-5 ${isPickup ? "text-cyan-400" : "text-orange-400"}`} />
              Select {label}
            </DialogTitle>
            <DialogDescription>
              Search for a location or click on the map to place a pin
            </DialogDescription>
          </DialogHeader>

          {/* Search bar */}
          <div className="px-4 py-3 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search places in Sri Lanka..."
                value={searchQuery}
                onChange={(e) => onSearchInputChange(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search Results dropdown */}
            {(searchResults.length > 0 || searching) && (
              <Card className="absolute z-[1000] left-4 right-4 max-h-48 overflow-y-auto">
                <CardContent className="p-1">
                  {searching ? (
                    <div className="flex items-center gap-2 p-3 text-sm text-gray-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Searching...
                    </div>
                  ) : (
                    searchResults.map((r) => (
                      <button
                        key={r.place_id}
                        type="button"
                        onClick={() => selectSearchResult(r)}
                        className="w-full text-left px-3 py-2.5 text-sm text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-400 rounded-lg transition-colors flex items-start gap-2"
                      >
                        <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{r.display_name}</span>
                      </button>
                    ))
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quick actions */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={getCurrentLocation}
              >
                <Crosshair className="w-3.5 h-3.5" />
                My Location
              </Button>
              {markerPos && (
                <Badge
                  variant={isPickup ? "default" : "orange"}
                  className="text-xs flex items-center"
                >
                  {reverseLoading ? (
                    <Loader2 className="w-3 h-3 animate-spin mr-1" />
                  ) : (
                    <MapPin className="w-3 h-3 mr-1" />
                  )}
                  Pin placed
                </Badge>
              )}
            </div>
          </div>

          {/* Map */}
          <div className="flex-1 relative mx-4 mb-2 rounded-xl overflow-hidden border border-card-border">
            <MapContainer
              center={markerPos || sriLankaCenter}
              zoom={markerPos ? 15 : 8}
              style={{ height: "100%", width: "100%" }}
              attributionControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <MapClickHandler onLocationSelect={handleMapClick} />
              <FlyToPosition position={flyTo} />
              {markerPos && (
                <Marker
                  position={markerPos}
                  icon={isPickup ? pickupIcon : dropoffIcon}
                  draggable
                  eventHandlers={{
                    dragend: (e) => {
                      const latlng = e.target.getLatLng();
                      handleMapClick(latlng.lat, latlng.lng);
                    },
                  }}
                />
              )}
            </MapContainer>

            {/* Map overlay instructions */}
            {!markerPos && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[500]">
                <Badge className="bg-darker/90 backdrop-blur-sm text-gray-300 border-card-border px-4 py-2">
                  👆 Click anywhere on the map to place a pin
                </Badge>
              </div>
            )}
          </div>

          {/* Address display + Confirm */}
          <div className="px-4 pb-4 space-y-3">
            {address && (
              <Card className="p-3">
                <CardContent className="p-0">
                  <div className="flex items-start gap-2">
                    <MapPin className={`w-4 h-4 shrink-0 mt-0.5 ${isPickup ? "text-cyan-400" : "text-orange-400"}`} />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 mb-0.5">Selected Address</p>
                      <p className="text-sm text-gray-200 break-words">{address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant={isPickup ? "default" : "orange"}
                className="flex-1"
                disabled={!markerPos || !address || reverseLoading}
                onClick={confirmLocation}
              >
                {reverseLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4" />
                    Confirm {isPickup ? "Pickup" : "Drop-off"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
