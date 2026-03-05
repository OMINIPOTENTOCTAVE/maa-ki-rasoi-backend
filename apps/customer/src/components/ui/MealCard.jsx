import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function MealCard({ title, subtitle, image, tags = [], onAction }) {
    return (
        <div className="group relative overflow-hidden rounded-[2rem] shadow-sm border border-border">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-opacity group-hover:from-black/90"></div>

            <img
                alt={title}
                className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-700"
                src={image}
            />

            <div className="absolute top-4 left-4 z-20 flex gap-2">
                {tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-white/20">
                        {tag}
                    </span>
                ))}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <div className="flex items-end justify-between">
                    <div>
                        <h3 className="text-2xl font-heading font-bold text-white mb-1.5">{title}</h3>
                        <p className="text-white/80 text-sm font-medium line-clamp-1">{subtitle}</p>
                    </div>
                    {onAction && (
                        <button
                            onClick={onAction}
                            className="bg-white text-foreground h-12 w-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
                        >
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
