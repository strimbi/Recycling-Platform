import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { api } from './api';

function MapEvents({ onBoundsChange }) {
    useMapEvents({
        moveend: (e) => onBoundsChange(e.target.getBounds()),
        zoomend: (e) => onBoundsChange(e.target.getBounds()),
    });
    return null;
}

export default function App() {
    const [wasteTypes, setWasteTypes] = useState([]);
    const [selectedWasteType, setSelectedWasteType] = useState('');
    const [locations, setLocations] = useState([]);

    // Cluj default (poți schimba)
    const center = useMemo(() => [46.7712, 23.6236], []);

    const fetchWasteTypes = async () => {
        const res = await api.get('/api/waste-types');
        setWasteTypes(res.data);
    };

    const fetchLocations = async (bounds, wasteType) => {
        const params = {};

        if (wasteType) params.wasteType = wasteType;

        if (bounds) {
            const sw = bounds.getSouthWest();
            const ne = bounds.getNorthEast();
            params.minLat = sw.lat;
            params.maxLat = ne.lat;
            params.minLng = sw.lng;
            params.maxLng = ne.lng;
        }

        const res = await api.get('/api/locations', { params });
        setLocations(res.data);
    };

    useEffect(() => {
        fetchWasteTypes();
        // încărcăm inițial fără bbox
        fetchLocations(null, selectedWasteType);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // când schimb filtrul, reîncarcă (fără bbox dacă nu avem încă)
    useEffect(() => {
        fetchLocations(null, selectedWasteType);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedWasteType]);

    return (
        <div style={{ height: '100vh', display: 'flex' }}>
            {/* Sidebar */}
            <div style={{ width: 320, padding: 16, borderRight: '1px solid #ddd' }}>
                <h2 style={{ marginTop: 0 }}>Recycling Map</h2>

                <label style={{ display: 'block', marginBottom: 8 }}>Filtru categorie</label>
                <select
                    style={{ width: '100%', padding: 8 }}
                    value={selectedWasteType}
                    onChange={(e) => setSelectedWasteType(e.target.value)}
                >
                    <option value="">Toate</option>
                    {wasteTypes.map((wt) => (
                        <option key={wt.id} value={wt.name}>
                            {wt.name}
                        </option>
                    ))}
                </select>

                <div style={{ marginTop: 16, fontSize: 14, color: '#555' }}>
                    Locații afișate: <b>{locations.length}</b>
                </div>

                <div style={{ marginTop: 16, fontSize: 12, color: '#777' }}>
                    Hartă publică (fără login). Raportările le adăugăm după ce facem login UI.
                </div>
            </div>

            {/* Map */}
            <div style={{ flex: 1 }}>
                <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapEvents
                        onBoundsChange={(bounds) => {
                            fetchLocations(bounds, selectedWasteType);
                        }}
                    />

                    {locations.map((loc) => (
                        <Marker key={loc.id} position={[loc.latitude, loc.longitude]}>
                            <Popup>
                                <div style={{ minWidth: 220 }}>
                                    <div style={{ fontWeight: 700 }}>{loc.name}</div>
                                    <div style={{ fontSize: 13 }}>{loc.address}</div>
                                    {loc.acceptedWasteTypes?.length > 0 && (
                                        <div style={{ marginTop: 8, fontSize: 12 }}>
                                            Acceptă: {loc.acceptedWasteTypes.join(', ')}
                                        </div>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}
