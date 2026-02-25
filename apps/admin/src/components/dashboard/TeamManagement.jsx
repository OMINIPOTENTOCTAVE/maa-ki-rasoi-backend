import React from 'react';

export default function TeamManagement({ partners, partnerForm, setPartnerForm, handleAddPartner }) {
    return (
        <>
            <form className="card" onSubmit={handleAddPartner} style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Onboard New Driver</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <input className="input-field" placeholder="Driver Name" required value={partnerForm.name} onChange={e => setPartnerForm({ ...partnerForm, name: e.target.value })} style={{ marginBottom: 0 }} />
                    <input className="input-field" placeholder="Phone Number" required value={partnerForm.phone} onChange={e => setPartnerForm({ ...partnerForm, phone: e.target.value })} style={{ marginBottom: 0 }} />
                    <input className="input-field" placeholder="Vehicle Details (Optional)" value={partnerForm.vehicleDetails} onChange={e => setPartnerForm({ ...partnerForm, vehicleDetails: e.target.value })} style={{ marginBottom: 0, gridColumn: 'span 2' }} />
                </div>
                <button className="btn btn-block" style={{ marginTop: '1.5rem', background: '#222' }}>+ Create Driver Profile</button>
            </form>

            <h3 style={{ marginBottom: '1rem', paddingLeft: '0.5rem' }}>Active Drivers ({partners.length})</h3>
            <div style={{ overflowX: 'auto', background: 'white', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <table className="admin-table">
                    <thead>
                        <tr style={{ background: 'rgba(0,0,0,0.02)' }}>
                            <th>Driver Info</th>
                            <th>Phone</th>
                            <th>Vehicle</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {partners.map(p => (
                            <tr key={p.id}>
                                <td style={{ fontWeight: '700' }}>{p.name}</td>
                                <td>{p.phone}</td>
                                <td>{p.vehicleDetails || 'N/A'}</td>
                                <td>
                                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: p.status === 'Active' ? 'var(--success)' : 'var(--text-muted)' }}>
                                        {p.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {partners.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No drivers boarded yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
