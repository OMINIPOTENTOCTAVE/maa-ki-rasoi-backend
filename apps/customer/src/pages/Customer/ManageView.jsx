import React from 'react';

export default function ManageView({ onBack }) {
    return (
        <div className="flex flex-col h-full w-full bg-brand-cream dark:bg-brand-dark pb-24 overflow-y-auto no-scrollbar">
            <div className="sticky top-0 z-50 flex items-center bg-white/90 dark:bg-[#2d2418]/90 p-4 pb-2 justify-between border-b border-gray-100 dark:border-gray-800 backdrop-blur-md">
                <button onClick={onBack} className="text-slate-900 dark:text-white flex size-12 shrink-0 items-center justify-center cursor-pointer hover:opacity-70 transition-opacity">
                    <span className="material-symbols-outlined text-2xl">arrow_back</span>
                </button>
                <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Manage Active Plan</h2>
            </div>

            <div className="flex-1 overflow-y-auto pb-24">
                <div className="p-4">
                    <div className="flex flex-col gap-4 rounded-xl bg-white dark:bg-[#2d2418] p-5 shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex flex-col gap-1 flex-[2_2_0px]">
                                <p className="text-brand-saffron text-xs font-bold uppercase tracking-wider mb-1">Current Plan</p>
                                <h3 className="text-slate-900 dark:text-white text-xl font-bold leading-tight">Standard Veg Thali</h3>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <span className="material-symbols-outlined text-gray-400 text-sm">calendar_today</span>
                                    <p className="text-gray-500 text-sm font-medium leading-normal">Valid until Oct 24th</p>
                                </div>
                            </div>
                            <div className="w-20 h-20 bg-center bg-no-repeat bg-cover rounded-xl shadow-inner border border-gray-100 dark:border-gray-700 flex-shrink-0" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCGlGRd_WWFCu3VWXCsXfRnxjz1ikZkqley-3kWWgnza1UHD99gP7gvK_fT0Pi_I-DOR85tMwkRnUVV8Xvpemk_ppJfNbyc_Inwho59JyJ1HNuqZkpineJmTmaVbvmStAO7UGXlW0EwbvAxMDrzq7-eHExHninE0ck8wqXdKgVlndnOkbdrN8U7CZuZZExE6_5586t4Gcf4VCmXPtUknGjfORbbvt79ZOxYNUorqRhXH0NfVkesYsl8FsUWtp0dLXHrWD0DH0ObITsr')" }}></div>
                        </div>
                        <div className="flex flex-col gap-3 mt-2">
                            <div className="flex gap-6 justify-between items-end">
                                <p className="text-slate-900 dark:text-white text-2xl font-bold leading-none">14 <span className="text-base font-medium text-gray-500">meals left</span></p>
                                <p className="text-gray-500 text-sm font-normal leading-normal">Total 22 meals</p>
                            </div>
                            <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-3 overflow-hidden">
                                <div className="h-full rounded-full bg-brand-saffron w-[63%]"></div>
                            </div>
                            <p className="text-gray-500 text-xs font-normal leading-normal text-right">8 meals consumed</p>
                        </div>
                    </div>
                </div>

                <div className="px-4">
                    <div className="flex items-center justify-between mb-3 mt-2">
                        <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">Pause & Play</h3>
                        <span className="text-xs text-brand-saffron font-medium bg-brand-saffron/10 px-2 py-1 rounded-full">Tap to skip</span>
                    </div>
                    <div className="rounded-xl bg-white dark:bg-[#2d2418] p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center p-1 justify-between mb-4">
                            <button className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-1 transition-colors">
                                <span className="material-symbols-outlined text-slate-900 dark:text-white text-xl">chevron_left</span>
                            </button>
                            <p className="text-slate-900 dark:text-white text-base font-bold leading-tight flex-1 text-center">October 2023</p>
                            <button className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-1 transition-colors">
                                <span className="material-symbols-outlined text-slate-900 dark:text-white text-xl">chevron_right</span>
                            </button>
                        </div>
                        <div className="grid grid-cols-7 gap-y-2">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                <p key={i} className="text-gray-400 text-[11px] font-bold uppercase tracking-wider flex items-center justify-center pb-2">{day}</p>
                            ))}
                            <div className="col-span-3"></div>
                            {[1, 2, 3, 4].map(day => (
                                <button key={day} className="aspect-square w-full flex items-center justify-center">
                                    <div className="size-9 flex items-center justify-center rounded-full text-gray-400 text-sm">{day}</div>
                                </button>
                            ))}
                            <button className="aspect-square w-full flex items-center justify-center group relative">
                                <div className="size-9 flex items-center justify-center rounded-full bg-brand-saffron text-white font-bold text-sm shadow-md shadow-brand-saffron/20 group-active:scale-95 transition-transform">5</div>
                            </button>
                            <button className="aspect-square w-full flex items-center justify-center group relative cursor-pointer" onClick={() => alert('Skipped day toggled!')}>
                                <div className="size-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 line-through text-sm hover:line-through decoration-brand-saffron decoration-2">6</div>
                            </button>
                            {[7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(day => (
                                <button key={day} className="aspect-square w-full flex items-center justify-center group">
                                    <div className="size-9 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800 text-slate-900 dark:text-white text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">{day}</div>
                                </button>
                            ))}
                        </div>
                        <div className="mt-4 flex items-center gap-2 bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                            <span className="material-symbols-outlined text-blue-500 text-sm">info</span>
                            <p className="text-blue-600 dark:text-blue-200 text-xs">Pause before 9 PM for tomorrow's lunch.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 w-full bg-white/80 dark:bg-[#181511]/80 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 p-4 pb-8 z-50 max-w-md">
                <button onClick={() => alert("Changes saved successfully!")} className="w-full bg-brand-saffron hover:bg-[#D97706] text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-brand-saffron/20 transition-all active:scale-[0.98]">
                    Save Changes
                </button>
            </div>
        </div>
    );
}
