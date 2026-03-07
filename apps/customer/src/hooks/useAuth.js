import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signInWithPhoneNumber, RecaptchaVerifier, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { toast } from 'sonner';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [authToken, setAuthToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize Recaptcha (only called if phone auth is used)
    const setupRecaptcha = (buttonId) => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, buttonId, {
                size: 'invisible',
                callback: () => {
                    // reCAPTCHA solved
                }
            });
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Force refresh the token to get the latest
                    const idToken = await firebaseUser.getIdToken(true);

                    // Exchange Firebase idToken for App JWT
                    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/firebase`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ idToken }),
                        credentials: 'include' // Important for sending/receiving httpOnly refresh cookies
                    });

                    if (!res.ok) {
                        const errorText = await res.text();
                        throw new Error(`Failed to exchange token: ${res.status} - ${errorText}`);
                    }

                    const data = await res.json();
                    setUser(data.customer);
                    setAuthToken(data.token);

                    // Also set in localStorage for axios interceptors as per rulebook
                    localStorage.setItem('customer_token', data.token);

                } catch (err) {
                    console.error('[AUTH ERROR]', err);
                    toast.error("Authentication failed. Please sign in again.");
                    setUser(null);
                    setAuthToken(null);
                    localStorage.removeItem('customer_token');
                    await firebaseSignOut(auth);
                }
            } else {
                setUser(null);
                setAuthToken(null);
                localStorage.removeItem('customer_token');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            setLoading(true); // show loader during pop-up
            await signInWithPopup(auth, googleProvider);
            // Let onAuthStateChanged handle the backend exchange and state update
        } catch (error) {
            if (error.code !== 'auth/popup-closed-by-user') {
                console.error("Google sign-in error:", error);
                toast.error('Google sign-in failed. Try again.');
            }
            setLoading(false);
            throw error;
        }
    };

    const signInWithPhone = async (phoneNumber, buttonId) => {
        try {
            setupRecaptcha(buttonId);
            const appVerifier = window.recaptchaVerifier;
            const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            window.confirmationResult = confirmationResult;
            return true;
        } catch (error) {
            console.error("Phone sign-in error:", error);
            toast.error('Failed to send OTP. Try again.');
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
            throw error;
        }
    };

    const verifyOtp = async (otp) => {
        try {
            const confirmationResult = window.confirmationResult;
            await confirmationResult.confirm(otp);
            // onAuthStateChanged takes over
            return true;
        } catch (error) {
            console.error("OTP verification error:", error);
            toast.error('Invalid OTP. Please try again.');
            throw error;
        }
    };

    const signOut = async () => {
        try {
            setLoading(true);
            await firebaseSignOut(auth);

            // Also hit the backend logout endpoint if needed
            await fetch(`${import.meta.env.VITE_API_URL}/api/auth/otp/logout`, {
                method: 'POST',
                credentials: 'include' // clear httpOnly cookie
            });

            setUser(null);
            setAuthToken(null);
            localStorage.removeItem('customer_token');
        } catch (error) {
            console.error("Error signing out:", error);
        } finally {
            setLoading(false);
        }
    };

    return { user, authToken, loading, signInWithGoogle, signInWithPhone, verifyOtp, signOut };
}
