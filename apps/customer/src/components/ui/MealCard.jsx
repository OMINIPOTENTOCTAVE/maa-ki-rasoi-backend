import React from 'react';

export default function MealCard({ title, subtitle, image, tags = [], onAction }) {
    return (
        <div className="group relative overflow-hidden rounded-tiffin shadow-lg border border-gray-100 dark:border-gray-800">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>

            <img
                alt={title}
                className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"
                src={image}
            />

            <div className="absolute top-4 left-4 z-20 flex gap-2">
                {tags.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider border border-white/10">
                        {tag}
                    </span>
                ))}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                <div className="flex items-end justify-between">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-1">{title}</h3>
                        <p className="text-gray-200 text-sm font-medium line-clamp-1">{subtitle}</p>
                    </div>
                    {onAction && (
                        <button
                            onClick={onAction}
                            className="bg-white text-slate-900 h-10 w-10 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                        >
                            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
