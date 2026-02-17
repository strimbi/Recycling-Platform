import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";

import { api } from "../api";
import { getUser } from "../auth/auth";
import Leaderboard from "../components/Leaderboard";
import ReportForm from "../components/ReportForm";
import NewLocationForm from "../components/NewLocationForm";
import Modal from "../components/Modal";
import "./MapPage.css";

function MapEvents({ onBoundsChange, onMapClick }) {
    useMapEvents({
        moveend: (e) => onBoundsChange(e.target.getBounds()),
        zoomend: (e) => onBoundsChange(e.target.getBounds()),
        click: (e) => onMapClick?.(e.latlng),
    });
    return null;
}

const WASTE_COLOR = {
    PLASTIC: "blue",
    GLASS: "green",
    PAPER: "orange",
    METAL: "teal",
    BATTERIES: "red",
    E_WASTE: "black",
    TEXTILE: "pink",
    OIL: "lila"
};

function markerColorForLocation(loc, selectedWasteType) {
    const types = loc.acceptedWasteTypes || [];

    if (selectedWasteType && types.includes(selectedWasteType)) {
        return WASTE_COLOR[selectedWasteType] || "gray";
    }
    if (types.length > 1) return "multi";
    if (types.length > 0) {
        return WASTE_COLOR[types[0]] || "gray";
    }

    return "gray";
}

function createPinIcon(color, { size = 26 } = {}) {
    const height = Math.round(size * 1.5);
    return L.divIcon({
        className: "waste-pin-wrapper",
        html: `
          <div class="waste-pin waste-pin--${color}" style="--pin-size:${size}px;">
            <svg viewBox="0 0 24 36" aria-hidden="true" focusable="false">
              <path class="waste-pin__shape" d="M12 0C6.477 0 2 4.477 2 10c0 7.5 10 26 10 26s10-18.5 10-26C22 4.477 17.523 0 12 0z"/>
              <circle class="waste-pin__inner" cx="12" cy="10" r="4"/>
            </svg>
          </div>
        `,
        iconSize: [size, height],
        iconAnchor: [size / 2, height],
        popupAnchor: [0, -height + 10],
    });
}

export default function MapPage() {
    const [wasteTypes, setWasteTypes] = useState([]);
    const [selectedWasteType, setSelectedWasteType] = useState("");
    const [locations, setLocations] = useState([]);
    const user = useMemo(() => getUser(), []);
    const [proposeMode, setProposeMode] = useState(false);
    const [proposedPoint, setProposedPoint] = useState(null);

    const center = useMemo(() => [46.7712, 23.6236], []);

    const fetchWasteTypes = async () => {
        const res = await api.get("/api/waste-types");
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

        const res = await api.get("/api/locations", { params });
        setLocations(res.data);
    };

    useEffect(() => {
        fetchWasteTypes();
        fetchLocations(null, selectedWasteType);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchLocations(null, selectedWasteType);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedWasteType]);

    return (
        <div className="page-container">
            {/* SIDEBAR */}
            <div className="sidebar">
                <h2>Recycling Map</h2>

                <label>Filtru categorie</label>
                <select
                    className="select"
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

                <p style={{ marginTop: 10 }}>
                    Locații afișate: <strong>{locations.length}</strong>
                </p>

                <button
                    className="btn-primary"
                    onClick={() => {
                        if (!user) return alert("Trebuie să fii logat.");
                        setProposeMode((v) => !v);
                        setProposedPoint(null);
                    }}
                >
                    {proposeMode ? "Mod propunere activ (click pe hartă)" : "Propune locație nouă"}
                </button>

                <div style={{ marginTop: 18 }} className="legend">
                    <div className="legend-title">Legendă marker</div>

                    {/* mov = multiple tipuri */}
                    <div className="legend-row">
                        <span className="legend-pin legend-pin--multi" />
                        <span>Mai multe tipuri</span>
                    </div>

                    {Object.entries(WASTE_COLOR).map(([type, color]) => (
                        <div key={type} className="legend-row">
                            <span className={`legend-pin legend-pin--${color}`} />
                            <span>{type}</span>
                        </div>
                    ))}
                </div>

                <Leaderboard />
            </div>

            {/* MAP */}
            <div className="map-wrapper">
                <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapEvents
                        onBoundsChange={(bounds) => fetchLocations(bounds, selectedWasteType)}
                        onMapClick={(latlng) => {
                            if (!proposeMode) return;
                            setProposedPoint({ lat: latlng.lat, lng: latlng.lng });
                        }}
                    />

                    {locations.map((loc) => {
                        const color = markerColorForLocation(loc, selectedWasteType);
                        const icon = createPinIcon(color, { size: 26 });

                        return (
                            <Marker key={loc.id} position={[loc.latitude, loc.longitude]} icon={icon}>
                                <Popup>
                                    <div className="popup-title">{loc.name}</div>
                                    <div className="popup-address">{loc.address}</div>

                                    {loc.acceptedWasteTypes?.length > 0 && (
                                        <div style={{ marginTop: 6, fontSize: 12 }}>
                                            Acceptă: {loc.acceptedWasteTypes.join(", ")}
                                        </div>
                                    )}

                                    {user ? (
                                        <div style={{ marginTop: 10 }}>
                                            <ReportForm locationId={loc.id} />
                                        </div>
                                    ) : (
                                        <div style={{ marginTop: 8, fontSize: 12 }}>
                                            Loghează-te pentru a trimite raport.
                                        </div>
                                    )}
                                </Popup>
                            </Marker>
                        );
                    })}

                    {proposedPoint && (
                        <Marker
                            position={[proposedPoint.lat, proposedPoint.lng]}
                            icon={createPinIcon("gray", { size: 34 })}
                        >
                            <Popup>Locație propusă</Popup>
                        </Marker>
                    )}

                    <Modal open={!!proposedPoint} title="Propune locație nouă" onClose={() => setProposedPoint(null)}>
                        <NewLocationForm
                            lat={proposedPoint?.lat ?? 0}
                            lng={proposedPoint?.lng ?? 0}
                            onCancel={() => setProposedPoint(null)}
                            onSubmitted={() => {
                                setProposedPoint(null);
                                setProposeMode(false);
                                fetchLocations(null, selectedWasteType);
                            }}
                        />
                    </Modal>
                </MapContainer>
            </div>
        </div>
    );
}
