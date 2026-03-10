import React, { useState, useRef } from 'react';
import axios from 'axios';

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export default function CheckoutView({ onBack, onSuccessComplete, planConfig }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpError, setOtpError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [startDateMsg, setStartDateMsg] = useState('');

    // Form fields
    const storedUser = JSON.parse(localStorage.getItem('customer_data') || '{}');
    const [name, setName] = useState(storedUser.name || '');
    const [phone, setPhone] = useState(storedUser.phone || '');
    const [address, setAddress] = useState(storedUser.address || '');

    const payDebounceRef = useRef(false);
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);

    const uiTitle = planConfig?.title || 'Subscription Plan';
    const uiPrice = planConfig?.totalPrice || 0;

    const handleVerifyOtp = async () => {
        if (otp.length < 4) return;
        setOtpError('');
        setOtpLoading(true);
        try {
            const verifyRes = await axios.post('/auth/otp/verify', { phone, otp, name });
            if (verifyRes.data.success) {
                setShowOtpModal(false);
                setIsPhoneVerified(true);
                if (verifyRes.data.token) {
                    localStorage.setItem('customer_token', verifyRes.data.token);
                    localStorage.setItem('customer_data', JSON.stringify(verifyRes.data.customer));
                    axios.defaults.headers.common['Authorization'] = `Bearer ${verifyRes.data.token}`;
                }
                processPayment();
            }
        } catch (err) {
            setOtpError(err.response?.data?.message || 'Invalid OTP');
        } finally {
            setOtpLoading(false);
            setOtp('');
        }
    };

    const handlePayClick = async () => {
        if (payDebounceRef.current || isProcessing) return;

        if (!name || name.length < 2) {
            alert("Please provide a valid Name.");
            return;
        }
        if (!phone || phone.length < 10) {
            alert("Please provide a 10-digit Phone Number.");
            return;
        }
        if (!address || address.length < 5) {
            alert("Please provide a complete Delivery Address.");
            return;
        }

        if (!isPhoneVerified && storedUser.phone !== phone) {
            payDebounceRef.current = true;
            setIsProcessing(true);
            try {
                await axios.post('/auth/otp/request', { phone });
                setShowOtpModal(true);
            } catch (err) {
                alert("Failed to send OTP to verify your number.");
            } finally {
                setIsProcessing(false);
                payDebounceRef.current = false;
            }
            return;
        }

        processPayment();
    };

    const processPayment = async () => {
        payDebounceRef.current = true;
        setIsProcessing(true);

        try {
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                alert("Connection lost. Check your network before retrying.");
                setIsProcessing(false);
                payDebounceRef.current = false;
                return;
            }

            const currentUser = JSON.parse(localStorage.getItem('customer_data') || '{}');

            // 1. Create backend order & PENDING payment record
            const orderRes = await axios.post('/payments/create-order', {
                planId: planConfig.planId,
                userId: currentUser.id
            });

            const { orderId, amount, keyId } = orderRes.data;

            // 2. Open Razorpay Checkbox
            const options = {
                key: keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: amount,
                currency: "INR",
                name: "Maa Ki Rasoi",
                description: "Ghar ka swaad, ab aapke paas",
                order_id: orderId,
                handler: async function (response) {
                    try {
                        // 3. Verify exactly on the backend
                        const verifyRes = await axios.post('/payments/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            planId: planConfig.planId,
                            userId: currentUser.id
                        });

                        if (verifyRes.data.success) {
                            const dateObj = new Date(verifyRes.data.startDate);
                            const formattedDate = dateObj.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' });
                            setStartDateMsg(formattedDate);
                            setShowSuccess(true);
                        }
                    } catch (err) {
                        alert("Payment verification failed. Contact us on WhatsApp immediately.");
                    }
                },
                modal: {
                    ondismiss: function () {
                        alert("Payment cancelled. Your plan is ready when you are.");
                    }
                },
                prefill: {
                    name: name,
                    contact: phone,
                    email: currentUser.email || ""
                },
                theme: { color: "#C8550A" }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                alert("Payment verification failed. Contact us on WhatsApp immediately.");
            });
            rzp1.open();
        } catch (error) {
            alert("Error initializing payment. Please try again.");
        } finally {
            setIsProcessing(false);
            payDebounceRef.current = false;
        }
    };

    if (showSuccess) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
                <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-5xl">verified</span>
                </div>
                <h1 className="text-3xl font-bold mb-4">Subscription Active! 🎉</h1>
                <p className="text-text-muted mb-8 max-w-sm">
                    Your {uiTitle} is now active. We'll start delivering firmly on <strong className="text-foreground">{startDateMsg}</strong>.
                </p>
                <button
                    onClick={onSuccessComplete}
                    className="btn px-12"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="animate-fade-in pb-32">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-transparent text-brand-orange">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div>
                    <h1 className="text-3xl font-bold mb-1">Final Setup</h1>
                    <p className="text-text-muted">You're seconds away from healthy home-cooked meals.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                    <div className="card !p-6 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                            <span className="material-symbols-outlined text-3xl">restaurant</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">{uiTitle}</h3>
                            <p className="text-xs font-bold text-success mt-1 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">bolt</span>
                                Pure Veg Guaranteed
                            </p>
                        </div>
                    </div>

                    <div className="card">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-brand-orange">location_on</span>
                            Delivery Details
                        </h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-text-main mb-2">Name</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="Your Full Name"
                                    required
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-text-main mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    className="input-field"
                                    placeholder="10-digit Mobile Number"
                                    required
                                    maxLength={10}
                                    value={phone}
                                    onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-text-main mb-2">Address</label>
                                <textarea
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="input-field"
                                    placeholder="Enter your flat/house no, street, landmark..."
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="card border-brand-orange bg-brand-orange/5">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-brand-orange mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined">verified_user</span>
                            Secure Online Payment
                        </h4>
                        <p className="text-xs text-text-muted">UPI, Cards, and Netbanking natively supported via Razorpay Checkout.</p>
                    </div>
                </div>

                <div className="lg:sticky lg:top-8">
                    <div className="card !bg-brand-dark text-white shadow-premium !p-8">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-brand-orange-light">
                            <span className="material-symbols-outlined">account_balance_wallet</span>
                            Billing Details
                        </h3>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm text-brand-dark/60">
                                <span>Subscription Price</span>
                                <span>₹{uiPrice}</span>
                            </div>
                            <div className="flex justify-between text-sm text-brand-dark/60">
                                <span>Delivery Fee</span>
                                <span className="text-success font-bold">FREE</span>
                            </div>
                            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                                <span className="text-sm font-bold uppercase">Total Payable</span>
                                <span className="text-3xl font-bold text-brand-orange-light">₹{uiPrice}</span>
                            </div>
                        </div>

                        <button
                            disabled={isProcessing || !address}
                            onClick={handlePayClick}
                            className="btn btn-block py-4 text-lg bg-brand-orange text-white"
                        >
                            {isProcessing ? 'Processing securely...' : 'Pay & Activate'}
                        </button>

                        <p className="text-[10px] text-center text-brand-dark/40 mt-4 leading-relaxed">
                            Secured by Razorpay. 256-bit encryption. <br />
                            By continuing, you agree to our Subscription Terms.
                        </p>
                    </div>
                </div>
            </div>

            {/* OTP Modal */}
            {showOtpModal && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-md animate-fade-in">
                    <div className="card w-full max-w-sm !p-8 text-center space-y-6">
                        <h3 className="text-2xl font-bold">Verify Security OTP</h3>
                        <p className="text-text-muted">Enter the 4-digit code sent to your phone to proceed.</p>

                        <input
                            autoFocus
                            type="text"
                            maxLength={4}
                            value={otp}
                            onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                            className="input-field text-center text-4xl font-bold tracking-[0.5em] h-16"
                            placeholder="••••"
                        />

                        {otpError && <p className="text-error font-bold text-sm">{otpError}</p>}

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleVerifyOtp}
                                disabled={otp.length < 4 || otpLoading}
                                className="btn btn-block py-4"
                            >
                                {otpLoading ? 'Verifying...' : 'Confirm'}
                            </button>
                            <button
                                onClick={() => setShowOtpModal(false)}
                                className="btn btn-secondary btn-block"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}




