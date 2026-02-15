import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { api } from './api';
import AuthPanel from './components/AuthPanel';
import { clearAuth, getUser } from './auth/auth';
import ReportForm from './components/ReportForm';
import Modal from './components/Modal';
import NewLocationForm from './components/NewLocationForm';
import AdminPanel from './components/AdminPanel';
import Leaderboard from "./components/Leaderboard.jsx";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { RequireAdmin, RequireAuth } from './components/Guards';

import MapPage from './pages/MapPage';
import LeaderboardPage from './pages/LeaderboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ReportPage from './pages/ReportPage';
import MyReportsPage from './pages/MyReportsPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminLocationsPage from './pages/admin/AdminLocationsPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<MapPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
    const [wasteTypes, setWasteTypes] = useState([]);
    const [selectedWasteType, setSelectedWasteType] = useState('');
    const [locations, setLocations] = useState([]);
    const [user, setUser] = useState(() => getUser());
    const [proposeMode, setProposeMode] = useState(false);
    const [proposedPoint, setProposedPoint] = useState(null); // {lat, lng}
    const [lbKey, setLbKey] = useState(0);

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
            <div style={{width: 320, padding: 16, borderRight: '1px solid #ddd'}}>
                <h2 style={{marginTop: 0}}>Recycling Map</h2>

                <label style={{display: 'block', marginBottom: 8}}>Filtru categorie</label>
                <select
                    style={{width: '100%', padding: 8}}
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

          <Route element={<RequireAuth />}>
            <Route path="/reports" element={<ReportPage />} />
            <Route path="/my-reports" element={<MyReportsPage />} />
          </Route>
                <div style={{marginTop: 16, fontSize: 14, color: '#555'}}>
                    Locații afișate: <b>{locations.length}</b>
                </div>

          <Route element={<RequireAdmin />}>
            <Route path="/admin/reports" element={<AdminReportsPage />} />
            <Route path="/admin/locations" element={<AdminLocationsPage />} />
          </Route>
                <div style={{marginTop: 16, fontSize: 12, color: '#777'}}>
                    Hartă publică (fără login). Raportările le adăugăm după ce facem login UI.
                </div>

                <button
                    onClick={() => {
                        if (!user) return alert('Trebuie să fii logat ca să propui o locație.');
                        setProposeMode((v) => !v);
                        setProposedPoint(null);
                    }}
                    style={{
                        marginTop: 16,
                        width: '100%',
                        padding: 10,
                        background: proposeMode ? '#0a7' : '#1f6feb',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 700,
                    }}
                >
                    {proposeMode ? 'Mod propunere: ON (click pe hartă)' : 'Propune locație nouă'}
                </button>

                <div style={{marginTop: 16}}>
                    {user ? (
                        <div style={{fontSize: 13}}>
                            <div>Logged in as: <b>{user.displayName}</b></div>
                            <div>Role: <b>{user.role}</b></div>

                            <button
                                onClick={() => {
                                    clearAuth();
                                    setUser(null);
                                }}
                                style={{
                                    marginTop: 10,
                                    padding: 8,
                                    width: '100%',
                                    background: '#444',
                                    border: '1px solid #666',
                                    color: 'white',
                                    cursor: 'pointer',
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <AuthPanel onAuth={() => setUser(getUser())}/>
                    )}
                </div>

                <Leaderboard refreshKey={lbKey} />

                {user?.role === 'ADMIN' && (
                    <AdminPanel
                        onAfterApproveNewLocation={() => {
                            // refresh locations ca să vezi noul punct după approve
                            fetchLocations(null, selectedWasteType);
                            setLbKey(k => k + 1);
                        }}
                    />
                )}


            </div>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
            {/* Map */}
            <div style={{flex: 1}}>
                <MapContainer center={center} zoom={13} style={{height: '100%', width: '100%'}}>
                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
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
                                {user ? (
                                    <ReportForm locationId={loc.id} onSuccess={() => setLbKey(k => k + 1)} />
                                ) : (
                                    <div style={{ marginTop: 10, fontSize: 12 }}>
                                        Trebuie să fii logat ca să trimiți o raportare.
                                    </div>
                                )}
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
                    {proposedPoint && (
                        <Marker position={[proposedPoint.lat, proposedPoint.lng]}>
                            <Popup>Locație propusă</Popup>
                        </Marker>
                    )}

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
                                // opțional: reîncarcă locațiile (nu va apărea până nu aprobă adminul)
                                fetchLocations(null, selectedWasteType);
                            }}
                        />
                    </Modal>
                </MapContainer>
            </div>
        </div>
    );
}
