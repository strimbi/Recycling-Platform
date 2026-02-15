import { useEffect, useState } from 'react';
import { api } from '../api';

export default function AdminPanel({ onAfterApproveNewLocation }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');
    const [adminComment, setAdminComment] = useState({}); // reportId -> comment
    const [busyId, setBusyId] = useState(null);

    const load = async () => {
        setErr('');
        setLoading(true);
        try {
            const res = await api.get('/api/admin/reports', { params: { status: 'PENDING' } });
            // Dacă backend-ul tău returnează listă simplă:
            setItems(res.data);
            // Dacă ai page response: setItems(res.data.items);
        } catch (e) {
            setErr(e?.response?.data?.message || 'Nu pot încărca raportările');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const approve = async (r) => {
        setBusyId(r.id);
        try {
            await api.post(`/api/admin/reports/${r.id}/approve`, {
                adminComment: adminComment[r.id] || '',
                points: null,
            });

            // Dacă e NEW_LOCATION, după approve se creează locația -> refresh map
            if (r.type === 'NEW_LOCATION') {
                onAfterApproveNewLocation?.();
            }
            await load();
        } catch (e) {
            alert(e?.response?.data?.message || 'Eroare la approve');
        } finally {
            setBusyId(null);
        }
    };

    const reject = async (r) => {
        setBusyId(r.id);
        try {
            await api.post(`/api/admin/reports/${r.id}/reject`, {
                adminComment: adminComment[r.id] || '',
            });
            await load();
        } catch (e) {
            alert(e?.response?.data?.message || 'Eroare la reject');
        } finally {
            setBusyId(null);
        }
    };

    return (
        <div style={{ marginTop: 18, borderTop: '1px solid #333', paddingTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 800 }}>Admin: Raportări PENDING</div>
                <button
                    onClick={load}
                    disabled={loading}
                    style={{ padding: '6px 10px', cursor: 'pointer' }}
                >
                    Refresh
                </button>
            </div>

            {err && <div style={{ marginTop: 10, color: '#ff6b6b', fontSize: 13 }}>{err}</div>}

            {loading ? (
                <div style={{ marginTop: 10, fontSize: 13 }}>Loading...</div>
            ) : items.length === 0 ? (
                <div style={{ marginTop: 10, fontSize: 13 }}>Nu există raportări PENDING.</div>
            ) : (
                <div style={{ marginTop: 10, display: 'grid', gap: 10 }}>
                    {items.map((r) => (
                        <div
                            key={r.id}
                            style={{
                                border: '1px solid #444',
                                borderRadius: 8,
                                padding: 10,
                                background: '#1c1c1c',
                                color: 'white',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                                <div style={{ fontWeight: 700 }}>
                                    #{r.id} • {r.type}
                                </div>
                                <div style={{ fontSize: 12, color: '#bbb' }}>
                                    {r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}
                                </div>
                            </div>

                            <div style={{ marginTop: 6, fontSize: 13, color: '#ddd' }}>
                                {r.description}
                            </div>

                            {r.type === 'NEW_LOCATION' && (
                                <div style={{ marginTop: 6, fontSize: 12, color: '#bbb' }}>
                                    Proposed: {r.proposedLat}, {r.proposedLng}
                                    {r.proposedAddress ? ` • ${r.proposedAddress}` : ''}
                                    {r.proposedWasteTypes?.length
                                        ? ` • ${r.proposedWasteTypes.join(', ')}`
                                        : ''}
                                </div>
                            )}

                            {r.locationId && (
                                <div style={{ marginTop: 6, fontSize: 12, color: '#bbb' }}>
                                    locationId: {r.locationId}
                                </div>
                            )}

                            <input
                                value={adminComment[r.id] || ''}
                                onChange={(e) =>
                                    setAdminComment((prev) => ({ ...prev, [r.id]: e.target.value }))
                                }
                                placeholder="Admin comment (optional)"
                                style={{ marginTop: 10, width: '100%', padding: 8 }}
                            />

                            <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                                <button
                                    onClick={() => approve(r)}
                                    disabled={busyId === r.id}
                                    style={{
                                        flex: 1,
                                        padding: 10,
                                        background: '#0a7',
                                        color: 'white',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontWeight: 700,
                                    }}
                                >
                                    {busyId === r.id ? '...' : 'Approve'}
                                </button>

                                <button
                                    onClick={() => reject(r)}
                                    disabled={busyId === r.id}
                                    style={{
                                        flex: 1,
                                        padding: 10,
                                        background: '#b00020',
                                        color: 'white',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontWeight: 700,
                                    }}
                                >
                                    {busyId === r.id ? '...' : 'Reject'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
