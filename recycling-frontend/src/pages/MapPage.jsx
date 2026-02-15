import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { api } from '../api';
import { clearAuth, getUser } from '../auth/auth';
import ReportForm from '../components/ReportForm';
import Modal from '../components/Modal';
import NewLocationForm from '../components/NewLocationForm';
import Leaderboard from '../components/Leaderboard.jsx';

function MapEvents({ onBoundsChange, onMapClick }) {
  useMapEvents({
    moveend: (e) => onBoundsChange(e.target.getBounds()),
    zoomend: (e) => onBoundsChange(e.target.getBounds()),
    click: (e) => onMapClick?.(e.latlng),
  });
  return null;
}

export default function MapPage() {
  const [wasteTypes, setWasteTypes] = useState([]);
  const [selectedWasteType, setSelectedWasteType] = useState('');
  const [locations, setLocations] = useState([]);

  const [user, setUser] = useState(() => getUser());
  const [proposeMode, setProposeMode] = useState(false);
  const [proposedPoint, setProposedPoint] = useState(null); // {lat, lng}
  const [lbKey, setLbKey] = useState(0);

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
    fetchLocations(null, selectedWasteType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchLocations(null, selectedWasteType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWasteType]);

  return (
      <div style={{ height: 'calc(100vh - 0px)', display: 'flex' }}>
        {/* Sidebar */}
        <div
            style={{
              width: 340,
              padding: 16,
              borderRight: '1px solid #e5e7eb',
              background: '#fff',
              overflowY: 'auto',
            }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0 }}>Recycling Map</h2>
            <div style={{ fontSize: 12, color: '#6b7280' }}>
              {locations.length} locații
            </div>
          </div>

          {/* Filtru */}
          <div style={{ marginTop: 14 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: '#374151' }}>
              Filtru categorie
            </label>
            <select
                style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #d1d5db' }}
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
          </div>

          {/* Propune locație */}
          <button
              onClick={() => {
                if (!user) {
                  alert('Trebuie să fii logat ca să propui o locație.');
                  return;
                }
                setProposeMode((v) => !v);
                setProposedPoint(null);
              }}
              style={{
                marginTop: 14,
                width: '100%',
                padding: 12,
                borderRadius: 10,
                background: proposeMode ? '#059669' : '#2563eb',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 800,
              }}
          >
            {proposeMode ? 'Mod propunere: ON (click pe hartă)' : 'Propune locație nouă'}
          </button>

          {/* Leaderboard */}
          <Leaderboard refreshKey={lbKey} />

          <div style={{ marginTop: 10, fontSize: 12, color: '#6b7280' }}>
            Tip: mută harta / zoom ca să reîncarce locațiile din zonă.
          </div>
        </div>

        {/* Map */}
        <div style={{ flex: 1 }}>
          <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
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

            {locations.map((loc) => (
                <Marker key={loc.id} position={[loc.latitude, loc.longitude]}>
                  <Popup>
                    <div style={{ minWidth: 240 }}>
                      {/* Info locație */}
                      <div style={{ fontWeight: 800 }}>{loc.name}</div>
                      <div style={{ fontSize: 13, marginTop: 4 }}>{loc.address}</div>

                      {loc.acceptedWasteTypes?.length > 0 && (
                          <div style={{ marginTop: 8, fontSize: 12, color: '#374151' }}>
                            Acceptă: {loc.acceptedWasteTypes.join(', ')}
                          </div>
                      )}

                      {/* Report */}
                      <div style={{ marginTop: 10 }}>
                        {user ? (
                            <ReportForm
                                locationId={loc.id}
                                onSuccess={() => setLbKey((k) => k + 1)}
                            />
                        ) : (
                            <div style={{ fontSize: 12, color: '#6b7280' }}>
                              Trebuie să fii logat ca să trimiți o raportare.
                            </div>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
            ))}

            {/* marker temporar */}
            {proposedPoint && (
                <Marker position={[proposedPoint.lat, proposedPoint.lng]}>
                  <Popup>Locație propusă</Popup>
                </Marker>
            )}

            {/* modal propunere */}
            <Modal
                open={!!proposedPoint}
                title="Propune locație nouă"
                onClose={() => setProposedPoint(null)}
            >
              <NewLocationForm
                  lat={proposedPoint?.lat ?? 0}
                  lng={proposedPoint?.lng ?? 0}
                  onCancel={() => setProposedPoint(null)}
                  onSubmitted={() => {
                    setProposedPoint(null);
                    setProposeMode(false);
                    // Nu apare până nu aprobă adminul, dar reîncarc pentru consistență
                    fetchLocations(null, selectedWasteType);
                  }}
              />
            </Modal>
          </MapContainer>
        </div>
      </div>
  );
}
