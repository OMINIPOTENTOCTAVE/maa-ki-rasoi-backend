import { useState, useCallback } from 'react';
import axios from 'axios';
import { X, Check } from 'lucide-react';

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const existingScript = document.getElementById('razorpay-checkout-js');
        if (existingScript) return resolve(true);

        const script = document.createElement('script');
        script.id = 'razorpay-checkout-js';
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

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
        address: '',
        paymentMethod: 'ONLINE' // Default to online
    });

    const calculatePrice = () => {
        let durationDays = form.planType === 'Weekly' ? 5 : (form.planType === 'MonthlyFull' ? 30 : 22);
        let perMealPrice = form.planType === 'MonthlyFull' ? 100 : (form.planType === 'Monthly' ? 110 : 120);
        let mealsPerDay = form.mealType === 'Both' ? 2 : 1;
        let comboDiscount = form.mealType === 'Both' ? 0.85 : 1;
        return Math.round((durationDays * mealsPerDay * perMealPrice) * comboDiscount);
    };

    const getFinalPayableAmount = () => {
        // If COD, they only pay the 500 deposit upfront
        if (form.paymentMethod === 'COD') {
            return 500;
        }
        // If Online, they pay full plan price + 500 deposit
        return calculatePrice() + 500;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        setErrorMsg('');

        try {
            // Include payment method
            const subRes = await axios.post('/subscriptions', { ...form });
            const subscriptionId = subRes.data.subscription.id;

            // If it's pure COD (like no deposit or if deposit is skipped)
            // But we actually require 500 online deposit for COD. 
            // So we ALWAYS invoke Razorpay for the deposit!
            const amountToPay = getFinalPayableAmount();

            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                setErrorMsg("Failed to load Razorpay SDK.");
                setLoading(false);
                return;
            }

            const rzpOrderRes = await axios.post('/payments/create-order', {
                amount: amountToPay,
                orderType: 'Subscription',
                referenceId: subscriptionId
            });

            const { id: razorpayOrderId, isMock } = rzpOrderRes.data.order;

            if (isMock) {
                const verifyRes = await axios.post('/payments/verify', {
                    razorpay_order_id: razorpayOrderId,
                    razorpay_payment_id: "pay_mock_" + Date.now(),
                    razorpay_signature: "mock_signature",
                    orderType: 'Subscription',
                    referenceId: subscriptionId
                });

                if (verifyRes.data.success) {
                    onSuccess();
                }
                setLoading(false);
                return;
            }

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_dummykey',
                amount: amountToPay * 100,
                currency: "INR",
                name: "Maa Ki Rasoi",
                description: `Subscription ${form.paymentMethod === 'COD' ? 'Security Deposit' : 'Payment'}`,
                order_id: razorpayOrderId,
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post('/payments/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderType: 'Subscription',
                            referenceId: subscriptionId
                        });

                        if (verifyRes.data.success) {
                            onSuccess();
                        }
                    } catch (err) {
                        setErrorMsg("Payment verification failed.");
                    }
                },
                prefill: {
                    name: form.customerName,
                    contact: form.customerPhone,
                },
                theme: { color: "#C8550A" }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                setErrorMsg("Payment Failed: " + response.error.description);
            });
            rzp1.open();

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
                animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                padding: '24px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Start Subscription</h2>
                    <button onClick={onClose} style={{ background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer' }}>
                        <X size={20} />
                    </button>
                </div>

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
                                        background: form.planType === p.id ? 'rgba(200,85,10,0.05)' : 'transparent',
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

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: 'rgba(76, 175, 80, 0.08)', borderRadius: '12px', border: '1px solid rgba(76, 175, 80, 0.2)', marginBottom: '1.5rem' }}>
                            <span style={{ fontSize: '1.2rem' }}>🌿</span>
                            <span style={{ fontWeight: 700, color: '#2e7d32', fontSize: '0.95rem' }}>100% Pure Vegetarian Kitchen</span>
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

                        <form onSubmit={handleSubmit}>
                            <input className="input-field" placeholder="Full Name" required value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} />
                            <input className="input-field" placeholder="10-digit Phone Number" required type="tel" pattern="[0-9]{10}" value={form.customerPhone} onChange={e => setForm({ ...form, customerPhone: e.target.value })} />
                            <textarea className="input-field" placeholder="Delivery Address" required rows="2" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}></textarea>

                            <h4 style={{ margin: '1.5rem 0 1rem' }}>Payment Method</h4>
                            <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <label style={{ display: 'flex', gap: '0.75rem', padding: '1rem', border: `2px solid ${form.paymentMethod === 'ONLINE' ? 'var(--primary)' : 'var(--border)'}`, borderRadius: '12px', cursor: 'pointer' }}>
                                    <input type="radio" value="ONLINE" checked={form.paymentMethod === 'ONLINE'} onChange={() => setForm({ ...form, paymentMethod: 'ONLINE' })} />
                                    <div>
                                        <div style={{ fontWeight: 600 }}>Pay Online</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>UPI, Cards, Netbanking</div>
                                    </div>
                                </label>
                                <label style={{ display: 'flex', gap: '0.75rem', padding: '1rem', border: `2px solid ${form.paymentMethod === 'COD' ? 'var(--primary)' : 'var(--border)'}`, borderRadius: '12px', cursor: 'pointer' }}>
                                    <input type="radio" value="COD" checked={form.paymentMethod === 'COD'} onChange={() => setForm({ ...form, paymentMethod: 'COD' })} />
                                    <div>
                                        <div style={{ fontWeight: 600 }}>Cash on Delivery</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pay daily delivery by cash</div>
                                    </div>
                                </label>
                            </div>

                            <div style={{ background: 'rgba(200,85,10,0.05)', border: '1px dashed rgba(200,85,10,0.3)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 800 }}>{form.planType} • {form.mealType}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Plan Cost: ₹{calculatePrice()}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Security Deposit: ₹500</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Amount Payable Now</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                                        ₹{getFinalPayableAmount()}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" className="btn" style={{ background: 'var(--border)', color: 'var(--text-main)' }} onClick={() => setStep(2)}>Back</button>
                                <button type="submit" className="btn" style={{ flex: 1 }} disabled={loading}>
                                    {loading ? 'Processing...' : `Pay ₹${getFinalPayableAmount()} securely`}
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
