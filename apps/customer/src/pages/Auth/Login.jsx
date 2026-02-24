import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

    // ── Form Section (shared by mobile & desktop) ──
    const formContent = (
        <div className="w-full max-w-md mx-auto flex flex-col">
            <div className="text-center md:text-left mb-8">
                {/* Mobile-only logo */}
                <div className="md:hidden flex justify-center mb-6">
                    <div className="w-20 h-20 bg-brand-saffron/10 rounded-full flex items-center justify-center border-4 border-brand-saffron/20">
                        <span className="material-symbols-outlined text-brand-saffron text-4xl">lunch_dining</span>
                    </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2 font-heading">
                    Maa Ki Rasoi
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-snug">
                    Your daily dose of <span className="text-brand-saffron font-bold">home-cooked</span> care.
                </p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-5">
                <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1" htmlFor="phone">Phone Number</label>
                    <div className="relative flex items-center group focus-within:ring-2 focus-within:ring-brand-saffron focus-within:ring-offset-2 rounded-xl transition-all duration-200">
                        <div className="absolute left-0 top-0 bottom-0 pl-4 flex items-center pointer-events-none">
                            <span className="text-slate-500 dark:text-slate-400 font-bold border-r border-slate-200 dark:border-neutral-600 pr-3 mr-3">+91</span>
                        </div>
                        <input disabled={otpSent} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} className="block w-full h-14 pl-[4.5rem] pr-[110px] rounded-xl border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-900 text-slate-900 dark:text-white placeholder-slate-400 focus:border-brand-saffron focus:ring-0 text-lg font-medium tracking-wide shadow-sm" id="phone" type="tel" placeholder="98765 43210" maxLength={10} />

                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                            {!otpSent ? (
                                <button
                                    type="button"
                                    onClick={handleSendOTP}
                                    disabled={loading || phone.length < 10}
                                    className="px-4 py-1.5 bg-brand-saffron/10 text-brand-saffron hover:bg-brand-saffron hover:text-white rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                                >
                                    Send OTP
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => { setOtpSent(false); setOtp(''); }}
                                    className="px-3 py-1.5 text-slate-400 hover:text-brand-saffron rounded-lg text-sm font-bold transition-colors"
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {otpSent && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-end mb-1">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">OTP Code</label>
                                <button
                                    type="button"
                                    onClick={handleSendOTP}
                                    disabled={loading}
                                    className="text-xs font-bold text-brand-saffron hover:underline focus:outline-none"
                                >
                                    Resend OTP
                                </button>
                            </div>
                            <input autoFocus value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} className="block w-full h-14 px-4 rounded-xl border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-900 text-slate-900 dark:text-white focus:border-brand-saffron focus:ring-2 focus:ring-brand-saffron text-center text-3xl tracking-[0.5em] shadow-sm font-bold" type="text" maxLength={4} placeholder="••••" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Your Name</label>
                            <input value={name} onChange={(e) => setName(e.target.value)} className="block w-full h-14 px-4 rounded-xl border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-900 text-slate-900 dark:text-white focus:border-brand-saffron focus:ring-2 focus:ring-brand-saffron shadow-sm text-lg" type="text" placeholder="Optional (If new user)" />
                        </div>
                    </div>
                )}

                {errorMsg && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm text-center font-medium animate-in fade-in">
                        {errorMsg}
                    </div>
                )}

                {otpSent ? (
                    <button disabled={loading || otp.length < 4} type="submit" className="w-full h-14 bg-brand-saffron hover:bg-[#D97706] text-white font-bold text-lg rounded-xl shadow-lg shadow-brand-saffron/30 flex items-center justify-center transition-transform active:scale-[0.98] group disabled:opacity-70 disabled:active:scale-100">
                        <span className="mr-2">
                            {loading ? 'Verifying...' : 'Login securely'}
                        </span>
                        {!loading && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">lock_open</span>}
                    </button>
                ) : (
                    <button disabled={loading || phone.length < 10} type="submit" className="w-full h-14 bg-brand-saffron hover:bg-[#D97706] text-white font-bold text-lg rounded-xl shadow-lg shadow-brand-saffron/30 flex items-center justify-center transition-transform active:scale-[0.98] group disabled:opacity-70 disabled:active:scale-100">
                        <span className="mr-2">
                            {loading ? 'Processing...' : 'Send OTP'}
                        </span>
                        {!loading && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">send</span>}
                    </button>
                )}
            </form>

            <div className="text-center mt-8 pt-4">
                <p className="text-xs text-slate-400 leading-relaxed px-4">
                    By continuing, you agree to our <br className="md:hidden" />
                    <a className="text-brand-saffron hover:underline font-medium" href="#">Terms of Service</a> and <a className="text-brand-saffron hover:underline font-medium" href="#">Privacy Policy</a>.
                </p>
            </div>
        </div>
    );

    return (
        <div className="bg-brand-cream dark:bg-brand-dark font-display antialiased text-slate-900 dark:text-slate-100 min-h-screen">
            {/* ── Desktop: Side-by-side layout ── */}
            <div className="hidden md:flex h-screen">
                {/* Left Panel — Branding */}
                <div className="w-1/2 relative bg-gradient-to-br from-brand-saffron via-[#D97706] to-[#B45309] flex flex-col items-center justify-center p-12 overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/5"></div>
                    <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-white/5"></div>
                    <div className="absolute top-1/4 right-10 w-40 h-40 rounded-full bg-white/5"></div>

                    <div className="relative z-10 text-center">
                        <div className="w-28 h-28 bg-white/15 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl border border-white/20">
                            <span className="material-symbols-outlined text-white text-6xl">lunch_dining</span>
                        </div>
                        <h2 className="text-5xl font-extrabold text-white mb-4 font-heading leading-tight">
                            Maa Ki<br /><span className="italic opacity-90">Rasoi</span>
                        </h2>
                        <p className="text-white/80 text-lg font-medium max-w-sm mx-auto leading-relaxed">
                            Ghar ka khana, har din.<br />
                            Fresh, wholesome meals delivered to your doorstep.
                        </p>

                        <div className="mt-10 flex gap-6 justify-center">
                            <div className="text-center">
                                <div className="text-3xl font-black text-white">500+</div>
                                <div className="text-white/60 text-xs font-medium mt-1">Happy Customers</div>
                            </div>
                            <div className="w-px h-12 bg-white/20"></div>
                            <div className="text-center">
                                <div className="text-3xl font-black text-white">🌿</div>
                                <div className="text-white/60 text-xs font-medium mt-1">100% Pure Veg</div>
                            </div>
                            <div className="w-px h-12 bg-white/20"></div>
                            <div className="text-center">
                                <div className="text-3xl font-black text-white">₹100</div>
                                <div className="text-white/60 text-xs font-medium mt-1">Per Meal</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel — Form */}
                <div className="w-1/2 flex items-center justify-center p-12 bg-white dark:bg-neutral-900">
                    {formContent}
                </div>
            </div>

            {/* ── Mobile: Original card layout ── */}
            <div className="md:hidden flex items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-md bg-white dark:bg-neutral-800 rounded-xl shadow-xl overflow-hidden relative flex flex-col">
                    <div className="relative h-52 w-full bg-orange-50 dark:bg-neutral-700">
                        <div className="absolute inset-0 bg-gradient-to-b from-brand-saffron/20 to-white dark:from-orange-900/20 dark:to-neutral-800 z-0"></div>
                        <div className="absolute inset-0 bg-center bg-cover opacity-90 z-10" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA2awJwtVvtt4EBk_Y-bMPKTYhUtToBkqgOD5w8XzGgD_miqjhXEw2L8Dh_VQC6RORUWzshnPwrq5-YEgwAGG4Eiuzc83Lw20ySjw_MmktIbj84-19vYqRTK-lUBMpS0ZX4jB2KtFxXAjL16308PWQBcgiISQC-u-5Te36286VHG4VouagwwYCpwN7O5SioeevU6C9fH-OW3fzYk2VPQOVDT3oZQmoMtmcgA_yAR6PRrbV34nGU-JK5Jx_abbuWN7zVkqw5J7egxZPo')", maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 100%)" }}></div>
                    </div>
                    <div className="px-6 pt-2 pb-8">
                        {formContent}
                    </div>
                </div>
            </div>
        </div>
    );
}
