import React from 'react';

export default function SupportView({ onBack }) {
    const isLoggedIn = !!localStorage.getItem('customer_token');

    const handleCategoryClick = (category) => {
        window.open(`https://wa.me/917428020104?text=Hi, I need help with: ${category}`, '_blank');
    };

    return (
        <div className="flex flex-col h-full w-full bg-brand-cream dark:bg-brand-dark pb-24 md:pb-8">
            <header className="flex items-center justify-between px-4 md:px-6 py-3 sticky top-0 z-10 bg-white/80 dark:bg-[#221b10]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                <button onClick={onBack} className="flex items-center justify-center p-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#2d2418] transition-colors md:hidden">
                    <span className="material-symbols-outlined text-slate-900 dark:text-slate-100">arrow_back</span>
                </button>
                <h1 className="text-lg font-bold font-heading">Help & Support</h1>
                <div className="w-10 md:hidden"></div>
            </header>

            <main className="flex-1 px-4 md:px-6 lg:px-8 py-4 flex flex-col gap-4 max-w-3xl mx-auto w-full">
                {/* Only show tickets if logged in */}
                {isLoggedIn && (
                    <section>
                        <div className="bg-white dark:bg-[#2d2418] rounded-xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="absolute top-0 left-0 w-1 h-full bg-brand-saffron"></div>
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="bg-brand-green/20 text-brand-green text-xs font-bold px-2 py-0.5 rounded-md">No Issues</span>
                                </div>
                                <span className="material-symbols-outlined text-brand-green text-lg">check_circle</span>
                            </div>
                            <h3 className="text-slate-900 dark:text-white font-bold mb-0.5">All good! No open tickets.</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">If you face any issue, reach out below.</p>
                        </div>
                    </section>
                )}

                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500">search</span>
                    <input className="w-full bg-white dark:bg-[#2d2418] border border-gray-200 dark:border-gray-800 text-slate-900 dark:text-white rounded-lg py-2.5 pl-12 pr-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-saffron/50 transition-all shadow-sm text-sm" placeholder="Search for help..." type="text" />
                </div>

                <section>
                    <h2 className="text-slate-900 dark:text-white font-bold text-lg mb-3">What do you need help with?</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { icon: 'moped', label: 'Delivery', desc: 'Late or missing tiffin' },
                            { icon: 'restaurant_menu', label: 'Food Quality', desc: 'Taste, hygiene, portion' },
                            { icon: 'payments', label: 'Billing', desc: 'Payment & refunds' },
                            { icon: 'settings', label: 'Account', desc: 'Settings & preferences' },
                        ].map((cat) => (
                            <button
                                key={cat.label}
                                onClick={() => handleCategoryClick(cat.label)}
                                className="bg-white dark:bg-[#2d2418] border border-gray-200 dark:border-gray-800 hover:border-brand-saffron/50 p-4 rounded-xl flex flex-col items-start gap-2 transition-all text-left shadow-sm group hover:shadow-md"
                            >
                                <div className="bg-gray-100 dark:bg-[#221b10] p-2 rounded-lg group-hover:bg-brand-saffron/20 transition-colors">
                                    <span className="material-symbols-outlined text-brand-saffron">{cat.icon}</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{cat.label}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{cat.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </section>

                <section>
                    <button
                        onClick={() => window.open('https://wa.me/917428020104?text=Hi, I need help with my Maa Ki Rasoi order', '_blank')}
                        className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-md active:scale-95"
                    >
                        <span className="material-symbols-outlined">chat</span>
                        <span>Chat with us on WhatsApp</span>
                    </button>
                    <p className="text-center text-gray-500 text-xs mt-2">Usually replies within 5 minutes</p>
                </section>
            </main>
        </div>
    );
}
