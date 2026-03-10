import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { toast } from 'sonner';

export const formatIndianPhone = (phone) => {
    let cleaned = phone.replace(/\D/g, ""); // remove spaces/dashes

    if (cleaned.startsWith("0")) {
        cleaned = cleaned.substring(1);
    }

    if (cleaned.startsWith("91")) {
        cleaned = cleaned.substring(2);
    }

    return `+91${cleaned.slice(-10)}`; // Ensure we only take the last 10 digits
};

export const isValidIndianMobile = (phone) => {
    const cleaned = phone.replace(/\D/g, "");
    const last10 = cleaned.slice(-10);
    return /^[6-9]\d{9}$/.test(last10);
};

export function useAuth() {
    const [user, setUser] = useState(null);
    const [authToken, setAuthToken] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Force refresh the token to get the latest
                    const idToken = await firebaseUser.getIdToken(true);

                    // Exchange Firebase idToken for App JWT
                    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/firebase`, {
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
                    localStorage.setItem('customer_data', JSON.stringify(data.customer));

                } catch (err) {
                    console.error('[AUTH ERROR]', err);
                    toast.error("Authentication failed. Please sign in again.");
                    setUser(null);
                    setAuthToken(null);
                    localStorage.removeItem('customer_token');
                    localStorage.removeItem('customer_data');
                    await firebaseSignOut(auth);
                }
            } else {
                setUser(null);
                setAuthToken(null);
                localStorage.removeItem('customer_token');
                localStorage.removeItem('customer_data');
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

    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(
                auth,
                "recaptcha-container",
                {
                    size: "invisible"
                }
            );
        }
    };

    const signInWithPhone = async (phoneNumber) => {
        try {
            setLoading(true);

            // Format phone number
            const formattedPhone = formatIndianPhone(phoneNumber);

            // 1. Setup Recaptcha Singleton
            setupRecaptcha();
            const appVerifier = window.recaptchaVerifier;

            // 2. Request OTP from Firebase directly
            const confirmation = await signInWithPhoneNumber(
                auth,
                formattedPhone,
                appVerifier
            );

            // 3. Store result for verification step
            window.confirmationResult = confirmation;
            window.pendingPhoneNumber = formattedPhone;

            return true;
        } catch (error) {
            console.error("Phone sign-in error:", error);

            // Critical: Reset recaptcha on failure so user can try again
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }

            throw new Error(error.message || 'Failed to send OTP. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async (otp) => {
        try {
            setLoading(true);

            if (!window.confirmationResult) {
                throw new Error("Please request a new OTP.");
            }

            // 1. Verify OTP with Firebase
            const result = await window.confirmationResult.confirm(otp);

            // Force token refresh immediately
            const idToken = await result.user.getIdToken(true);

            // 2. Exchange with backend for App Token
            const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/firebase`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken }),
                credentials: 'include'
            });

            if (!res.ok) {
                let errorMsg = "Failed to authenticate with server";
                try {
                    const errData = await res.json();
                    errorMsg = errData.message;
                } catch (e) { }
                throw new Error(errorMsg);
            }

            const data = await res.json();
            setUser(data.customer);
            setAuthToken(data.token);
            localStorage.setItem('customer_token', data.token);
            localStorage.setItem('customer_data', JSON.stringify(data.customer));
            return true;
        } catch (error) {
            console.error("OTP verification error:", error);
            toast.error('Invalid OTP. Please try again.');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        try {
            setLoading(true);
            await firebaseSignOut(auth);

            // Also hit the backend logout endpoint if needed
            await fetch(`${import.meta.env.VITE_API_URL}/auth/otp/logout`, {
                method: 'POST',
                credentials: 'include' // clear httpOnly cookie
            });

            setUser(null);
            setAuthToken(null);
            localStorage.removeItem('customer_token');
            localStorage.removeItem('customer_data');
        } catch (error) {
            console.error("Error signing out:", error);
        } finally {
            setLoading(false);
        }
    };

    return { user, authToken, loading, signInWithGoogle, signInWithPhone, verifyOtp, signOut, formatIndianPhone, isValidIndianMobile };
}
