import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const existingScript = document.getElementById('razorpay-checkout-js');
        if (existingScript) return resolve(true);

        const script = document.createElement('script');
        script.id = 'razorpay-checkout-js';
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export default function Checkout({ cart, updateQty, clearCart }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
    const [isProcessing, setIsProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('ONLINE');

    // OTP States for COD
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpError, setOtpError] = useState('');

    useEffect(() => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('customer_data') || '{}');
            setFormData(prev => ({
                ...prev,
                name: storedUser.name || '',
                phone: storedUser.phone || '',
                address: storedUser.address || ''
            }));
        } catch (e) {
            console.error(e);
        }
    }, []);

    const cartTotalAmount = cart.reduce((acc, c) => acc + (c.price * c.qty), 0);

    const handleVerifyOtp = async () => {
        if (otp.length < 4) return;
        setOtpError('');
        setOtpLoading(true);
        const payload = {
            customerName: formData.name,
            customerPhone: formData.phone,
            address: formData.address,
            items: cart.map(c => ({ menuItemId: c.id, quantity: c.qty })),
            paymentMethod: 'COD'
        };

        try {
            const verifyRes = await axios.post('/auth/otp/verify', { phone: formData.phone, otp });
            if (verifyRes.data.success) {
                setShowOtpModal(false);
                await axios.post('/orders', payload);
                setSuccess(true);
                clearCart();
            }
        } catch (err) {
            setOtpError(err.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setOtpLoading(false);
            setOtp('');
        }
    };

    const handlePlaceOrder = useCallback(async () => {
        if (isProcessing) return;
        setIsProcessing(true);
        setErrorMsg('');

        if (!formData.address) {
            setErrorMsg("Please enter your delivery address");
            setIsProcessing(false);
            return;
        }

        const payload = {
            customerName: formData.name,
            customerPhone: formData.phone,
            address: formData.address,
            items: cart.map(c => ({ menuItemId: c.id, quantity: c.qty })),
            paymentMethod: paymentMethod
        };

        if (paymentMethod === 'COD') {
            try {
                await axios.post('/auth/otp/request', { phone: formData.phone });
                setShowOtpModal(true);
            } catch (err) {
                setErrorMsg("Failed to send OTP. Please try again.");
            } finally {
                setIsProcessing(false);
            }
            return;
        }

        try {
            const ordRes = await axios.post('/orders', payload);
            const orderId = ordRes.data.data.id;

            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                setErrorMsg("Failed to load Razorpay SDK.");
                setIsProcessing(false);
                return;
            }

            const rzpOrderRes = await axios.post('/payments/create-order', {
                amount: cartTotalAmount,
                orderType: 'Instant',
                referenceId: orderId
            });

            const { id: razorpayOrderId, isMock } = rzpOrderRes.data.order;

            if (isMock) {
                const verifyRes = await axios.post('/payments/verify', {
                    razorpay_order_id: razorpayOrderId,
                    razorpay_payment_id: "pay_mock_" + Date.now(),
                    razorpay_signature: "mock_signature",
                    orderType: 'Instant',
                    referenceId: orderId
                });

                if (verifyRes.data.success) {
                    setSuccess(true);
                    clearCart();
                }
                setIsProcessing(false);
                return;
            }

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_dummykey',
                amount: cartTotalAmount * 100,
                currency: "INR",
                name: "Maa Ki Rasoi",
                description: "Instant Order Checkout",
                order_id: razorpayOrderId,
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post('/payments/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderType: 'Instant',
                            referenceId: orderId
                        });

                        if (verifyRes.data.success) {
                            setSuccess(true);
                            clearCart();
                        }
                    } catch (err) {
                        setErrorMsg("Payment verification failed.");
                    }
                },
                prefill: {
                    name: formData.name,
                    contact: formData.phone,
                },
                theme: { color: "#C8550A" }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                setErrorMsg("Payment Failed: " + response.error.description);
            });
            rzp1.open();
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Error placing order.');
        } finally {
            setIsProcessing(false);
        }
    }, [cart, formData, paymentMethod, cartTotalAmount, clearCart, isProcessing]);

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
                <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-5xl">check_circle</span>
                </div>
                <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
                <p className="text-text-muted mb-8 max-w-sm">
                    Your delicious home-style meal is being prepared. <br />
                    You can track it in your order history.
                </p>
                <button
                    onClick={() => navigate('/orders')}
                    className="btn px-12"
                >
                    View Orders
                </button>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                <div className="w-20 h-20 bg-brand-beige text-brand-orange rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-4xl">shopping_bag</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Your cart is empty</h3>
                <p className="text-text-muted mb-8">Add some delicious meals to your plate first.</p>
                <button
                    className="btn btn-secondary px-8"
                    onClick={() => navigate('/menu')}
                >
                    Browse Menu
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto animate-fade-in pb-32 md:pb-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Checkout</h1>
                <p className="text-text-muted">Review your order and deliver details.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                    {/* Delivery Form */}
                    <div className="card">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-brand-orange">
                            <span className="material-symbols-outlined">local_shipping</span>
                            Delivery Details
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-text-main mb-2">Delivery Address</label>
                                <textarea
                                    className="input-field"
                                    placeholder="House No, Building, Street, Landmark"
                                    required
                                    rows="4"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Selection */}
                    <div className="card">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-brand-orange">
                            <span className="material-symbols-outlined">payments</span>
                            Payment Method
                        </h3>
                        <div className="space-y-4">
                            <label className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${paymentMethod === 'ONLINE' ? 'border-brand-orange bg-brand-orange/5' : 'border-brand-beige shadow-sm'}`}>
                                <input type="radio" checked={paymentMethod === 'ONLINE'} onChange={() => setPaymentMethod('ONLINE')} className="accent-brand-orange size-5" />
                                <div className="flex-1">
                                    <p className="font-bold">Pay Online</p>
                                    <p className="text-xs text-text-muted">UPI, Cards, and Netbanking enabled</p>
                                </div>
                            </label>
                            <label className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${paymentMethod === 'COD' ? 'border-brand-orange bg-brand-orange/5' : 'border-brand-beige shadow-sm'}`}>
                                <input type="radio" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="accent-brand-orange size-5" />
                                <div className="flex-1">
                                    <p className="font-bold">Cash on Delivery</p>
                                    <p className="text-xs text-text-muted">Pay at your doorstep</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:sticky lg:top-8">
                    <div className="card !bg-brand-brown text-white shadow-premium">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-brand-orange-light">
                            <span className="material-symbols-outlined">receipt_long</span>
                            Order Summary
                        </h3>
                        <div className="space-y-4 mb-6">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                    <div className="flex-1">
                                        <p className="font-bold text-brand-beige">{item.name}</p>
                                        <p className="text-[10px] text-brand-beige/50">Qty: {item.qty} × ₹{item.price}</p>
                                    </div>
                                    <span className="font-bold ml-4">₹{item.price * item.qty}</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-white/10 space-y-2">
                            <div className="flex justify-between text-sm text-brand-beige/70">
                                <span>Delivery Fee</span>
                                <span className="text-success font-bold">FREE</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold pt-2">
                                <span>Total</span>
                                <span className="text-brand-orange-light">₹{cartTotalAmount}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={isProcessing}
                            className="btn btn-block mt-8 py-4 text-lg"
                        >
                            {isProcessing ? 'Processing...' : 'Place Order'}
                        </button>
                    </div>

                    {errorMsg && (
                        <div className="mt-4 p-4 bg-error/10 text-error rounded-xl text-sm font-bold text-center border border-error/20">
                            {errorMsg}
                        </div>
                    )}
                </div>
            </div>

            {/* OTP Modal for COD */}
            {showOtpModal && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-brand-brown/80 backdrop-blur-md animate-fade-in">
                    <div className="card w-full max-w-sm !p-8 text-center space-y-6">
                        <h3 className="text-2xl font-bold">Verify Phone</h3>
                        <p className="text-text-muted">Enter the 4-digit OTP sent to your phone to confirm COD.</p>

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
                                {otpLoading ? 'Verifying...' : 'Confirm Order'}
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
