import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, getApiErrorMessage } from '../api';
import { useAuth } from '../hooks/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const nav = useNavigate();
  const auth = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await api.post('/api/auth/login', { email, password });
      auth.setSession(res.data);
      nav('/');
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="center">
      <div className="card authcard">
        <h2>Login</h2>

        {error && <div className="alert">{error}</div>}

        <form onSubmit={submit} className="stack">
          <label className="label">Email</label>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />

          <label className="label">Password</label>
          <input className="input" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />

          <button className="btn btn-primary" disabled={busy}>
            {busy ? 'Logging in…' : 'Login'}
          </button>
        </form>

        <div className="muted" style={{ marginTop: 12 }}>
          No account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}
