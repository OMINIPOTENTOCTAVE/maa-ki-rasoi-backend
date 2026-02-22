import React, { useState } from 'react';
import axios from 'axios';

// Razorpay Script Loader
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
    const [enableAutoPay, setEnableAutoPay] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('ONLINE');

    const handleClearOtp = () => {
        setOtp('');
        setOtpError('');
    };
    const getSubscriptionPayload = () => {
        const storedUser = JSON.parse(localStorage.getItem('customer_data') || '{}');
        return {
            customerName: storedUser.name || "Customer",
            customerPhone: storedUser.phone || "9999999999",
            customerId: storedUser.id,
            address: "Hostel 3, Room 402",
            planType: planConfig?.planType || "Monthly",
            mealType: planConfig?.mealType || "Lunch",
            dietaryPreference: planConfig?.dietaryPreference || "Veg",
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
                setTimeout(() => onSuccessComplete(), 2000);
            }
        } catch (err) {
            setOtpError(err.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setOtpLoading(false);
            setOtp('');
        }
    };

    const handlePay = async () => {
        setIsProcessing(true);
        const subscriptionPayload = getSubscriptionPayload();

        if (paymentMethod === 'COD') {
            try {
                await axios.post('/auth/otp/request', { phone: subscriptionPayload.customerPhone });
                setShowOtpModal(true);
            } catch (err) {
                alert("Failed to send OTP. Please try again.");
            } finally {
                setIsProcessing(false);
            }
            return;
        }

        try {
            const subRes = await axios.post('/subscriptions', subscriptionPayload);
            const subscriptionId = subRes.data.subscription.id;
            const totalPrice = subRes.data.subscription.totalPrice;

            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                alert("Failed to load Razorpay SDK. Check your internet connection.");
                setIsProcessing(false);
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

                if (verifyRes.data.success) {
                    setShowSuccess(true);
                    setTimeout(() => onSuccessComplete(), 2000);
                }
                setIsProcessing(false);
                return;
            }

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_dummykey',
                amount: totalPrice * 100,
                currency: "INR",
                name: "Maa Ki Rasoi",
                description: uiTitle,
                image: "https://raw.githubusercontent.com/OMINIPOTENTOCTAVE/maa-ki-rasoi-assets/main/logo.png",
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

                        if (verifyRes.data.success) {
                            setShowSuccess(true);
                            setTimeout(() => onSuccessComplete(), 2000);
                        }
                    } catch (err) {
                        alert("Payment verification failed. If money was deducted, contact support.");
                    }
                },
                prefill: {
                    name: subscriptionPayload.customerName,
                    contact: subscriptionPayload.customerPhone,
                },
                theme: {
                    color: "#f59e0b"
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                alert("Payment Failed: " + response.error.description);
            });
            rzp1.open();
        } catch (error) {
            console.error(error);
            alert("An error occurred during checkout.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="absolute inset-0 z-50 bg-[#f8f7f5] dark:bg-[#221b10] flex flex-col no-scrollbar overflow-y-auto">
            <header className="sticky top-0 z-10 flex items-center justify-between bg-white/95 dark:bg-[#221b10]/95 backdrop-blur-md px-4 py-4 transition-colors">
                <button onClick={onBack} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-2xl">arrow_back</span>
                </button>
                <h1 className="text-lg font-bold">Checkout</h1>
                <div className="w-10"></div>
            </header>

            <main className="flex flex-col gap-6 p-4 pb-32">
                <section className="rounded-xl bg-white dark:bg-[#2d2418] shadow-sm p-4 border border-gray-100 dark:border-gray-800">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-4 flex-1">
                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800 relative">
                                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD_JBpahAewmkA8Ud-6JzYOkMbnusVqYoQFKOr7lbdmdDFBKmRBzt5s1mniGWZiJZ9TbeJG3Kwf8gasjOvSUrelvflM2Dy14LoaoPPS71PunnKn7acYoRxB8JQC3BtqdYUMyju8im0VBacecSTWGXwFrbU5hlEGFagmmi2495tRNA36NWGMcTS8qKLwhPtDB9vAj0J5ybI6IM-tsdFUB8VrU35LvFJ-pvwh1WsvMgDxutPVpkPR-01BeFt6ABk0qrL4BTHnqtPmuLUr')" }}></div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <h2 className="text-base font-bold leading-tight">{uiTitle}</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{uiRange}</p>
                                <p className="text-xs text-brand-saffron font-medium mt-1">Starts Tomorrow, 12:30 PM</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="flex flex-col gap-3 px-2">
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                        <span>Item Total</span><span>₹{uiPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                        <span>GST (5%)</span><span>₹{(uiPrice * 0.05).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                        <span>Delivery Charges</span><span className="text-brand-green font-medium">Free</span>
                    </div>
                    <div className="my-1 h-px w-full bg-slate-200 dark:bg-white/10"></div>
                    <div className="flex justify-between items-end">
                        <span className="text-base font-bold">Total Payable</span>
                        <span className="text-xl font-extrabold tracking-tight text-brand-saffron">₹{uiPrice + (uiPrice * 0.05)}</span>
                    </div>
                </section>

                <section className="rounded-xl bg-brand-saffron/10 border border-brand-saffron/20 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-3 items-center">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-saffron/20 text-brand-saffron">
                                <span className="material-symbols-outlined">autorenew</span>
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-sm font-bold">Enable Auto-Pay</h3>
                                <p className="text-xs text-slate-600 dark:text-slate-400">Save ₹50 on next renewal</p>
                            </div>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                            <input type="checkbox" className="peer sr-only" checked={enableAutoPay} onChange={() => setEnableAutoPay(!enableAutoPay)} />
                            <div className="peer h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-saffron peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-slate-700"></div>
                        </label>
                    </div>
                </section>

                <section>
                    <h3 className="mb-3 px-2 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Payment Method</h3>
                    <div className="flex flex-col gap-3">
                        <label className="group relative flex cursor-pointer items-center gap-4 rounded-xl border bg-white dark:bg-[#2d2418] border-gray-200 dark:border-gray-800 p-4 shadow-sm transition-all hover:border-brand-saffron/50 has-[input:checked]:border-brand-saffron has-[input:checked]:bg-brand-saffron/5">
                            <input
                                checked={paymentMethod === 'ONLINE'}
                                onChange={() => setPaymentMethod('ONLINE')}
                                className="peer h-5 w-5 border-2 border-slate-400 text-brand-saffron focus:ring-brand-saffron dark:bg-transparent" name="payment_method" type="radio" />
                            <div className="flex flex-col flex-1 pl-2">
                                <p className="text-sm font-bold">Pay Online (UPI / Card)</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">GooglePay, PhonePe, Cards</p>
                            </div>
                            <span className="material-symbols-outlined text-brand-saffron opacity-0 peer-checked:opacity-100">check_circle</span>
                        </label>
                        <label className="group relative flex cursor-pointer items-center gap-4 rounded-xl border bg-white dark:bg-[#2d2418] border-gray-200 dark:border-gray-800 p-4 shadow-sm transition-all hover:border-brand-saffron/50 has-[input:checked]:border-brand-saffron has-[input:checked]:bg-brand-saffron/5">
                            <input
                                checked={paymentMethod === 'COD'}
                                onChange={() => setPaymentMethod('COD')}
                                className="peer h-5 w-5 border-2 border-slate-400 text-brand-saffron focus:ring-brand-saffron dark:bg-transparent" name="payment_method" type="radio" />
                            <div className="flex flex-col flex-1 pl-2">
                                <p className="text-sm font-bold">Cash on Delivery</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Pay cash/UPI when your first meal arrives</p>
                            </div>
                            <span className="material-symbols-outlined text-brand-saffron opacity-0 peer-checked:opacity-100">check_circle</span>
                        </label>
                    </div>
                </section>
            </main>

            <footer className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#221b10]/80 backdrop-blur-lg border-t border-slate-200 dark:border-white/5 p-4 z-20">
                <button
                    onClick={handlePay}
                    disabled={isProcessing}
                    className="group relative w-full overflow-hidden rounded-xl bg-brand-saffron py-4 text-center font-bold text-white shadow-lg shadow-brand-saffron/25 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        {isProcessing ? (
                            <>
                                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                Processing...
                            </>
                        ) : paymentMethod === 'ONLINE' ? (
                            <>
                                Pay Securely
                                <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">arrow_forward</span>
                            </>
                        ) : (
                            <>
                                Pay on Delivery
                                <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">check</span>
                            </>
                        )}
                    </span>
                </button>
            </footer>

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
                    <div className="flex w-full max-w-sm flex-col items-center rounded-2xl bg-white dark:bg-[#2d2418] p-8 text-center shadow-2xl scale-100 transition-transform">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-green/20 text-brand-green">
                            <span className="material-symbols-outlined text-5xl">check_circle</span>
                        </div>
                        <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">Subscription Active!</h2>
                        <p className="mb-8 text-sm text-slate-600 dark:text-slate-300">Your "{uiTitle}" has been successfully activated. Enjoy your meals!</p>
                        <button onClick={onSuccessComplete} className="w-full rounded-xl bg-slate-900 dark:bg-white py-3 font-bold text-white dark:text-black transition-transform active:scale-95">
                            View Your Plan
                        </button>
                    </div>
                </div>
            )}

            {/* OTP Verification Modal */}
            {showOtpModal && (
                <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full sm:max-w-md bg-white dark:bg-neutral-800 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
                        <div className="px-6 py-8 flex flex-col items-center">
                            <div className="w-16 h-16 bg-brand-saffron/10 rounded-full flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-brand-saffron text-3xl">sms</span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">Verify Your Order</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-8 max-w-[260px]">
                                We've sent a 4-digit code to your mobile number to confirm Cash on Delivery.
                            </p>

                            <div className="w-full space-y-6">
                                <div className="space-y-2">
                                    <input
                                        autoFocus
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        className="block w-full h-14 px-4 rounded-xl border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-900 text-slate-900 dark:text-white focus:border-brand-saffron focus:ring-2 focus:ring-brand-saffron text-center text-3xl tracking-[0.5em] shadow-inner font-bold"
                                        type="text"
                                        maxLength={4}
                                        placeholder="••••"
                                    />
                                </div>

                                {otpError && (
                                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm text-center font-medium animate-in fade-in">
                                        {otpError}
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => { setShowOtpModal(false); setOtp(''); setOtpError(''); }}
                                        disabled={otpLoading}
                                        className="flex-1 py-3.5 rounded-xl font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-neutral-700 hover:bg-slate-200 dark:hover:bg-neutral-600 transition-colors disabled:opacity-50">
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleVerifyOtp}
                                        disabled={otpLoading || otp.length < 4}
                                        className="flex-[2] py-3.5 rounded-xl font-bold text-white bg-brand-saffron hover:bg-[#D97706] shadow-lg shadow-brand-saffron/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center">
                                        {otpLoading ? (
                                            <>
                                                <span className="material-symbols-outlined animate-spin mr-2 text-sm">progress_activity</span>
                                                Verifying...
                                            </>
                                        ) : 'Confirm Order'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
