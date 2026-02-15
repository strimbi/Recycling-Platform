import { useState } from 'react';
import { api } from '../api';
import { saveAuth } from '../auth/auth';

export default function AuthPanel({ onAuth }) {
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [email, setEmail] = useState('user@test.com');
    const [password, setPassword] = useState('password123');
    const [displayName, setDisplayName] = useState('User1');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (mode === 'login') {
                const res = await api.post('/api/auth/login', { email, password });
                saveAuth(res.data);
                onAuth?.(res.data);
            } else {
                const res = await api.post('/api/auth/register', { email, password, displayName });
                saveAuth(res.data);
                onAuth?.(res.data);
            }
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                'Auth failed';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <button
                    onClick={() => setMode('login')}
                    style={{
                        flex: 1,
                        padding: 8,
                        border: '1px solid #555',
                        background: mode === 'login' ? '#333' : 'transparent',
                        color: 'white',
                        cursor: 'pointer',
                    }}
                >
                    Login
                </button>
                <button
                    onClick={() => setMode('register')}
                    style={{
                        flex: 1,
                        padding: 8,
                        border: '1px solid #555',
                        background: mode === 'register' ? '#333' : 'transparent',
                        color: 'white',
                        cursor: 'pointer',
                    }}
                >
                    Register
                </button>
            </div>

            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email"
                    style={{ padding: 8 }}
                />

                {mode === 'register' && (
                    <input
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="display name"
                        style={{ padding: 8 }}
                    />
                )}

                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password"
                    type="password"
                    style={{ padding: 8 }}
                />

                <button
                    disabled={loading}
                    type="submit"
                    style={{
                        padding: 10,
                        background: '#1f6feb',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: 700,
                    }}
                >
                    {loading ? '...' : mode === 'login' ? 'Login' : 'Create account'}
                </button>

                {error && (
                    <div style={{ color: '#ff6b6b', fontSize: 13 }}>
                        {error}
                    </div>
                )}
            </form>
        </div>
    );
}
