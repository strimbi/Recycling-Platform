import { useEffect, useState } from 'react';
import { api } from '../api';

export default function NewLocationForm({ lat, lng, onCancel, onSubmitted }) {
    const [wasteTypes, setWasteTypes] = useState([]);
    const [selected, setSelected] = useState(new Set());
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('Propun un punct nou de reciclare');
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            const res = await api.get('/api/waste-types');
            setWasteTypes(res.data);
        })();
    }, []);

    const toggle = (name) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(name)) next.delete(name);
            else next.add(name);
            return next;
        });
    };

    const submit = async (e) => {
        e.preventDefault();
        setMsg('');
        setLoading(true);
        try {
            await api.post('/api/reports', {
                type: 'NEW_LOCATION',
                description,
                proposedLat: lat,
                proposedLng: lng,
                proposedAddress: address,
                proposedWasteTypes: Array.from(selected),
            });
            setMsg('✅ Propunere trimisă! Va apărea pe hartă după aprobarea adminului.');
            onSubmitted?.();
        } catch (err) {
            setMsg(err?.response?.data?.message || 'Eroare la trimiterea propunerii');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Propune locație nouă</div>

            <div style={{ fontSize: 12, color: '#555', marginBottom: 10 }}>
                Coord: {lat.toFixed(5)}, {lng.toFixed(5)}
            </div>

            <form onSubmit={submit} style={{ display: 'grid', gap: 8 }}>
                <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Adresă (opțional)"
                    style={{ padding: 8 }}
                />

                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    style={{ padding: 8, resize: 'vertical' }}
                />

                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 6 }}>Ce se poate recicla?</div>
                <div style={{ display: 'grid', gap: 6, maxHeight: 140, overflow: 'auto', padding: 8, border: '1px solid #ddd' }}>
                    {wasteTypes.map((wt) => (
                        <label key={wt.id} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
                            <input
                                type="checkbox"
                                checked={selected.has(wt.name)}
                                onChange={() => toggle(wt.name)}
                            />
                            {wt.name}
                        </label>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                    <button
                        type="button"
                        onClick={onCancel}
                        style={{ flex: 1, padding: 10, background: '#444', color: 'white', border: 'none', cursor: 'pointer' }}
                    >
                        Anulează
                    </button>

                    <button
                        disabled={loading}
                        type="submit"
                        style={{ flex: 1, padding: 10, background: '#1f6feb', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                    >
                        {loading ? '...' : 'Trimite'}
                    </button>
                </div>

                {msg && <div style={{ fontSize: 12 }}>{msg}</div>}
            </form>
        </div>
    );
}
