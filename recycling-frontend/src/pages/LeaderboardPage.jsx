import { useEffect, useState } from 'react';
import { api} from '../api';

export default function LeaderboardPage() {
  const [limit, setLimit] = useState(10);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setError('');
      try {
        const res = await api.get('/api/leaderboard', { params: { limit } });
        setRows(res.data);
      } catch (e) {
        setError("You need to log in to see the leaderboard");
      }
    };

    load();
  }, [limit]);

  return (
    <div className="card">
      <div className="row-between">
        <h2 style={{ margin: 0 }}>Leaderboard</h2>

        <div className="row" style={{ gap: 8 }}>
          <span className="muted">Show</span>
          <select className="input" style={{ width: 90 }} value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
            {[5, 10, 20, 50].map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
      </div>

      {error && <div className="alert">{error}</div>}

      <div className="table">
        <div className="t-head" style={{ gridTemplateColumns: '70px 1fr 120px' }}>
          <div>#</div>
          <div>User</div>
          <div style={{ textAlign: 'right' }}>Points</div>
        </div>
        {rows.map((r, idx) => (
          <div className="t-row" style={{ gridTemplateColumns: '70px 1fr 120px' }} key={r.email ?? idx}>
            <div>{idx + 1}</div>
            <div>{r.displayName ?? r.email}</div>
            <div style={{ textAlign: 'right' }}><b>{r.points}</b></div>
          </div>
        ))}
      </div>
    </div>
  );
}
