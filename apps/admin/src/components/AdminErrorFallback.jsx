import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

const AdminErrorFallback = ({ error, resetError }) => {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--brand-cream)',
            padding: '2rem',
            textAlign: 'center'
        }}>
            <div className="card" style={{ maxWidth: '500px', padding: '3rem' }}>
                <div style={{ color: '#E67E22', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                    <AlertTriangle size={64} />
                </div>
                <h1 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Something went wrong</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    The Admin Portal encountered an unexpected error. This has been reported to the technical team.
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <RefreshCw size={18} /> Reload Page
                    </button>
                    <button
                        onClick={() => window.location.href = '/admin/login'}
                        className="btn btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Home size={18} /> Back to Login
                    </button>
                </div>

                {process.env.NODE_ENV !== 'production' && (
                    <div style={{ marginTop: '2rem', textAlign: 'left', background: '#f8f9fa', padding: '1rem', borderRadius: '8px', fontSize: '0.8rem', overflowX: 'auto' }}>
                        <code style={{ color: '#c62828' }}>{error.toString()}</code>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminErrorFallback;
