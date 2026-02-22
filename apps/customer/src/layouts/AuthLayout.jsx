import React from 'react';

export default function AuthLayout({ children }) {
    return (
        <div className="relative min-h-screen w-full flex flex-col justify-end bg-black max-w-md mx-auto overflow-hidden">
            {/* Background Image full screen */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0 scale-105"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1626779815774-7d2d3e5e406f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')" }}
            ></div>

            {/* Gradient Overlay to fade into backdrop filter */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>

            {/* The actual blurred container for the form */}
            <div className="relative z-20 w-full bg-white/10 backdrop-blur-xl border-t border-white/20 p-6 pt-8 pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] rounded-t-[2.5rem] text-white">
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/30 rounded-full"></div>
                {children}
            </div>
        </div>
    );
}
