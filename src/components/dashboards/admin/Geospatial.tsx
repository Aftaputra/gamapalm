// Ganti kode GeospatialView yang tadi dengan yang ini di AdminDashboard.tsx

// Pastikan ini sudah ada di atas file
import { MapContainer, TileLayer } from 'react-leaflet';

// --- 4. KOMPONEN GEOSPATIAL (VERSI PROTOTIPE SIMPEL) ---
const GeospatialView = () => {
    // Tentukan posisi default peta, kita set ke Jakarta aja
    const defaultPosition: [number, number] = [-6.2088, 106.8456]; 

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 h-[600px] w-full flex flex-col">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-800">Tampilan Peta Geospasial</h2>
                <p className="text-sm text-slate-500 mt-1">Prototipe peta dasar menggunakan OpenStreetMap.</p>
            </div>
            <div className="flex-grow rounded-lg overflow-hidden z-0">
                <MapContainer center={defaultPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {/* Gak ada Marker atau Popup di sini, cuma peta polosan */}
                </MapContainer>
            </div>
        </div>
    );
};