import React, { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { PLANS, GST_RATE, DIETARY_PREFERENCE } from '../../config/pricing';

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
    const isWeekly = planConfig?.planType === 'Weekly';
    const [isProcessing, setIsProcessing] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpError, setOtpError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('ONLINE');
    const [address, setAddress] = useState('');
    const payDebounceRef = useRef(false);

    const mealLabel = planConfig?.mealType === 'Both' ? 'Lunch + Dinner' : (planConfig?.mealType || 'Lunch');
    const planLabel = planConfig?.planType === 'MonthlyFull' ? '30-Day' : (planConfig?.planType === 'Weekly' ? '5-Day' : '22-Day');
    const uiTitle = `${planLabel} ${mealLabel} Plan`;
    const uiRange = isWeekly ? 'Mon–Fri, 5 working days' : (planConfig?.planType === 'MonthlyFull' ? '30 consecutive days' : 'Mon–Fri, 22 working days');

    const uiPrice = planConfig?.totalPrice || 0;
    const gstAmount = Math.round(uiPrice * GST_RATE);
    const totalPayable = uiPrice + gstAmount;

    const getSubscriptionPayload = () => {
        const storedUser = JSON.parse(localStorage.getItem('customer_data') || '{}');
        return {
            customerName: storedUser.name || "Customer",
            customerPhone: storedUser.phone || "9999999999",
            customerId: storedUser.id,
            address: address || storedUser.address || "Address not provided",
            planType: planConfig?.planType || "Monthly",
            mealType: planConfig?.mealType || "Lunch",
            dietaryPreference: DIETARY_PREFERENCE,
            startDate: new Date().toISOString()
        };
    };

    const handleVerifyOtp = async () => {
        if (otp.length < 4) return;
        setOtpError('');
        setOtpLoading(true);
        const payload = getSubscriptionPayload();
        try {
            const verifyRes = await axios.post('/auth/otp/verify', { phone: payload.customerPhone, otp });
            if (verifyRes.data.success) {
                setShowOtpModal(false);
                await axios.post('/subscriptions', payload);
                setShowSuccess(true);
            }
        } catch (err) {
            setOtpError(err.response?.data?.message || 'Invalid OTP');
        } finally {
            setOtpLoading(false);
            setOtp('');
        }
    };

    const handlePay = useCallback(async () => {
        if (payDebounceRef.current || isProcessing) return;
        payDebounceRef.current = true;
        setIsProcessing(true);
        const subscriptionPayload = getSubscriptionPayload();

        if (paymentMethod === 'COD') {
            try {
                await axios.post('/auth/otp/request', { phone: subscriptionPayload.customerPhone });
                setShowOtpModal(true);
            } catch (err) {
                alert("Failed to send OTP");
            } finally {
                setIsProcessing(false);
                payDebounceRef.current = false;
            }
            return;
        }

        try {
            const subRes = await axios.post('/subscriptions', subscriptionPayload);
            const subscriptionId = subRes.data.subscription.id;
            const totalPrice = subRes.data.subscription.totalPrice;

            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                alert("SDK Load Error");
                setIsProcessing(false);
                payDebounceRef.current = false;
                return;
            }

            const orderRes = await axios.post('/payments/create-order', {
                amount: totalPrice,
                orderType: 'Subscription',
                referenceId: subscriptionId
            });

            const { id: razorpayOrderId, isMock } = orderRes.data.order;

            if (isMock) {
                const verifyRes = await axios.post('/payments/verify', {
                    razorpay_order_id: razorpayOrderId,
                    razorpay_payment_id: "pay_mock_" + Date.now(),
                    razorpay_signature: "mock_signature",
                    orderType: 'Subscription',
                    referenceId: subscriptionId
                });
                if (verifyRes.data.success) setShowSuccess(true);
                setIsProcessing(false);
                payDebounceRef.current = false;
                return;
            }

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_dummykey',
                amount: totalPrice * 100,
                currency: "INR",
                name: "Maa Ki Rasoi",
                description: uiTitle,
                order_id: razorpayOrderId,
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post('/payments/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderType: 'Subscription',
                            referenceId: subscriptionId
                        });
                        if (verifyRes.data.success) setShowSuccess(true);
                    } catch (err) {
                        alert("Verification Error");
                    }
                },
                prefill: {
                    name: subscriptionPayload.customerName,
                    contact: subscriptionPayload.customerPhone,
                },
                theme: { color: "#C8550A" }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setIsProcessing(false);
            payDebounceRef.current = false;
        }
    }, [isProcessing, paymentMethod, planConfig]);

    if (showSuccess) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
                <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-5xl">verified</span>
                </div>
                <h1 className="text-3xl font-bold mb-4">Subscription Active!</h1>
                <p className="text-text-muted mb-8 max-w-sm">
                    Your "{uiTitle}" is now active. We'll start delivering from tomorrow.
                </p>
                <button
                    onClick={onSuccessComplete}
                    className="btn px-12"
                >
                    Great, Let's Go
                </button>
            </div>
        );
    }

    return (
        <div className="animate-fade-in pb-32">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-brand-beige text-brand-orange">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div>
                    <h1 className="text-3xl font-bold mb-1">Final Setup</h1>
                    <p className="text-text-muted">You're seconds away from healthy home-cooked meals.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                    {/* Summary Card */}
                    <div className="card !p-6 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                            <span className="material-symbols-outlined text-3xl">restaurant</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">{uiTitle}</h3>
                            <p className="text-xs text-text-muted">{uiRange}</p>
                            <p className="text-xs font-bold text-success mt-1 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">bolt</span>
                                Pure Veg Guaranteed
                            </p>
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="card">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-brand-orange">location_on</span>
                            Delivery Address
                        </h4>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="input-field"
                            placeholder="Enter your flat/house no, street, landmark..."
                            rows={3}
                        />
                        {!address && <p className="text-[10px] text-error font-bold">* Exact address required for deliveries</p>}
                    </div>

                    {/* Payment Section */}
                    <div className="card">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-brand-orange">payments</span>
                            Payment Method
                        </h4>
                        <div className="space-y-3">
                            <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'ONLINE' ? 'border-brand-orange bg-brand-orange/5' : 'border-brand-beige opacity-70'}`}>
                                <input type="radio" checked={paymentMethod === 'ONLINE'} onChange={() => setPaymentMethod('ONLINE')} className="accent-brand-orange size-5" />
                                <div className="flex-1">
                                    <p className="font-bold text-sm">Secure Online Payment</p>
                                    <p className="text-[10px] text-text-muted">UPI, Cards, Mandates enabled</p>
                                </div>
                            </label>
                            <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-brand-orange bg-brand-orange/5' : 'border-brand-beige opacity-70'}`}>
                                <input type="radio" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="accent-brand-orange size-5" />
                                <div className="flex-1">
                                    <p className="font-bold text-sm">Pay on Delivery</p>
                                    <p className="text-[10px] text-text-muted">OTP verification required</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Right: Price Sidebar */}
                <div className="lg:sticky lg:top-8">
                    <div className="card !bg-brand-brown text-white shadow-premium !p-8">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-brand-orange-light">
                            <span className="material-symbols-outlined">account_balance_wallet</span>
                            Billing Details
                        </h3>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm text-brand-beige/60">
                                <span>Subscription Price</span>
                                <span>₹{uiPrice}</span>
                            </div>
                            <div className="flex justify-between text-sm text-brand-beige/60">
                                <span>GST (5%)</span>
                                <span>₹{gstAmount}</span>
                            </div>
                            <div className="flex justify-between text-sm text-brand-beige/60">
                                <span>Delivery Fee</span>
                                <span className="text-success font-bold">FREE</span>
                            </div>
                            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                                <span className="text-sm font-bold uppercase">Total Payable</span>
                                <span className="text-3xl font-bold text-brand-orange-light">₹{totalPayable}</span>
                            </div>
                        </div>

                        <button
                            disabled={isProcessing || !address}
                            onClick={handlePay}
                            className="btn btn-block py-4 text-lg"
                        >
                            {isProcessing ? 'Processing...' : (paymentMethod === 'ONLINE' ? 'Pay & Activate' : 'Activate with COD')}
                        </button>

                        <p className="text-[10px] text-center text-brand-beige/40 mt-4 leading-relaxed">
                            Secured by Razorpay. 256-bit encryption. <br />
                            By continuing, you agree to our Subscription Terms.
                        </p>
                    </div>
                </div>
            </div>

            {/* OTP Modal */}
            {showOtpModal && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-brand-brown/80 backdrop-blur-md animate-fade-in">
                    <div className="card w-full max-w-sm !p-8 text-center space-y-6">
                        <h3 className="text-2xl font-bold">Verify COD Order</h3>
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
                                {otpLoading ? 'Verifying...' : 'Confirm Activation'}
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
