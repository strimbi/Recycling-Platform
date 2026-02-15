import { useEffect, useState } from 'react';
import { api, getApiErrorMessage } from '../../api';

const STATUSES = ['', 'PENDING', 'APPROVED', 'REJECTED'];

export default function AdminReportsPage() {
  const [status, setStatus] = useState('PENDING');
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = async (s = status) => {
    setError('');
    try {
      const res = await api.get('/api/admin/reports', { params: s ? { status: s } : {} });
      setRows(res.data);
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  };

  useEffect(() => { load(); }, [status]);

  const act = async (id, kind, { points, adminComment }) => {
    setBusyId(id);
    setError('');
    try {
      if (kind === 'approve') {
        await api.post(`/api/admin/reports/${id}/approve`, {
          points: points === '' || points == null ? null : Number(points),
          adminComment: adminComment || null,
        });
      } else {
        await api.post(`/api/admin/reports/${id}/reject`, { adminComment: adminComment || null });
      }
      await load();
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="card">
      <div className="row-between">
        <h2 style={{ margin: 0 }}>Admin • Reports</h2>

        <div className="row" style={{ gap: 8 }}>
          <span className="muted">Status</span>
          <select className="input" style={{ width: 160 }} value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUSES.map((s) => <option key={s || 'ALL'} value={s}>{s || 'ALL'}</option>)}
          </select>

          <button className="btn" onClick={() => load()}>Refresh</button>
        </div>
      </div>

      {error && <div className="alert">{error}</div>}

      <div className="muted" style={{ marginTop: 8 }}>
        Tip: approving a <b>NEW_LOCATION</b> report also creates a new recycling location in the backend.
      </div>

      <div className="table" style={{ marginTop: 12 }}>
        <div className="t-head" style={{ gridTemplateColumns: '80px 140px 120px 180px 1fr 320px' }}>
          <div>ID</div>
          <div>Type</div>
          <div>Status</div>
          <div>Created by</div>
          <div>Details</div>
          <div>Actions</div>
        </div>

        {rows.map((r) => (
          <AdminReportRow key={r.id} r={r} busy={busyId === r.id} onAct={act} />
        ))}

        {rows.length === 0 && (
          <div className="muted" style={{ marginTop: 12 }}>
            No reports for this filter.
          </div>
        )}
      </div>
    </div>
  );
}

function badgeClass(status) {
  if (status === 'APPROVED') return 'badge ok';
  if (status === 'REJECTED') return 'badge bad';
  return 'badge';
}

function AdminReportRow({ r, busy, onAct }) {
  const [points, setPoints] = useState('');
  const [comment, setComment] = useState('');

  return (
    <div className="t-row" style={{ alignItems: 'start', gridTemplateColumns: '80px 140px 120px 180px 1fr 320px' }}>
      <div>#{r.id}</div>
      <div>{r.type}</div>
      <div><span className={badgeClass(r.status)}>{r.status}</span></div>
      <div className="muted">{r.createdByEmail}</div>

      <div>
        <div>{r.description}</div>
        {r.locationName && <div className="muted" style={{ marginTop: 6 }}>Location: {r.locationName}</div>}

        {r.type === 'NEW_LOCATION' && (
          <div className="muted" style={{ marginTop: 6 }}>
            Proposed: {r.proposedAddress} ({r.proposedLat}, {r.proposedLng})<br />
            Waste: {Array.isArray(r.proposedWasteTypes) ? r.proposedWasteTypes.join(', ') : ''}
          </div>
        )}

        {r.adminComment && (
          <div className="muted" style={{ marginTop: 6 }}>
            Previous admin comment: {r.adminComment}
          </div>
        )}
      </div>

      <div>
        {r.status === 'PENDING' ? (
          <div className="stack">
            <input
              className="input"
              placeholder="Admin comment (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <input
              className="input"
              placeholder="Points override (optional)"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              inputMode="numeric"
            />

            <div className="row" style={{ gap: 8 }}>
              <button className="btn btn-primary" disabled={busy} onClick={() => onAct(r.id, 'approve', { points, adminComment: comment })}>
                {busy ? 'Working…' : 'Approve'}
              </button>
              <button className="btn" disabled={busy} onClick={() => onAct(r.id, 'reject', { adminComment: comment })}>
                Reject
              </button>
            </div>
          </div>
        ) : (
          <span className="muted">—</span>
        )}
      </div>
    </div>
  );
}
