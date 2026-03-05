import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { auth, googleProvider } from '../../config/firebase';
import { signInWithPopup } from 'firebase/auth';

export default function Login() {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');

    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
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

    const handleGoogleLogin = async () => {
        setErrorMsg('');
        setGoogleLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();

            const res = await axios.post('/auth/google', { idToken });
            if (res.data.success) {
                localStorage.setItem('customer_token', res.data.token);
                localStorage.setItem('customer_data', JSON.stringify(res.data.customer));
                axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
                navigate('/');
            }
        } catch (err) {
            if (err.code === 'auth/popup-closed-by-user') {
                // User closed the popup, not an error
                return;
            }
            setErrorMsg(err.response?.data?.message || 'Google sign-in failed. Try again.');
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-var(--header-height)-var(--bottom-nav-height)-4rem)] animate-slide-up">
            <div className="card w-full max-w-md p-8 md:p-12">
                {/* Header with Back Button */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 -ml-2 rounded-full hover:bg-transparent text-brand-orange transition-colors"
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
                    <p className="text-brand-dark">
                        Login required only for <span className="text-brand-orange font-semibold">Subscription</span>.
                    </p>
                </div>

                {/* Google Sign-In Button */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={googleLoading}
                    className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl border-2 border-gray-200 bg-white text-gray-700 font-bold text-base hover:border-gray-300 hover:shadow-md transition-all duration-200 mb-6"
                >
                    {googleLoading ? (
                        <span className="text-sm">Signing in...</span>
                    ) : (
                        <>
                            <svg width="20" height="20" viewBox="0 0 48 48">
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                            </svg>
                            <span>Continue with Google</span>
                        </>
                    )}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="text-xs text-text-muted font-bold uppercase tracking-wider">or use phone</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
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
