import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if (!otpSent) {
            setOtpSent(true);
        } else {
            // Simulate verification
            navigate('/');
        }
    };

    return (
        <div className="bg-brand-cream dark:bg-brand-dark font-display antialiased text-slate-900 dark:text-slate-100 min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-neutral-800 rounded-xl shadow-xl overflow-hidden relative min-h-[700px] flex flex-col">
                <div className="relative h-64 w-full bg-orange-50 dark:bg-neutral-700">
                    <div className="absolute inset-0 bg-gradient-to-b from-brand-saffron/20 to-white dark:from-orange-900/20 dark:to-neutral-800 z-0"></div>
                    <div className="absolute inset-0 bg-center bg-cover opacity-90 z-10" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA2awJwtVvtt4EBk_Y-bMPKTYhUtToBkqgOD5w8XzGgD_miqjhXEw2L8Dh_VQC6RORUWzshnPwrq5-YEgwAGG4Eiuzc83Lw20ySjw_MmktIbj84-19vYqRTK-lUBMpS0ZX4jB2KtFxXAjL16308PWQBcgiISQC-u-5Te36286VHG4VouagwwYCpwN7O5SioeevU6C9fH-OW3fzYk2VPQOVDT3oZQmoMtmcgA_yAR6PRrbV34nGU-JK5Jx_abbuWN7zVkqw5J7egxZPo')", maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 100%)" }}></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                        <div className="w-24 h-24 bg-white dark:bg-neutral-900 rounded-full shadow-lg flex items-center justify-center border-4 border-brand-saffron/20 p-2">
                            <span className="material-symbols-outlined text-brand-saffron text-5xl">lunch_dining</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 px-6 pt-2 pb-8 flex flex-col items-center z-10">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">Maa Ki Rasoi</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-snug max-w-[280px] mx-auto">
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
                                <input disabled={otpSent} value={phone} onChange={(e) => setPhone(e.target.value)} className="block w-full h-14 pl-[4.5rem] pr-4 rounded-xl border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-900 text-slate-900 dark:text-white placeholder-slate-400 focus:border-brand-saffron focus:ring-0 text-lg font-medium tracking-wide shadow-sm" id="phone" type="tel" placeholder="98765 43210" />
                            </div>
                        </div>

                        {otpSent && (
                            <div className="space-y-1.5 animate-in fade-in slide-in-from-bottom-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">OTP Code</label>
                                <input autoFocus value={otp} onChange={(e) => setOtp(e.target.value)} className="block w-full h-14 px-4 rounded-xl border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-900 text-slate-900 dark:text-white focus:border-brand-saffron focus:ring-2 focus:ring-brand-saffron text-center text-2xl tracking-[0.5em] shadow-sm" type="text" maxLength={4} placeholder="••••" />
                            </div>
                        )}

                        <button type="submit" className="w-full h-14 bg-brand-saffron hover:bg-[#D97706] text-white font-bold text-lg rounded-xl shadow-lg shadow-brand-saffron/30 flex items-center justify-center transition-transform active:scale-[0.98] group">
                            <span className="mr-2">{otpSent ? 'Login directly' : 'Get OTP'}</span>
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                    </form>

                    <div className="flex-grow"></div>

                    <div className="text-center mt-8 pt-4">
                        <p className="text-xs text-slate-400 leading-relaxed px-4">
                            By continuing, you agree to our <br />
                            <a className="text-brand-saffron hover:underline font-medium" href="#">Terms of Service</a> and <a className="text-brand-saffron hover:underline font-medium" href="#">Privacy Policy</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
