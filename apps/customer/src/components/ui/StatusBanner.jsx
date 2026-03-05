import React from 'react';

export default function StatusBanner({ message, type = 'info', icon }) {
    const isSuccess = type === 'success';

    return (
        <div className={`flex items-center gap-3 mb-4 px-4 py-3 rounded-2xl text-sm font-bold shadow-sm ${isSuccess
                ? 'bg-success/10 text-success border border-success/20'
                : 'bg-primary/10 text-primary border border-primary/20'
            }`}>
            {icon && (
                typeof icon === 'string' ? (
                    <span className="material-symbols-outlined text-[20px]">{icon}</span>
                ) : (
                    icon
                )
            )}
            <span>{message}</span>
        </div>
    );
}
