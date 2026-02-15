import { useEffect, useMemo, useState } from 'react';
import { api, getApiErrorMessage } from '../api';

const REPORT_TYPES = [
  { value: 'FULL_BIN', label: 'Full container' },
  { value: 'DAMAGED_BIN', label: 'Broken / damaged container' },
  { value: 'WRONG_INFO', label: 'Wrong information (address/schedule/types)' },
  { value: 'NEW_LOCATION', label: 'Propose a new location' },
];

export default function ReportPage() {
  const [type, setType] = useState('FULL_BIN');
  const [description, setDescription] = useState('');
  const [locationId, setLocationId] = useState('');
  const [locations, setLocations] = useState([]);
  const [wasteTypes, setWasteTypes] = useState([]);

  const [proposedLat, setProposedLat] = useState('');
  const [proposedLng, setProposedLng] = useState('');
  const [proposedAddress, setProposedAddress] = useState('');
  const [proposedWasteTypes, setProposedWasteTypes] = useState([]);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  const isNew = type === 'NEW_LOCATION';

  const load = async () => {
    const [locRes, wtRes] = await Promise.all([
      api.get('/api/locations'),
      api.get('/api/waste-types'),
    ]);
    setLocations(locRes.data);
    setWasteTypes(wtRes.data);
  };

  useEffect(() => { load().catch(() => {}); }, []);

  const toggleWasteType = (name) => {
    setProposedWasteTypes((prev) => prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]);
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setOk('');

    try {
      const payload = {
        type,
        description,
        locationId: !isNew && locationId ? Number(locationId) : null,
        proposedLat: isNew && proposedLat !== '' ? Number(proposedLat) : null,
        proposedLng: isNew && proposedLng !== '' ? Number(proposedLng) : null,
        proposedAddress: isNew ? proposedAddress : null,
        proposedWasteTypes: isNew ? proposedWasteTypes : null,
      };

      // quick client-side guard to avoid 400s
      if (!payload.description.trim()) throw new Error('Please add a description.');
      if (!isNew && !payload.locationId) throw new Error('Please pick a location.');
      if (isNew) {
        if (payload.proposedLat == null || payload.proposedLng == null) throw new Error('Please provide coordinates.');
        if (!payload.proposedAddress?.trim()) throw new Error('Please provide an address / landmark.');
        if (!payload.proposedWasteTypes?.length) throw new Error('Select at least one accepted waste type.');
      }

      await api.post('/api/reports', payload);
      setOk('Report submitted! ✅');
      setDescription('');
      setLocationId('');
      setProposedLat('');
      setProposedLng('');
      setProposedAddress('');
      setProposedWasteTypes([]);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const sortedLocations = useMemo(() => {
    const copy = [...locations];
    copy.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
    return copy;
  }, [locations]);

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Submit a report</h2>

      {error && <div className="alert">{error}</div>}
      {ok && <div className="success">{ok}</div>}

      <form onSubmit={submit} className="stack">
        <label className="label">Report type</label>
        <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
          {REPORT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>

        {!isNew && (
          <>
            <label className="label">Location</label>
            <select className="input" value={locationId} onChange={(e) => setLocationId(e.target.value)}>
              <option value="">Select…</option>
              {sortedLocations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} — {l.address}
                </option>
              ))}
            </select>
          </>
        )}

        {isNew && (
          <>
            <div className="row" style={{ gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label className="label">Latitude</label>
                <input className="input" value={proposedLat} onChange={(e) => setProposedLat(e.target.value)} placeholder="46.7712" />
              </div>
              <div style={{ flex: 1 }}>
                <label className="label">Longitude</label>
                <input className="input" value={proposedLng} onChange={(e) => setProposedLng(e.target.value)} placeholder="23.6236" />
              </div>
            </div>

            <label className="label">Address / landmark</label>
            <input className="input" value={proposedAddress} onChange={(e) => setProposedAddress(e.target.value)} placeholder="Near the park entrance…" />

            <label className="label">Proposed accepted waste types</label>
            <div className="pillbox">
              {wasteTypes.map((wt) => (
                <button
                  type="button"
                  key={wt.id}
                  className={'pill' + (proposedWasteTypes.includes(wt.name) ? ' on' : '')}
                  onClick={() => toggleWasteType(wt.name)}
                >
                  {wt.name}
                </button>
              ))}
            </div>
          </>
        )}

        <label className="label">Description</label>
        <textarea className="input" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What’s wrong / what should change?" />

        <button className="btn btn-primary" disabled={busy}>
          {busy ? 'Submitting…' : 'Submit report'}
        </button>

        <div className="muted">
          Points are awarded when your report is approved by an admin (and the backend can award default points per type).
        </div>
      </form>
    </div>
  );
}
