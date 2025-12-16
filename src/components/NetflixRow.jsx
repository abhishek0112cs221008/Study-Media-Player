import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, PlayCircle, Plus, ThumbsUp, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Row = ({ title, items, onPlay }) => {
    const rowRef = useRef(null);
    const [isMoved, setIsMoved] = useState(false);

    const handleClick = (direction) => {
        setIsMoved(true);
        if (rowRef.current) {
            const { scrollLeft, clientWidth } = rowRef.current;
            const scrollTo = direction === 'left'
                ? scrollLeft - clientWidth + 200
                : scrollLeft + clientWidth - 200;

            rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });

            if (direction === 'left' && scrollTo <= 0) setIsMoved(false);
        }
    };

    // Darker, richer gradients for a more premium feel
    const gradients = [
        'from-purple-900 to-indigo-900',
        'from-blue-900 to-cyan-900',
        'from-emerald-900 to-teal-900',
        'from-red-900 to-orange-900',
        'from-slate-800 to-gray-900'
    ];

    return (
        <div className="h-auto mb-12 space-y-4 px-4 md:px-12 group/row relative z-20 animate-fade-in-up">
            <h2 className="text-lg md:text-xl font-bold text-[#e5e5e5] hover:text-white cursor-pointer transition-colors duration-200 flex items-center gap-2">
                {title}
                <ChevronRight size={16} className="text-[#54b9c5] opacity-0 group-hover/row:opacity-100 transition-opacity font-bold" strokeWidth={4} />
            </h2>

            <div className="group relative">
                <ChevronLeft
                    className={`absolute top-0 bottom-0 left-2 z-40 m-auto h-full w-10 cursor-pointer opacity-0 transition-all duration-300 hover:bg-black/40 hover:scale-110 group-hover:opacity-100 rounded-full p-2 bg-black/20 backdrop-blur-sm ${!isMoved && "hidden"}`}
                    onClick={() => handleClick('left')}
                    color='white'
                />

                <div
                    ref={rowRef}
                    className="flex items-center space-x-4 overflow-x-scroll scrollbar-hide py-4 pl-1"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {items.map((item, idx) => (
                        <div
                            key={idx}
                            className="relative min-w-[200px] md:min-w-[280px] cursor-pointer transition-all duration-300 ease-out md:hover:scale-105 group/card"
                            onClick={() => onPlay(item)}
                        >
                            {/* Card Image / Placeholder */}
                            <div className={`h-32 md:h-44 rounded-md bg-gradient-to-br ${gradients[idx % gradients.length]} p-[1px] shadow-lg group-hover/card:shadow-red-900/20`}>
                                <div className="h-full w-full bg-[#181818] rounded-[3px] relative overflow-hidden">
                                    {/* Faux thumbnail content */}
                                    <div className={`absolute inset-0 opacity-30 bg-gradient-to-br ${gradients[idx % gradients.length]} mix-blend-overlay`}></div>
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>

                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-3 group-hover/card:bg-[#E50914] transition-colors duration-300">
                                            <PlayCircle size={20} className="text-white fill-white/20" />
                                        </div>
                                        <span className="text-gray-200 font-bold text-sm md:text-base leading-tight drop-shadow-md line-clamp-2">
                                            {item.name}
                                        </span>
                                    </div>

                                    {/* Type Badge */}
                                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/70 rounded text-[10px] text-gray-300 font-bold uppercase tracking-wider backdrop-blur-md border border-white/10 shadow-lg">
                                        {item.type}
                                    </div>

                                    {/* Progress Status */}
                                    {item.progress > 0 && (
                                        <div className="absolute bottom-0 left-0 right-0">
                                            {item.progress >= 90 ? (
                                                <div className="w-full h-1 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                            ) : (
                                                <div className="h-1 bg-gray-700 w-full">
                                                    <div className="h-full bg-[#E50914] shadow-[0_0_10px_rgba(229,9,20,0.5)]" style={{ width: `${item.progress}%` }}></div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <ChevronRight
                    className="absolute top-0 bottom-0 right-2 z-40 m-auto h-full w-10 cursor-pointer opacity-0 transition-all duration-300 hover:bg-black/40 hover:scale-110 group-hover:opacity-100 rounded-full p-2 bg-black/20 backdrop-blur-sm"
                    onClick={() => handleClick('right')}
                    color='white'
                />
            </div>
        </div>
    );
};

export default Row;
