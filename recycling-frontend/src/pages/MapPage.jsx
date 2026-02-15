import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { api, getApiErrorMessage } from '../api';

function MapEvents({ onBoundsChange }) {
  useMapEvents({
    moveend: (e) => onBoundsChange(e.target.getBounds()),
    zoomend: (e) => onBoundsChange(e.target.getBounds()),
  });
  return null;
}

export default function MapPage() {
  const [wasteTypes, setWasteTypes] = useState([]);
  const [selectedWasteType, setSelectedWasteType] = useState('');
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState('');

  // Cluj default (change if you want)
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
    (async () => {
      try {
        setError('');
        await fetchWasteTypes();
        await fetchLocations(null, selectedWasteType);
      } catch (e) {
        setError(getApiErrorMessage(e));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setError('');
        await fetchLocations(null, selectedWasteType);
      } catch (e) {
        setError(getApiErrorMessage(e));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWasteType]);

  return (
    <div className="page-grid">
      <section className="card sidebar">
        <h2 style={{ marginTop: 0 }}>Recycling Map</h2>

        {error && <div className="alert">{error}</div>}

        <label className="label">Waste type filter</label>
        <select
          className="input"
          value={selectedWasteType}
          onChange={(e) => setSelectedWasteType(e.target.value)}
        >
          <option value="">All</option>
          {wasteTypes.map((wt) => (
            <option key={wt.id} value={wt.name}>
              {wt.name}
            </option>
          ))}
        </select>

        <div className="muted" style={{ marginTop: 12 }}>
          Locations shown: <b>{locations.length}</b>
        </div>

        <div className="muted" style={{ marginTop: 12 }}>
          Tip: login to submit reports and earn points.
        </div>
      </section>

      <section className="card mapcard">
        <MapContainer center={center} zoom={13} style={{ height: '72vh', width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapEvents onBoundsChange={(bounds) => fetchLocations(bounds, selectedWasteType)} />

          {locations.map((loc) => (
            <Marker key={loc.id} position={[loc.latitude, loc.longitude]}>
              <Popup>
                <div style={{ minWidth: 220 }}>
                  <div style={{ fontWeight: 700 }}>{loc.name}</div>
                  <div style={{ fontSize: 13 }}>{loc.address}</div>
                  {loc.schedule && <div style={{ fontSize: 12, marginTop: 4 }}>Schedule: {loc.schedule}</div>}
                  {loc.acceptedWasteTypes?.length > 0 && (
                    <div style={{ marginTop: 8, fontSize: 12 }}>
                      Accepts: {loc.acceptedWasteTypes.join(', ')}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </section>
    </div>
  );
}
