import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import VideoCard from './VideoCard';

const Row = ({ title, items, onPlay, hideTitle = false, onToggleList }) => {
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

    return (
        <div className="h-auto mb-12 space-y-4 px-8 md:px-12 group/row relative z-20 animate-fade-in-up">
            {!hideTitle && (
                <div className="flex items-end gap-2 mb-2">
                    <h2 className="text-xl font-bold text-[#e5e5e5] hover:text-[#00A8E1] cursor-pointer transition-colors duration-200">
                        {title}
                    </h2>
                    <span className="text-xs font-bold text-[#00A8E1] opacity-0 group-hover/row:opacity-100 transition-opacity uppercase tracking-wider mb-1">See more</span>
                </div>
            )}

            <div className="group relative">
                <ChevronLeft
                    className={`absolute top-0 bottom-10 left-0 z-40 m-auto h-full w-12 cursor-pointer opacity-0 transition-opacity duration-300 hover:bg-[#0F171E]/60 hover:text-white group-hover:opacity-100 bg-[#0F171E]/30 backdrop-blur-sm border-r border-white/10 ${!isMoved && "hidden"}`}
                    onClick={() => handleClick('left')}
                    color='white'
                    size={48}
                />

                <div
                    ref={rowRef}
                    className="flex items-start space-x-4 overflow-x-scroll scrollbar-hide py-2 pl-1 perspective-1000"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {items.map((item, idx) => (
                        <div
                            key={idx}
                            className="relative min-w-[260px] md:min-w-[300px] z-10 hover:z-50"
                        >
                            <VideoCard
                                title={item.name}
                                type={item.type || 'video'}
                                progress={item.progress || 0}
                                duration={item.duration}
                                quality={item.quality || 'HD'}
                                onPlay={() => onPlay(item)}
                                inList={item.inList}
                                onToggleList={() => onToggleList && onToggleList(item)}
                            />
                        </div>
                    ))}
                </div>

                <ChevronRight
                    className="absolute top-0 bottom-10 right-0 z-40 m-auto h-full w-12 cursor-pointer opacity-0 transition-opacity duration-300 hover:bg-[#0F171E]/60 hover:text-white group-hover:opacity-100 bg-[#0F171E]/30 backdrop-blur-sm border-l border-white/10"
                    onClick={() => handleClick('right')}
                    color='white'
                    size={48}
                />
            </div>
        </div>
    );
};

export default Row;
