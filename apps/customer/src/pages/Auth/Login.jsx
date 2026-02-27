import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSendOTP = async () => {
        if (!phone || phone.length < 10) {
            setErrorMsg('Please enter a valid phone number');
            return;
        }
        setErrorMsg('');
        setLoading(true);

        try {
            await axios.post('/auth/otp/request', { phone });
            setOtpSent(true);
            setOtp('');
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Failed to send OTP. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!otpSent) {
            return handleSendOTP();
        }

        setErrorMsg('');
        setLoading(true);

        try {
            const res = await axios.post('/auth/otp/verify', { phone, otp, name });
            if (res.data.success) {
                localStorage.setItem('customer_token', res.data.token);
                localStorage.setItem('customer_data', JSON.stringify(res.data.customer));
                axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
                navigate('/');
            }
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Authentication failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-var(--header-height)-var(--bottom-nav-height)-4rem)] animate-slide-up">
            <div className="card w-full max-w-lg p-8 md:p-12">
                {/* Header with Back Button */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 -ml-2 rounded-full hover:bg-brand-beige text-brand-orange transition-colors"
                        title="Back to Home"
                    >
                        <span className="material-symbols-outlined text-2xl">arrow_back</span>
                    </button>
                    <div className="text-right">
                        <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Pure Veg Platform</span>
                    </div>
                </div>

                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-text-muted">
                        Login required only for <span className="text-brand-orange font-semibold">Subscription</span>.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-text-main mb-2">Phone Number</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-bold border-r pr-3">+91</span>
                            <input
                                disabled={otpSent}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                className="input-field !mb-0 pl-16 text-lg"
                                type="tel"
                                placeholder="98765 43210"
                                maxLength={10}
                            />
                        </div>
                    </div>

                    {otpSent && (
                        <div className="space-y-4 animate-fade-in">
                            <div>
                                <label className="block text-sm font-bold text-text-main mb-2">OTP Code</label>
                                <input
                                    autoFocus
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    className="input-field text-center text-2xl tracking-[0.5em] font-bold"
                                    type="text"
                                    maxLength={4}
                                    placeholder="••••"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-text-main mb-2">Your Name</label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input-field"
                                    type="text"
                                    placeholder="Enter your name"
                                />
                            </div>
                        </div>
                    )}

                    {errorMsg && (
                        <div className="bg-red-50 text-error p-4 rounded-xl text-sm font-medium text-center">
                            {errorMsg}
                        </div>
                    )}

                    <button
                        disabled={loading || (otpSent ? otp.length < 4 : phone.length < 10)}
                        type="submit"
                        className="btn btn-block py-4 text-lg"
                    >
                        {loading ? 'Processing...' : (otpSent ? 'Verify & Login' : 'Send OTP')}
                    </button>
                </form>

                <div className="mt-8 text-center space-y-4">
                    <button
                        onClick={() => navigate('/')}
                        className="text-brand-orange font-bold text-sm hover:underline"
                    >
                        Continue as Guest
                    </button>

                    <p className="text-[10px] text-text-muted leading-relaxed px-4">
                        By continuing, you agree to our <br />
                        <span className="font-semibold text-text-main">Terms of Service</span> and <span className="font-semibold text-text-main">Privacy Policy</span>.
                    </p>
                </div>
            </div>
        </div>
    );
}

