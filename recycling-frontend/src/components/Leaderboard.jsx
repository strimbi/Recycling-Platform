import { useEffect, useState } from 'react';
import { api } from '../api';

export default function Leaderboard({ refreshKey = 0 }) {
    const [items, setItems] = useState([]);
    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(false);

    const load = async () => {
        setErr('');
        setLoading(true);
        try {
            const res = await api.get('/api/leaderboard');
            setItems(res.data);
        } catch (e) {
            setErr(e?.response?.data?.message || 'Nu pot încărca leaderboard');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshKey]);

    return (
        <div style={{ marginTop: 18, borderTop: '1px solid #ddd', paddingTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 800 }}>Leaderboard</div>
                <button onClick={load} disabled={loading} style={{ padding: '6px 10px', cursor: 'pointer' }}>
                    Refresh
                </button>
            </div>

            {err && <div style={{ marginTop: 8, color: '#b00020', fontSize: 13 }}>{err}</div>}

            {loading ? (
                <div style={{ marginTop: 10, fontSize: 13 }}>Loading...</div>
            ) : items.length === 0 ? (
                <div style={{ marginTop: 10, fontSize: 13 }}>Nu există date încă.</div>
            ) : (
                <div style={{ marginTop: 10, display: 'grid', gap: 6 }}>
                    {items.slice(0, 10).map((u, idx) => (
                        <div
                            key={u.userId ?? u.id ?? `${u.email}-${idx}`}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                border: '1px solid #eee',
                                borderRadius: 8,
                                padding: '8px 10px',
                                background: 'white',
                            }}
                        >
                            <div style={{ display: 'flex', gap: 8 }}>
                                <div style={{ width: 22, fontWeight: 800 }}>#{idx + 1}</div>
                                <div>
                                    <div style={{ fontWeight: 700 }}>
                                        {u.displayName ?? u.name ?? u.email ?? 'User'}
                                    </div>
                                    <div style={{ fontSize: 12, color: '#666' }}>
                                        {u.email ? u.email : ''}
                                    </div>
                                </div>
                            </div>

                            <div style={{ fontWeight: 800 }}>
                                {u.points}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
