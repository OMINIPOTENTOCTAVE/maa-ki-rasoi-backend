import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/auth/login', { username, password });
            localStorage.setItem('adminToken', res.data.token);
            window.location.href = '/admin/dashboard';
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '1rem' }}>
            <div className="card">
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>Admin Login</h2>
                {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}
                <form onSubmit={handleLogin}>
                    <input
                        className="input-field"
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                    <input
                        className="input-field"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn btn-block">Login</button>
                </form>
            </div>
        </div>
    );
}
