import { useEffect, useState } from 'react';
import { api, getApiErrorMessage } from '../api';

function badgeClass(status) {
  if (status === 'APPROVED') return 'badge ok';
  if (status === 'REJECTED') return 'badge bad';
  return 'badge';
}

export default function MyReportsPage() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');

  const load = async () => {
    setError('');
    try {
      const res = await api.get('/api/reports/mine');
      setRows(res.data);
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="card">
      <div className="row-between">
        <h2 style={{ margin: 0 }}>My reports</h2>
        <button className="btn" onClick={load}>Refresh</button>
      </div>

      {error && <div className="alert">{error}</div>}

      <div className="table">
        <div className="t-head">
          <div>ID</div>
          <div>Type</div>
          <div>Status</div>
          <div>Location</div>
          <div>Description</div>
        </div>

        {rows.map((r) => (
          <div className="t-row" key={r.id} style={{ alignItems: 'start' }}>
            <div>#{r.id}</div>
            <div>{r.type}</div>
            <div><span className={badgeClass(r.status)}>{r.status}</span></div>
            <div className="muted">{r.locationName ?? (r.type === 'NEW_LOCATION' ? 'New location' : '—')}</div>
            <div>
              <div>{r.description}</div>
              {r.adminComment && <div className="muted" style={{ marginTop: 6 }}>Admin: {r.adminComment}</div>}
              {r.type === 'NEW_LOCATION' && (
                <div className="muted" style={{ marginTop: 6 }}>
                  Proposed: {r.proposedAddress} ({r.proposedLat}, {r.proposedLng})<br />
                  Waste: {Array.isArray(r.proposedWasteTypes) ? r.proposedWasteTypes.join(', ') : ''}
                </div>
              )}
            </div>
          </div>
        ))}

        {rows.length === 0 && (
          <div className="muted" style={{ marginTop: 12 }}>
            No reports yet.
          </div>
        )}
      </div>
    </div>
  );
}
