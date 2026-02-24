import React, { useEffect } from 'react';

/**
 * Overlay dialog for desktop screens.
 * On desktop: renders as a centered modal over the current layout.
 * On mobile: renders full-screen (pass-through).
 */
export default function DesktopModal({ children, onClose, title }) {
    // Lock body scroll while open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    // Close on Escape key
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />
            {/* Dialog Container */}
            <div className="relative z-10 w-full max-w-4xl max-h-[90vh] mx-4 bg-brand-cream dark:bg-brand-dark rounded-2xl shadow-2xl overflow-hidden animate-in flex flex-col">
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#1e1710]/80 backdrop-blur-sm shrink-0">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white font-heading">{title}</h2>
                        <button
                            onClick={onClose}
                            className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-slate-600 dark:text-slate-400"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                )}
                {/* Content — scrollable */}
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
