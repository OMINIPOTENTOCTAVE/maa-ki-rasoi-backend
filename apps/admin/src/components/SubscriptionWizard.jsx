import { useState } from 'react';
import axios from 'axios';
import { X, Check } from 'lucide-react';

export default function SubscriptionWizard({ onClose, onSuccess }) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [form, setForm] = useState({
        planType: 'Monthly',
        mealType: 'Lunch', // Lunch, Dinner, Both
        dietaryPreference: 'Veg',
        startDate: new Date().toISOString().split('T')[0], // Today
        customerName: '',
        customerPhone: '',
        address: ''
    });

    const calculatePrice = () => {
        let durationDays = form.planType === 'Weekly' ? 5 : (form.planType === 'MonthlyFull' ? 30 : 22);
        let perMealPrice = form.planType === 'MonthlyFull' ? 100 : (form.planType === 'Monthly' ? 110 : 120);
        let mealsPerDay = form.mealType === 'Both' ? 2 : 1;
        let comboDiscount = form.mealType === 'Both' ? 0.85 : 1;
        return Math.round((durationDays * mealsPerDay * perMealPrice) * comboDiscount);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            await axios.post('/subscriptions', form);
            onSuccess();
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Failed to create subscription.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1000,
            animation: 'fadeIn 0.3s'
        }}>
            <div className="card" style={{
                width: '100%', maxWidth: '500px', margin: '0',
                borderRadius: '24px 24px 0 0', maxHeight: '90vh', overflowY: 'auto',
                animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Start Subscription</h2>
                    <button onClick={onClose} style={{ background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer' }}>
                        <X size={20} />
                    </button>
                </div>

                {/* Progress Indicators */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{
                            height: '6px', flex: 1, borderRadius: '3px',
                            background: step >= i ? 'var(--primary)' : 'rgba(0,0,0,0.1)',
                            transition: 'all 0.3s'
                        }} />
                    ))}
                </div>

                {errorMsg && (
                    <div style={{ background: '#dc3545', color: 'white', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center', fontWeight: 'bold' }}>
                        {errorMsg}
                    </div>
                )}

                {step === 1 && (
                    <div style={{ animation: 'fadeIn 0.3s' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Choose your Plan</h3>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {[
                                { id: 'Weekly', title: 'Weekly Plan (5 Days)', desc: 'Perfect for trying us out. Mon-Fri.' },
                                { id: 'Monthly', title: 'Monthly Workday (22 Days)', desc: 'The professional standard. Mon-Fri.' },
                                { id: 'MonthlyFull', title: 'Monthly Full (30 Days)', desc: 'Every day covered. Maximum savings.' }
                            ].map(p => (
                                <div
                                    key={p.id}
                                    onClick={() => setForm({ ...form, planType: p.id })}
                                    style={{
                                        padding: '1.25rem', borderRadius: '12px', cursor: 'pointer',
                                        border: `2px solid ${form.planType === p.id ? 'var(--primary)' : 'var(--border)'}`,
                                        background: form.planType === p.id ? 'rgba(255,87,34,0.05)' : 'transparent',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                        <strong style={{ fontSize: '1.1rem' }}>{p.title}</strong>
                                        {form.planType === p.id && <Check size={20} color="var(--primary)" />}
                                    </div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{p.desc}</div>
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-block" style={{ marginTop: '2rem' }} onClick={() => setStep(2)}>Next Step ➔</button>
                    </div>
                )}

                {step === 2 && (
                    <div style={{ animation: 'fadeIn 0.3s' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Meal Configuration</h3>

                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.75rem' }}>Meals Required</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            {['Lunch', 'Dinner', 'Both'].map(m => (
                                <button
                                    key={m}
                                    className={`category-pill ${form.mealType === m ? 'active' : ''}`}
                                    onClick={() => setForm({ ...form, mealType: m })}
                                    style={{ padding: '0.75rem 0', margin: 0, width: '100%', textAlign: 'center' }}
                                >
                                    {m === 'Both' ? 'Lunch + Dinner' : m}
                                </button>
                            ))}
                        </div>

                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.75rem' }}>Dietary Preference</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            {['Veg', 'Non-Veg'].map(d => (
                                <button
                                    key={d}
                                    className={`category-pill ${form.dietaryPreference === d ? 'active' : ''}`}
                                    onClick={() => setForm({ ...form, dietaryPreference: d })}
                                    style={{ padding: '0.75rem 0', margin: 0, width: '100%', textAlign: 'center', borderColor: form.dietaryPreference === d ? (d === 'Veg' ? '#4caf50' : '#f44336') : 'var(--border)', background: form.dietaryPreference === d ? (d === 'Veg' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)') : 'transparent', color: form.dietaryPreference === d ? (d === 'Veg' ? '#2e7d32' : '#c62828') : 'var(--text-main)' }}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>

                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.75rem' }}>Start Date</label>
                        <input
                            type="date"
                            className="input-field"
                            value={form.startDate}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={e => setForm({ ...form, startDate: e.target.value })}
                        />

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button className="btn" style={{ background: 'var(--border)', color: 'var(--text-main)' }} onClick={() => setStep(1)}>Back</button>
                            <button className="btn" style={{ flex: 1 }} onClick={() => setStep(3)}>Next Step ➔</button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div style={{ animation: 'fadeIn 0.3s' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Delivery Details</h3>

                        <div style={{ background: 'rgba(255,87,34,0.05)', border: '1px dashed rgba(255,87,34,0.3)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: 800 }}>{form.planType} • {form.mealType}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Starts: {new Date(form.startDate).toLocaleDateString()}</div>
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                                ₹{calculatePrice()}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <input className="input-field" placeholder="Full Name" required value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} />
                            <input className="input-field" placeholder="10-digit Phone Number" required type="tel" pattern="[0-9]{10}" value={form.customerPhone} onChange={e => setForm({ ...form, customerPhone: e.target.value })} />
                            <textarea className="input-field" placeholder="Delivery Address" required rows="2" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}></textarea>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" className="btn" style={{ background: 'var(--border)', color: 'var(--text-main)' }} onClick={() => setStep(2)}>Back</button>
                                <button type="submit" className="btn" style={{ flex: 1 }} disabled={loading}>
                                    {loading ? 'Processing...' : `Subscribe via COD`}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
