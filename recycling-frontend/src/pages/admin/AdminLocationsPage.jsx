import { useEffect, useMemo, useState } from 'react';
import { api, getApiErrorMessage } from '../../api';

export default function AdminLocationsPage() {
  const [rows, setRows] = useState([]);
  const [wasteTypes, setWasteTypes] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const empty = useMemo(() => ({
    id: null,
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    schedule: '',
    acceptedWasteTypes: [],
  }), []);

  const [form, setForm] = useState(empty);

  const load = async () => {
    setError('');
    try {
      const [locRes, wtRes] = await Promise.all([
        api.get('/api/locations'),
        api.get('/api/waste-types'),
      ]);
      setRows(locRes.data);
      setWasteTypes(wtRes.data);
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  };

  useEffect(() => { load(); }, []);

  const toggleWaste = (name) => {
    setForm((f) => ({
      ...f,
      acceptedWasteTypes: f.acceptedWasteTypes.includes(name)
        ? f.acceptedWasteTypes.filter((x) => x !== name)
        : [...f.acceptedWasteTypes, name],
    }));
  };

  const startCreate = () => setForm({ ...empty });

  const startEdit = (loc) => setForm({
    id: loc.id,
    name: loc.name ?? '',
    address: loc.address ?? '',
    latitude: String(loc.latitude ?? ''),
    longitude: String(loc.longitude ?? ''),
    schedule: loc.schedule ?? '',
    acceptedWasteTypes: Array.isArray(loc.acceptedWasteTypes) ? loc.acceptedWasteTypes : [],
  });

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const payload = {
        name: form.name,
        address: form.address,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        schedule: form.schedule,
        acceptedWasteTypes: form.acceptedWasteTypes,
      };
      if (!payload.name.trim()) throw new Error('Name is required');
      if (!payload.address.trim()) throw new Error('Address is required');
      if (Number.isNaN(payload.latitude) || Number.isNaN(payload.longitude)) throw new Error('Latitude/Longitude must be numbers');
      if (!payload.acceptedWasteTypes.length) throw new Error('Pick at least one waste type');

      if (form.id) await api.put(`/api/admin/locations/${form.id}`, payload);
      else await api.post('/api/admin/locations', payload);

      await load();
      startCreate();
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const del = async (id) => {
    if (!confirm('Delete this location?')) return;
    setBusy(true);
    setError('');
    try {
      await api.delete(`/api/admin/locations/${id}`);
      await load();
      if (form.id === id) startCreate();
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
    return copy;
  }, [rows]);

  return (
    <div className="page-grid">
      <section className="card sidebar">
        <div className="row-between">
          <h2 style={{ marginTop: 0 }}>Admin • Locations</h2>
          <button className="btn" onClick={load} disabled={busy}>Refresh</button>
        </div>

        {error && <div className="alert">{error}</div>}

        <button className="btn btn-primary" onClick={startCreate} disabled={busy}>+ New location</button>

        <div className="list" style={{ marginTop: 12 }}>
          {sorted.map((l) => (
            <div key={l.id} className={'list-item' + (form.id === l.id ? ' active' : '')}>
              <div className="row-between" style={{ gap: 8 }}>
                <div style={{ cursor: 'pointer' }} onClick={() => startEdit(l)}>
                  <div style={{ fontWeight: 700 }}>{l.name}</div>
                  <div className="muted">{l.address}</div>
                </div>
                <button className="btn danger" onClick={() => del(l.id)} disabled={busy}>Delete</button>
              </div>
            </div>
          ))}
          {sorted.length === 0 && <div className="muted">No locations yet.</div>}
        </div>
      </section>

      <section className="card">
        <h3 style={{ marginTop: 0 }}>{form.id ? `Edit location #${form.id}` : 'Create location'}</h3>

        <form onSubmit={save} className="stack">
          <label className="label">Name</label>
          <input className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />

          <label className="label">Address</label>
          <input className="input" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />

          <div className="row" style={{ gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label className="label">Latitude</label>
              <input className="input" value={form.latitude} onChange={(e) => setForm((f) => ({ ...f, latitude: e.target.value }))} />
            </div>
            <div style={{ flex: 1 }}>
              <label className="label">Longitude</label>
              <input className="input" value={form.longitude} onChange={(e) => setForm((f) => ({ ...f, longitude: e.target.value }))} />
            </div>
          </div>

          <label className="label">Schedule (optional)</label>
          <input className="input" value={form.schedule} onChange={(e) => setForm((f) => ({ ...f, schedule: e.target.value }))} placeholder="Mon-Fri 9-17" />

          <label className="label">Accepted waste types</label>
          <div className="pillbox">
            {wasteTypes.map((wt) => (
              <button
                key={wt.id}
                type="button"
                className={'pill' + (form.acceptedWasteTypes.includes(wt.name) ? ' on' : '')}
                onClick={() => toggleWaste(wt.name)}
              >
                {wt.name}
              </button>
            ))}
          </div>

          <div className="row" style={{ gap: 8 }}>
            <button className="btn btn-primary" disabled={busy}>
              {busy ? 'Saving…' : (form.id ? 'Save changes' : 'Create')}
            </button>
            {form.id && <button type="button" className="btn" onClick={startCreate} disabled={busy}>Cancel</button>}
          </div>
        </form>
      </section>
    </div>
  );
}
