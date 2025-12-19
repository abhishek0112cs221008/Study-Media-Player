import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, PlayCircle, Plus, ThumbsUp, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressRing from './ProgressRing';
import Tooltip from './Tooltip';
import CassetteTape from './CassetteTape';

const Row = ({ title, items, onPlay, hideTitle = false }) => {
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
            {!hideTitle && (
                <h2 className="text-xl md:text-2xl font-bold text-[#e5e5e5] hover:text-white cursor-pointer transition-colors duration-200 flex items-center gap-3">
                    {title}
                    <ChevronRight size={20} className="text-[var(--theme-primary)] opacity-0 group-hover/row:opacity-100 transition-opacity -translate-x-4 group-hover/row:translate-x-0 duration-300" strokeWidth={3} />
                </h2>
            )}

            <div className="group relative">
                <ChevronLeft
                    className={`absolute top-0 bottom-0 left-2 z-40 m-auto h-full w-12 cursor-pointer opacity-0 transition-all duration-300 hover:bg-black/60 hover:scale-105 group-hover:opacity-100 rounded-[5px] bg-black/30 backdrop-blur-sm ${!isMoved && "hidden"}`}
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
                            <div
                                className={`relative transition-all duration-300 transform group-hover/card:scale-105 group-hover/card:z-50`}
                                style={{
                                    transform: 'translateY(0)',
                                    transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.3s ease'
                                }}
                            >
                                <CassetteTape
                                    title={item.name}
                                    active={item.path === 'active'} // Or passed prop if current
                                    progress={item.progress}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <ChevronRight
                    className="absolute top-0 bottom-0 right-2 z-40 m-auto h-full w-12 cursor-pointer opacity-0 transition-all duration-300 hover:bg-black/60 hover:scale-105 group-hover:opacity-100 rounded-[5px] bg-black/30 backdrop-blur-sm"
                    onClick={() => handleClick('right')}
                    color='white'
                    size={40}
                />
            </div>
        </div>
    );
};

export default Row;
