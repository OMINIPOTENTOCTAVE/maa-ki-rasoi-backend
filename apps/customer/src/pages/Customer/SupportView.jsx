import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, MessageCircle, Truck, UtensilsCrossed, CreditCard, Settings, AlertTriangle, X, CheckCircle2 } from 'lucide-react';

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
            console.error(err);
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

    const getCategoryIcon = (label) => {
        switch (label) {
            case 'Delivery': return <Truck className="w-6 h-6" />;
            case 'Quality': return <UtensilsCrossed className="w-6 h-6" />;
            case 'Billing': return <CreditCard className="w-6 h-6" />;
            case 'Account': return <Settings className="w-6 h-6" />;
            default: return <AlertTriangle className="w-6 h-6" />;
        }
    }

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="bg-white rounded-[2rem] p-8 border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 mt-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-background transition-colors text-foreground"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-foreground">Help & Support</h1>
                        <p className="text-muted-foreground">We're here to ensure your meal experience is perfect.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

                {/* Main Content Side */}
                <div className="md:col-span-2 space-y-8">

                    {!showForm ? (
                        <>
                            <section>
                                <h3 className="text-xl font-heading font-bold mb-6 text-foreground ml-2">What do you need help with?</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { label: 'Delivery', desc: 'Late, missing, or cold food' },
                                        { label: 'Quality', desc: 'Taste, hygiene, or quantity' },
                                        { label: 'Billing', desc: 'Subscription payment/refunds' },
                                        { label: 'Account', desc: 'Login or profile issues' },
                                    ].map((cat) => (
                                        <button
                                            key={cat.label}
                                            onClick={() => handleCategoryClick(cat.label)}
                                            className="bg-white p-6 rounded-[1.5rem] border border-border flex items-center gap-5 text-left transition-all card-hover group"
                                        >
                                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors flex-shrink-0">
                                                {getCategoryIcon(cat.label)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-foreground text-lg">{cat.label}</h4>
                                                <p className="text-sm text-muted-foreground">{cat.desc}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* WhatsApp Banner */}
                            <section className="bg-green-50 border border-green-100 rounded-[2rem] p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
                                <div className="text-center sm:text-left">
                                    <h3 className="text-2xl font-heading font-bold text-green-800 mb-1">Need Urgent Help?</h3>
                                    <p className="text-sm text-green-700/80 font-medium">Direct line to our kitchen manager.</p>
                                </div>
                                <button
                                    onClick={() => window.open('https://wa.me/917428020104?text=Hi, I need help with my Maa Ki Rasoi order', '_blank')}
                                    className="px-8 py-4 bg-[#25D366] text-white rounded-full font-bold flex items-center gap-2 hover:bg-[#128C7E] transition-colors shadow-lg shadow-green-500/20 whitespace-nowrap"
                                >
                                    <MessageCircle className="w-5 h-5 fill-current" />
                                    WhatsApp Us
                                </button>
                            </section>
                        </>
                    ) : (
                        <div className="bg-white p-8 rounded-[2rem] border border-border shadow-sm animate-fade-in">
                            <div className="flex items-center justify-between mb-8 pb-6 border-b border-border/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <AlertTriangle className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-2xl font-heading font-bold text-foreground">Report {formData.category} Issue</h2>
                                </div>
                                <button onClick={() => setShowForm(false)} className="w-10 h-10 rounded-full hover:bg-background flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-foreground mb-3 ml-2">Issue Details</label>
                                    <textarea
                                        autoFocus
                                        required
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full border-2 border-border rounded-2xl p-4 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none text-foreground bg-background"
                                        placeholder="Please provide specifics so we can resolve this quickly for you..."
                                        rows={6}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-4 text-white rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 relative overflow-hidden ${loading ? 'bg-primary/50' : 'bg-primary hover:bg-primary/90 shadow-md shadow-primary/20'}`}
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        'Submit Ticket'
                                    )}
                                </button>
                                <p className="text-xs text-center text-muted-foreground font-medium">
                                    Our support team usually responds within <strong className="text-foreground">15 minutes</strong>.
                                </p>
                            </form>
                        </div>
                    )}
                </div>

                {/* Sidebar: Tickets History */}
                <div className="space-y-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-4">Ticket Status</h3>

                    {!isLoggedIn ? (
                        <div className="bg-white rounded-[2rem] p-8 border border-border shadow-sm text-center card-hover">
                            <p className="text-sm text-muted-foreground font-medium">Login to view and track your support tickets here.</p>
                        </div>
                    ) : openTickets.length === 0 ? (
                        <div className="bg-success/5 border border-success/20 rounded-[2rem] p-8 text-center shadow-sm">
                            <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4" />
                            <h4 className="font-heading font-bold text-success text-xl mb-1">All Clear!</h4>
                            <p className="text-xs text-success/80 font-medium">No active issues found.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {openTickets.map(ticket => (
                                <div key={ticket.id} className="bg-white rounded-[1.5rem] p-6 border border-border shadow-sm relative overflow-hidden group hover:border-warning/30 transition-colors">
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-warning"></div>
                                    <div className="flex justify-between items-start mb-3 pl-2">
                                        <span className="text-[10px] font-bold text-warning uppercase tracking-wider">{ticket.category}</span>
                                        <span className="text-[10px] text-muted-foreground font-medium">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm font-medium text-foreground line-clamp-3 mb-4 pl-2">{ticket.description}</p>
                                    <div className="flex items-center gap-2 bg-background py-1.5 px-3 rounded-full w-fit ml-2 border border-border">
                                        <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                                        <span className="text-[10px] font-bold text-foreground uppercase tracking-wide">Under Review</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="bg-transparent border border-border rounded-[2rem] p-6 text-center">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Support Operating Hours: <br />
                            <strong className="text-foreground mt-1 inline-block text-sm">10:00 AM - 10:00 PM IST</strong>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}




