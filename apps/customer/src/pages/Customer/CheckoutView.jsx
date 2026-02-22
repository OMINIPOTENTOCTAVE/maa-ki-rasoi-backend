import React, { useState } from 'react';

export default function CheckoutView({ onBack, onSuccessComplete }) {
    const [showSuccess, setShowSuccess] = useState(false);
    const [enableAutoPay, setEnableAutoPay] = useState(false);

    const handlePay = () => {
        setShowSuccess(true);
        setTimeout(() => {
            onSuccessComplete();
        }, 2000);
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
                                <h2 className="text-base font-bold leading-tight">Monthly Veg Combo</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Lunch Only • 30 Days</p>
                                <p className="text-xs text-brand-saffron font-medium mt-1">Starts Tomorrow, 12:30 PM</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="flex flex-col gap-3 px-2">
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                        <span>Item Total</span><span>₹2500.00</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                        <span>GST (5%)</span><span>₹125.00</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                        <span>Delivery Charges</span><span className="text-brand-green font-medium">Free</span>
                    </div>
                    <div className="my-1 h-px w-full bg-slate-200 dark:bg-white/10"></div>
                    <div className="flex justify-between items-end">
                        <span className="text-base font-bold">Total Payable</span>
                        <span className="text-xl font-extrabold tracking-tight text-brand-saffron">₹2625</span>
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
                        <label className="group relative flex cursor-pointer items-center gap-4 rounded-xl border bg-white dark:bg-[#2d2418] border-gray-200 dark:border-gray-800 p-4 shadow-sm transition-all hover:border-brand-saffron/50 has-[:checked]:border-brand-saffron has-[:checked]:bg-brand-saffron/5">
                            <input defaultChecked className="peer h-5 w-5 border-2 border-slate-400 text-brand-saffron focus:ring-brand-saffron dark:bg-transparent" name="payment_method" type="radio" />
                            <div className="flex flex-col flex-1 pl-2">
                                <p className="text-sm font-bold">UPI</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">GooglePay, PhonePe, Paytm</p>
                            </div>
                            <span className="material-symbols-outlined text-brand-saffron opacity-0 peer-checked:opacity-100">check_circle</span>
                        </label>
                        <label className="group relative flex cursor-pointer items-center gap-4 rounded-xl border bg-white dark:bg-[#2d2418] border-gray-200 dark:border-gray-800 p-4 shadow-sm transition-all hover:border-brand-saffron/50 has-[:checked]:border-brand-saffron has-[:checked]:bg-brand-saffron/5">
                            <input className="peer h-5 w-5 border-2 border-slate-400 text-brand-saffron focus:ring-brand-saffron dark:bg-transparent" name="payment_method" type="radio" />
                            <div className="flex flex-col flex-1 pl-2">
                                <p className="text-sm font-bold">Credit / Debit Card</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Visa, MasterCard, Rupay</p>
                            </div>
                            <span className="material-symbols-outlined text-brand-saffron opacity-0 peer-checked:opacity-100">check_circle</span>
                        </label>
                    </div>
                </section>
            </main>

            <footer className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#221b10]/80 backdrop-blur-lg border-t border-slate-200 dark:border-white/5 p-4 z-20">
                <button onClick={handlePay} className="group relative w-full overflow-hidden rounded-xl bg-brand-saffron py-4 text-center font-bold text-white shadow-lg shadow-brand-saffron/25 transition-all active:scale-[0.98]">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        Pay ₹2625
                        <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">arrow_forward</span>
                    </span>
                </button>
            </footer>

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
                    <div className="flex w-full max-w-sm flex-col items-center rounded-2xl bg-white dark:bg-[#2d2418] p-8 text-center shadow-2xl scale-100 transition-transform">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-green/20 text-brand-green">
                            <span className="material-symbols-outlined text-5xl">check_circle</span>
                        </div>
                        <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">Subscription Active!</h2>
                        <p className="mb-8 text-sm text-slate-600 dark:text-slate-300">Your "Monthly Veg Combo" has been successfully activated. Enjoy your meals!</p>
                        <button onClick={onSuccessComplete} className="w-full rounded-xl bg-slate-900 dark:bg-white py-3 font-bold text-white dark:text-black transition-transform active:scale-95">
                            View Your Plan
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
