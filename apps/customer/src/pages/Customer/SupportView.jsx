import React from 'react';

export default function SupportView({ onBack }) {
    return (
        <div className="flex flex-col h-full w-full bg-brand-cream dark:bg-brand-dark pb-24">
            <header className="flex items-center justify-between px-4 py-3 sticky top-0 z-10 bg-white/80 dark:bg-[#221b10]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                <button onClick={onBack} className="flex items-center justify-center p-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#2d2418] transition-colors">
                    <span className="material-symbols-outlined text-slate-900 dark:text-slate-100">arrow_back</span>
                </button>
                <h1 className="text-lg font-bold">Help & Support</h1>
                <div className="w-10"></div>
            </header>

            <main className="flex-1 px-4 py-6 flex flex-col gap-6">
                <section>
                    <div className="bg-white dark:bg-[#2d2418] rounded-xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-brand-saffron"></div>
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <span className="bg-brand-saffron/20 text-brand-saffron text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide">In Progress</span>
                                <span className="text-gray-500 dark:text-gray-400 text-xs">Today, 10:45 AM</span>
                            </div>
                            <span className="material-symbols-outlined text-brand-saffron animate-pulse">pending</span>
                        </div>
                        <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-1">Ticket #203: Late Lunch</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Your issue is being reviewed by our support team. Estimated resolution time: 10 mins.</p>
                        <button className="text-sm font-medium text-brand-saffron hover:opacity-80 transition-colors flex items-center gap-1">
                            View Conversation <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                    </div>
                </section>

                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500">search</span>
                    <input className="w-full bg-white dark:bg-[#2d2418] border border-gray-200 dark:border-gray-800 text-slate-900 dark:text-white rounded-lg py-3 pl-12 pr-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-saffron/50 transition-all shadow-sm" placeholder="Search for help..." type="text" />
                </div>

                <section>
                    <h2 className="text-slate-900 dark:text-white font-bold text-xl mb-4">What do you need help with?</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <button className="bg-white dark:bg-[#2d2418] border border-gray-200 dark:border-gray-800 hover:border-brand-saffron/50 p-4 rounded-xl flex flex-col items-start gap-3 transition-all text-left shadow-sm group">
                            <div className="bg-gray-100 dark:bg-[#221b10] p-2 rounded-lg group-hover:bg-brand-saffron/20 transition-colors">
                                <span className="material-symbols-outlined text-brand-saffron">moped</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">Delivery</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Late or missing tiffin</p>
                            </div>
                        </button>
                        <button className="bg-white dark:bg-[#2d2418] border border-gray-200 dark:border-gray-800 hover:border-brand-saffron/50 p-4 rounded-xl flex flex-col items-start gap-3 transition-all text-left shadow-sm group">
                            <div className="bg-gray-100 dark:bg-[#221b10] p-2 rounded-lg group-hover:bg-brand-saffron/20 transition-colors">
                                <span className="material-symbols-outlined text-brand-saffron">restaurant_menu</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">Food Quality</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Taste, hygiene, portion</p>
                            </div>
                        </button>
                    </div>
                </section>

                <section className="mt-2">
                    <button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-lg shadow-green-900/20">
                        <span className="material-symbols-outlined">chat</span>
                        <span>Chat with us on WhatsApp</span>
                    </button>
                    <p className="text-center text-gray-500 text-xs mt-3">Usually replies within 5 minutes</p>
                </section>
            </main>
        </div>
    );
}
