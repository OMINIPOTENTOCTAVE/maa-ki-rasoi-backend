import React from 'react';

export default function ActionButton({ children, onClick, className = '' }) {
    return (
        <button
            onClick={onClick}
            className={`w-full bg-brand-saffron hover:bg-[#D97706] text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-saffron/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${className}`}
        >
            {children}
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
    );
}
