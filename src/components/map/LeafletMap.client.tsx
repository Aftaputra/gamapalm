"use client";

import { useEffect, useState } from "react";

export type LatLng = { lat: number; lng: number };

type Props = {
  center: LatLng;
  zoom?: number;
  height?: number | string;
  markers?: LatLng[];
};

export default function LeafletMapClient({ center, zoom = 12, height = 360, markers = [] }: Props) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return <div style={{ height }} className="w-full rounded-lg bg-slate-200 animate-pulse" />;

  const { MapContainer, TileLayer, Marker, Popup } = require("react-leaflet");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const L = require("leaflet");
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });

  return (
    <div style={{ height }} className="w-full overflow-hidden rounded-lg">
      <MapContainer center={[center.lat, center.lng]} zoom={zoom} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((m, i) => (
          <Marker key={i} position={[m.lat, m.lng]}>
            <Popup>Marker #{i + 1}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}