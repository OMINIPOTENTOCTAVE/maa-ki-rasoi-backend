import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function SupportView({ onBack }) {
    const isLoggedIn = !!localStorage.getItem('customer_token');
    const [complaints, setComplaints] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ category: 'Delivery', description: '' });

    useEffect(() => {
        if (isLoggedIn) fetchComplaints();
    }, [isLoggedIn]);

    const fetchComplaints = async () => {
        try {
            const res = await axios.get('/complaints');
            setComplaints(res.data.data);
        } catch (err) {
            
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/complaints', formData);
            setShowForm(false);
            setFormData({ category: 'Delivery', description: '' });
            fetchComplaints();
        } catch (err) {
            alert('Failed to submit complaint');
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = (category) => {
        setFormData({ ...formData, category });
        setShowForm(true);
    };

    const openTickets = complaints.filter(c => c.status !== 'Resolved');

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-transparent text-brand-orange">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div>
                    <h1 className="text-3xl font-bold mb-1">Help & Support</h1>
                    <p className="text-text-muted">We're here to ensure your meal experience is perfect.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

                {/* Main Content Side */}
                <div className="md:col-span-2 space-y-8">

                    {!showForm ? (
                        <>
                            <section>
                                <h3 className="text-lg font-bold mb-6">What do you need help with?</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { icon: 'moped', label: 'Delivery', desc: 'Late, missing, or cold food' },
                                        { icon: 'restaurant_menu', label: 'Quality', desc: 'Taste, hygiene, or quantity' },
                                        { icon: 'payments', label: 'Billing', desc: 'Subscription payment/refunds' },
                                        { icon: 'settings', label: 'Account', desc: 'Login or profile issues' },
                                    ].map((cat) => (
                                        <button
                                            key={cat.label}
                                            onClick={() => handleCategoryClick(cat.label)}
                                            className="card !p-6 flex items-center gap-4 text-left hover:border-brand-orange/40 hover:scale-[1.02] transition-all group"
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-transparent flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors">
                                                <span className="material-symbols-outlined">{cat.icon}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-text-main">{cat.label}</h4>
                                                <p className="text-xs text-text-muted">{cat.desc}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* WhatsApp Banner */}
                            <section className="card !bg-[#25D366]/5 border-[#25D366]/20 !p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div className="text-center sm:text-left">
                                    <h3 className="text-xl font-bold text-[#128C7E] mb-1">Need Urgent Help?</h3>
                                    <p className="text-xs text-text-muted">Direct line to our kitchen manager.</p>
                                </div>
                                <button
                                    onClick={() => window.open('https://wa.me/917428020104?text=Hi, I need help with my Maa Ki Rasoi order', '_blank')}
                                    className="btn !bg-[#25D366] !text-white px-8 flex items-center gap-2 hover:!bg-[#128C7E]"
                                >
                                    <span className="material-symbols-outlined">chat</span>
                                    WhatsApp Us
                                </button>
                            </section>
                        </>
                    ) : (
                        <div className="card !p-8 border-brand-orange/30 animate-fade-in">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                                        <span className="material-symbols-outlined">report</span>
                                    </div>
                                    <h2 className="text-2xl font-bold">Report {formData.category} Issue</h2>
                                </div>
                                <button onClick={() => setShowForm(false)} className="text-text-muted hover:text-text-main">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-text-main mb-2 ml-1">Issue Details</label>
                                    <textarea
                                        autoFocus
                                        required
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="input-field"
                                        placeholder="Please provide details so we can help you faster..."
                                        rows={6}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-block py-4 text-lg"
                                >
                                    {loading ? 'Submitting...' : 'Submit Ticket'}
                                </button>
                                <p className="text-[10px] text-center text-text-muted italic">
                                    Our support team usually responds within 15 minutes.
                                </p>
                            </form>
                        </div>
                    )}
                </div>

                {/* Sidebar: Tickets History */}
                <div className="space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted ml-2">Ticket Status</h3>

                    {!isLoggedIn ? (
                        <div className="card text-center !p-8">
                            <p className="text-sm text-text-muted italic">Login to view and track your support tickets.</p>
                        </div>
                    ) : openTickets.length === 0 ? (
                        <div className="card !bg-success/5 border-success/20 !p-6 text-center">
                            <span className="material-symbols-outlined text-success text-3xl mb-2">verified</span>
                            <h4 className="font-bold text-success">All Clear!</h4>
                            <p className="text-[10px] text-text-muted">No active issues found.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {openTickets.map(ticket => (
                                <div key={ticket.id} className="card !p-5 border-l-4 border-l-brand-orange">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-bold text-brand-orange uppercase">{ticket.category}</span>
                                        <span className="text-[10px] text-text-muted">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-xs font-medium text-text-body line-clamp-2 mb-3">{ticket.description}</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                                        <span className="text-[10px] font-bold text-warning uppercase">Under Review</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="card !bg-transparent border-none shadow-none text-center">
                        <p className="text-[10px] text-text-muted leading-relaxed">
                            Support Operating Hours: <br />
                            <b>10:00 AM - 10:00 PM IST</b>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}




