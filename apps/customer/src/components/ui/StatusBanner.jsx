import React from 'react';

export default function StatusBanner({ message, type = 'info', icon }) {
    const isSuccess = type === 'success';

    return (
        <div className={`flex items-center gap-2 mb-3 px-3 py-2 rounded-lg text-sm font-bold ${isSuccess
                ? 'bg-brand-green/10 text-brand-green border border-brand-green/20'
                : 'bg-brand-saffron/10 text-brand-saffron border border-brand-saffron/20'
            }`}>
            {icon && <span className="material-symbols-outlined text-[18px]">{icon}</span>}
            <span>{message}</span>
        </div>
    );
}
