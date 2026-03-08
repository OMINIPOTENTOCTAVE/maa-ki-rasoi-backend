import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { toast } from 'sonner';

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
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/otp/request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: phoneNumber })
            });

            if (!res.ok) throw new Error("Failed to send OTP");
            window.pendingPhoneNumber = phoneNumber;
            return true;
        } catch (error) {
            console.error("Phone sign-in error:", error);
            toast.error('Failed to send OTP. Try again.');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async (otp) => {
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/otp/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: window.pendingPhoneNumber, otp }),
                credentials: 'include'
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to verify OTP`);
            }

            const data = await res.json();
            setUser(data.customer);
            setAuthToken(data.token);
            localStorage.setItem('customer_token', data.token);
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
