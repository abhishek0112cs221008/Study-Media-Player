import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, PlayCircle, Plus, ThumbsUp, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressRing from './ProgressRing';
import Tooltip from './Tooltip';

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

    // Deep, rich gradients for a premium dark aesthetics
    const gradients = [
        'from-[#1a1a2e] to-[#16213e]',
        'from-[#0f172a] to-[#1e293b]',
        'from-[#111827] to-[#1f2937]',
        'from-[#171717] to-[#262626]',
        'from-[#0c0a09] to-[#1c1917]'
    ];

    return (
        <div className="h-auto mb-16 space-y-6 px-8 md:px-12 group/row relative z-20 animate-fade-in-up">
            <h2 className="text-xl md:text-2xl font-bold text-[#e5e5e5] hover:text-white cursor-pointer transition-colors duration-200 flex items-center gap-3">
                {title}
                <ChevronRight size={20} className="text-[#E50914] opacity-0 group-hover/row:opacity-100 transition-opacity -translate-x-4 group-hover/row:translate-x-0 duration-300" strokeWidth={3} />
            </h2>

            <div className="group relative">
                <ChevronLeft
                    className={`absolute top-0 bottom-0 left-2 z-40 m-auto h-full w-12 cursor-pointer opacity-0 transition-all duration-300 hover:bg-black/60 hover:scale-105 group-hover:opacity-100 rounded-r-md bg-black/30 backdrop-blur-sm ${!isMoved && "hidden"}`}
                    onClick={() => handleClick('left')}
                    color='white'
                    size={40}
                />

                <div
                    ref={rowRef}
                    className="flex items-center space-x-6 overflow-x-scroll scrollbar-hide py-8 pl-1 perspective-1000"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {items.map((item, idx) => (
                        <div
                            key={idx}
                            className="relative min-w-[240px] md:min-w-[300px] cursor-pointer group/card z-10 hover:z-50"
                            onClick={() => onPlay(item)}
                            style={{
                                transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.3s ease'
                            }}
                        >
                            {/* Card Image / Placeholder */}
                            <div
                                className={`h-36 md:h-48 rounded-lg bg-gradient-to-br ${gradients[idx % gradients.length]} p-[1px] shadow-premium group-hover/card:shadow-premium-lg transition-all duration-300`}
                                style={{
                                    transform: 'translateY(0)',
                                    transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                }}
                            >
                                <div className="h-full w-full bg-[#181818] rounded-[7px] relative overflow-hidden group-hover/card:bg-[#222] transition-colors border border-white/5 group-hover/card:border-white/10">
                                    {/* Shimmer overlay on hover */}
                                    <div className="absolute inset-0 shimmer opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>

                                    {/* Faux thumbnail content */}
                                    <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${gradients[idx % gradients.length]} mix-blend-overlay`}></div>
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>

                                    {/* Play Button Overlay on Hover */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all duration-300 bg-black/50 backdrop-blur-[3px]">
                                        <div
                                            className="bg-white rounded-full p-4 shadow-2xl transform scale-0 group-hover/card:scale-100 transition-all duration-300 delay-75 hover:scale-110"
                                            style={{
                                                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 0 4px rgba(255, 255, 255, 0.1)'
                                            }}
                                        >
                                            <PlayCircle fill="black" className="text-white w-8 h-8" />
                                        </div>
                                    </div>

                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center group-hover/card:opacity-0 transition-opacity duration-200">
                                        {item.progress > 0 && item.progress < 90 ? (
                                            <Tooltip content={`${Math.round(item.progress)}% Complete`} position="top">
                                                <ProgressRing progress={item.progress} size={56} strokeWidth={4} />
                                            </Tooltip>
                                        ) : (
                                            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-3 border border-white/10 group-hover/card:scale-110 transition-transform">
                                                <PlayCircle size={26} className="text-gray-400" />
                                            </div>
                                        )}
                                        <span className="text-gray-200 font-bold text-sm md:text-base leading-tight drop-shadow-md line-clamp-2 mt-2">
                                            {item.name}
                                        </span>
                                    </div>

                                    {/* Type Badge */}
                                    <Tooltip content={item.type.toUpperCase()} position="left">
                                        <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/90 rounded-md text-[10px] text-gray-300 font-bold uppercase tracking-wider backdrop-blur-md border border-white/20 shadow-lg cursor-help">
                                            {item.type}
                                        </div>
                                    </Tooltip>

                                    {/* Progress Status */}
                                    {item.progress > 0 && (
                                        <div className="absolute bottom-0 left-0 right-0">
                                            {item.progress >= 90 ? (
                                                <div className="w-full h-1.5 bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)] relative overflow-hidden">
                                                    <div className="absolute inset-0 shimmer"></div>
                                                </div>
                                            ) : (
                                                <div className="h-1.5 bg-gray-800/80 w-full relative overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-[#E50914] to-[#ff1a24] shadow-[0_0_12px_rgba(229,9,20,0.6)] relative"
                                                        style={{ width: `${item.progress}%` }}
                                                    >
                                                        <div className="absolute inset-0 shimmer"></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Hover Metadata Expansion */}
                            <div className="absolute -bottom-10 left-0 right-0 text-center opacity-0 group-hover/card:opacity-100 transition-all duration-300 delay-100 px-2 transform translate-y-2 group-hover/card:translate-y-0">
                                <p className="text-white text-xs font-bold line-clamp-1 drop-shadow-lg mb-1">{item.name}</p>
                                <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400">
                                    <span className="px-1.5 py-0.5 bg-white/10 rounded">HD</span>
                                    <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                                    <span>Premium</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <ChevronRight
                    className="absolute top-0 bottom-0 right-2 z-40 m-auto h-full w-12 cursor-pointer opacity-0 transition-all duration-300 hover:bg-black/60 hover:scale-105 group-hover:opacity-100 rounded-l-md bg-black/30 backdrop-blur-sm"
                    onClick={() => handleClick('right')}
                    color='white'
                    size={40}
                />
            </div>
        </div>
    );
};

export default Row;
