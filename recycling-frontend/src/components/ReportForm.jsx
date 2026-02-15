import { useState } from 'react';
import { api } from '../api';

const TYPES = [
    { value: 'FULL_BIN', label: 'Container plin' },
    { value: 'DAMAGED_BIN', label: 'Container deteriorat' },
    { value: 'WRONG_INFO', label: 'Informații greșite' },
];

export default function ReportForm({ locationId, onDone }) {
    const [type, setType] = useState('FULL_BIN');
    const [description, setDescription] = useState('');
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setMsg('');
        setLoading(true);
        try {
            await api.post('/api/reports', {
                type,
                description,
                locationId,
            });
            setMsg('✅ Raport trimis!');
            setDescription('');
            onDone?.();
        } catch (err) {
            setMsg(err?.response?.data?.message || 'Eroare la trimiterea raportului');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={submit} style={{ marginTop: 10, display: 'grid', gap: 8 }}>
            <select value={type} onChange={(e) => setType(e.target.value)} style={{ padding: 6 }}>
                {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>

            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descriere (obligatoriu)"
                rows={3}
                style={{ padding: 6, resize: 'vertical' }}
            />

            <button
                disabled={loading || !description.trim()}
                type="submit"
                style={{ padding: 8, background: '#1f6feb', color: 'white', border: 'none', cursor: 'pointer' }}
            >
                {loading ? '...' : 'Trimite raport'}
            </button>

            {msg && <div style={{ fontSize: 12 }}>{msg}</div>}
        </form>
    );
}
