import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { auth, googleProvider } from '../../config/firebase';
import { signInWithPopup } from 'firebase/auth';

export default function Login() {
    const navigate = useNavigate();
    const [googleLoading, setGoogleLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

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
                return;
            }
            setErrorMsg(err.response?.data?.message || 'Google sign-in failed. Try again.');
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-var(--header-height)-var(--bottom-nav-height)-4rem)] animate-slide-up">
            <div className="card w-full max-w-md p-8 md:p-12 text-center flex flex-col items-center">
                {/* Header with Back Button */}
                <div className="w-full flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 -ml-2 rounded-full hover:bg-transparent text-primary transition-colors flex items-center gap-2"
                        title="Back to Home"
                    >
                        <span className="material-symbols-outlined text-xl">arrow_back</span>
                    </button>
                    <div className="text-right">
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Secure Login</span>
                    </div>
                </div>

                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <span className="text-3xl">🔐</span>
                </div>

                <div className="text-center mb-10">
                    <h1 className="text-3xl font-heading font-bold mb-2 text-foreground">Welcome Back</h1>
                    <p className="text-muted-foreground">
                        Please sign in to manage your <span className="text-primary font-bold">Subscriptions</span> and orders.
                    </p>
                </div>

                {errorMsg && (
                    <div className="bg-destructive/10 text-destructive p-4 rounded-xl text-sm font-bold text-center mb-6 w-full">
                        {errorMsg}
                    </div>
                )}

                {/* Google Sign-In Button */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={googleLoading}
                    className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl border-2 border-border bg-white text-foreground font-bold text-lg hover:border-primary/50 hover:shadow-lg transition-all duration-300 mb-8 active:scale-95 group"
                >
                    {googleLoading ? (
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <span>Signing in...</span>
                        </div>
                    ) : (
                        <>
                            <svg width="24" height="24" viewBox="0 0 48 48" className="group-hover:scale-110 transition-transform">
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                            </svg>
                            <span>Continue with Google</span>
                        </>
                    )}
                </button>

                <div className="mt-4 text-center space-y-4 w-full">
                    <button
                        onClick={() => navigate('/')}
                        className="text-muted-foreground font-bold hover:text-primary transition-colors text-sm"
                    >
                        Maybe Later
                    </button>

                    <p className="text-[11px] text-muted-foreground leading-relaxed px-4 mx-auto max-w-[250px]">
                        By authenticating, you agree to our <br />
                        <span className="font-bold text-foreground cursor-pointer hover:text-primary">Terms of Service</span> and <span className="font-bold text-foreground cursor-pointer hover:text-primary">Privacy Policy</span>.
                    </p>
                </div>
            </div>
        </div>
    );
}
