import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { Send, History, User, Users, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function NotificationManager() {
    const [target, setTarget] = useState('ALL');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [channel, setChannel] = useState('SMS');
    const [isSending, setIsSending] = useState(false);
    const [history, setHistory] = useState([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const loadHistory = async () => {
        setIsLoadingHistory(true);
        try {
            const res = await api.get('/system/notifications');
            setHistory(res.data.data || []);
        } catch (err) {
            console.error("Failed to load history", err);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    useEffect(() => {
        loadHistory();
    }, []);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message) return;

        setIsSending(true);
        setError('');
        setSuccess('');

        try {
            await api.post('/system/notifications/send', { target, title, content: message, channel });
            setSuccess(`Notification sent to ${target === 'ALL' ? 'all customers' : 'selected recipient(s)'}`);
            setMessage('');
            setTitle('');
            loadHistory();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send notification.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* COMPOSER */}
            <div>
                <form className="card" onSubmit={handleSend}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <Send style={{ color: 'var(--primary)' }} />
                        <h3 style={{ margin: 0 }}>Compose Notification</h3>
                    </div>

                    {error && <div style={{ background: '#fef2f2', color: '#991b1b', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
                    {success && <div style={{ background: '#f0fdf4', color: '#166534', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>{success}</div>}

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label className="label">Target Recipients</label>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                            {[
                                { id: 'ALL', label: 'All Customers', icon: Users },
                                { id: 'SUBSCRIBERS', label: 'Active Subscribers', icon: Users },
                                { id: 'individual', label: 'Individual (Paste ID)', icon: User }
                            ].map(btn => (
                                <button
                                    key={btn.id}
                                    type="button"
                                    onClick={() => setTarget(btn.id === 'individual' ? '' : btn.id)}
                                    className={`btn ${target === btn.id || (btn.id === 'individual' && target !== 'ALL' && target !== 'SUBSCRIBERS') ? 'btn-secondary' : ''}`}
                                    style={{
                                        flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                        fontSize: '0.85rem', padding: '0.75rem'
                                    }}
                                >
                                    <btn.icon size={16} /> {btn.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {(target !== 'ALL' && target !== 'SUBSCRIBERS') && (
                        <div className="form-group">
                            <label className="label">Recipient ID(s)</label>
                            <input
                                className="input-field"
                                placeholder="Paste customer UUID(s) comma separated"
                                value={target}
                                onChange={e => setTarget(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label className="label">Channel</label>
                        <select className="input-field" value={channel} onChange={e => setChannel(e.target.value)}>
                            <option value="SMS">SMS (OTP Route)</option>
                            <option value="WHATSAPP">WhatsApp (Mock)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="label">Title (Optional)</label>
                        <input
                            className="input-field"
                            placeholder="e.g. Menu Update"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="label">Message Content</label>
                        <textarea
                            className="input-field"
                            style={{ minHeight: '120px', resize: 'vertical' }}
                            placeholder="Enter your message here..."
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-block" disabled={isSending}>
                        {isSending ? <RefreshCw className="spinner" /> : <><Send size={18} /> Send Notification Now</>}
                    </button>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1rem' }}>
                        Note: Messages are sent asynchronously. Check log for delivery status.
                    </p>
                </form>
            </div>

            {/* HISTORY */}
            <div>
                <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <History style={{ color: 'var(--primary)' }} />
                            <h3 style={{ margin: 0 }}>Recent Logs</h3>
                        </div>
                        <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={loadHistory} disabled={isLoadingHistory}>
                            <RefreshCw size={14} className={isLoadingHistory ? 'spinner' : ''} /> Refresh
                        </button>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', maxHeight: '600px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {history.map(notif => (
                            <div key={notif.id} style={{
                                padding: '1rem',
                                background: '#f8f9fa',
                                borderRadius: '12px',
                                borderLeft: `4px solid ${notif.status === 'SENT' ? '#2e7d32' : '#c62828'}`
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{notif.type} • {notif.channel}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        {new Date(notif.sentAt).toLocaleString()}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                    {notif.content}
                                </div>
                                <div style={{ fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>To: {notif.phone}</span>
                                    <span style={{
                                        color: notif.status === 'SENT' ? '#2e7d32' : '#c62828',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.2rem'
                                    }}>
                                        {notif.status === 'SENT' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                                        {notif.status}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {history.length === 0 && !isLoadingHistory && (
                            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No recent notifications found.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
