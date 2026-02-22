import React from 'react';

export default function MenuView({ onBack }) {
    return (
        <div className="flex flex-col h-full w-full bg-brand-cream dark:bg-brand-dark pb-24">
            <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#2d2418]/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-200">
                <div className="flex items-center justify-between px-4 py-3">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-slate-800 dark:text-slate-200">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">This Week's Menu</h1>
                    <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-slate-800 dark:text-slate-200">
                        <span className="material-symbols-outlined">shopping_bag</span>
                        <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-brand-saffron rounded-full border-2 border-white dark:border-[#2d2418]"></span>
                    </button>
                </div>
                <div className="px-4 pb-0 pt-2">
                    <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-3 snap-x">
                        <button className="snap-start flex flex-col items-center justify-center min-w-[4.5rem] py-3 rounded-2xl bg-brand-saffron text-white shadow-lg shadow-brand-saffron/30 transition-transform active:scale-95">
                            <span className="text-xs font-medium opacity-90 uppercase tracking-wide">Mon</span>
                            <span className="text-xl font-bold">12</span>
                        </button>
                        {[13, 14, 15, 16, 17].map((date, idx) => (
                            <button key={idx} className="snap-start flex flex-col items-center justify-center min-w-[4.5rem] py-3 rounded-2xl bg-white dark:bg-[#2d2418] border border-gray-200 dark:border-gray-700 text-slate-500 dark:text-slate-400 hover:border-brand-saffron/50 transition-colors active:scale-95">
                                <span className="text-xs font-medium uppercase tracking-wide">{['Tue', 'Wed', 'Thu', 'Fri', 'Sat'][idx]}</span>
                                <span className="text-xl font-bold text-slate-800 dark:text-slate-200">{date}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <main className="flex flex-col gap-8 p-4 mt-2">
                <section>
                    <div className="flex items-center justify-between mb-4 px-1">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-brand-saffron/10 rounded-full text-brand-saffron">
                                <span className="material-symbols-outlined text-xl">wb_sunny</span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Lunch</h2>
                        </div>
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-[#2d2418] px-3 py-1 rounded-full border border-gray-100 dark:border-gray-800">12:00 PM - 2:00 PM</span>
                    </div>
                    <div className="group bg-white dark:bg-[#2d2418] rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-lg">
                        <div className="relative h-56 w-full overflow-hidden">
                            <img alt="North Indian Thali" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbs7wxJx6tMmiBjkNbmibZwe63Z2VTXXt21wxOH799_okth8F-oXhNYAuUkiCTdso3qFpCPRVc7p9u4w3NjppcGsGtWE5E459ihNX_WbNX7vFk7A-mE_zv6U690O1t2CGs7lKdBZEc0vYX6_oHs5vgcqtKfr4rowD1O7KDhAH1c57513_LtLjIUC6R_etAeyLykjNwtQAoi0meTPp-CwgusUF-z2tx5zGKzZ7s_Q7LXtxk9AW44EveE4vg8zrNr_slX169-_BxpvaH" />
                            <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                <span className="material-symbols-outlined text-yellow-500 text-sm">star</span>
                                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">4.8</span>
                            </div>
                            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-3 left-3 flex gap-2">
                                <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Veg</span>
                                <span className="bg-brand-saffron text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Best Seller</span>
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-tight mb-3">North Indian Special Thali</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                                A wholesome meal featuring creamy Paneer Butter Masala, aromatic Dal Tadka, 3 soft Tawa Rotis, Jeera Rice, and a fresh Green Salad.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-lg text-xs font-semibold border border-orange-100 dark:border-orange-900/30">
                                    <span className="material-symbols-outlined text-base">local_fire_department</span>
                                    650 kcal
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-semibold border border-blue-100 dark:border-blue-900/30">
                                    <span className="material-symbols-outlined text-base">fitness_center</span>
                                    20g Protein
                                </div>
                            </div>
                            <button onClick={() => alert('Customizing')} className="w-full mt-2 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-lg">edit</span>
                                Customize Lunch
                            </button>
                        </div>
                    </div>
                </section>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>

                <section>
                    <div className="flex items-center justify-between mb-4 px-1">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400">
                                <span className="material-symbols-outlined text-xl">nights_stay</span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Dinner</h2>
                        </div>
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-[#2d2418] px-3 py-1 rounded-full border border-gray-100 dark:border-gray-800">7:30 PM - 9:30 PM</span>
                    </div>
                    <div className="group bg-white dark:bg-[#2d2418] rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-lg">
                        <div className="relative h-56 w-full overflow-hidden">
                            <img alt="Khichdi" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCp_QQhBH1n9SoBGArJMfyK54smEIRse8yOX3dAPPs_53xY1Dfb6YRBdhTcH5mJPu-OtkcqfJ1z_Y2sglU2UGyopHpeVQTso0IwyHCWqm6zgmS3hoL8Zj_kFNlUHey9gzQiXdJK0pmDkafZNfS1AgwLekuq8Tkvops-5KfOWd8WyxfwOsNNBNp00pJuC8unWKrP7snLQifSMYc8tBOhuX60P00YhjyOZ54sYA9YaK8lS0QoZIxcsyUfGWFscr00ddo2ry7CVNEW-T-U" />
                            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-3 left-3 flex gap-2">
                                <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Veg</span>
                                <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Light Meal</span>
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 leading-tight">Comfort Khichdi Combo</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                                Light and healthy Masala Khichdi served with Gujarati Kadhi, Roasted Papad, and Aloo Fry.
                            </p>
                            <button onClick={() => alert('Customizing')} className="w-full mt-2 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-lg">edit</span>
                                Customize Dinner
                            </button>
                        </div>
                    </div>
                </section>
                <div className="h-8"></div>
            </main>
        </div>
    );
}
