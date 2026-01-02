import React from 'react';
import { Play, Info, Plus, Check } from 'lucide-react';

const Hero = ({ featuredItem, onPlay, onToggleList, inList = false }) => {
    // Prime Video Button Styles
    const primaryButton = "flex items-center justify-center gap-3 px-8 py-3.5 rounded-[4px] font-bold text-lg transition-all duration-200 bg-[#00A8E1] text-white hover:bg-[#008CB9] active:scale-95 whitespace-nowrap shadow-lg shadow-blue-900/20";
    const secondaryButton = "flex items-center justify-center gap-3 px-8 py-3.5 rounded-[4px] font-bold text-lg transition-all duration-200 bg-[#252E39]/80 text-white hover:bg-[#374252] active:scale-95 whitespace-nowrap backdrop-blur-sm border border-white/5";

    if (!featuredItem) {
        return (
            <div className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden bg-[var(--theme-background)]">
                {/* Clean Background - No 3D Shapes */}
                <div className="absolute inset-0 bg-[#0F171E]">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F171E] via-transparent to-black/40"></div>
                </div>

                {/* Call to Action Center */}
                <div className="relative z-10 text-center space-y-8 animate-fade-in-up">
                    <div className="inline-block p-6 rounded-full bg-[#1A242F] border border-white/5 shadow-[0_0_40px_var(--theme-glow)] mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00A8E1] to-[#008CB9] flex items-center justify-center shadow-lg">
                            <Plus size={32} className="text-white" />
                        </div>
                    </div>

                    <div className="space-y-4 max-w-lg mx-auto px-4">
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-2xl font-sans">
                            Welcome to Prime Study
                        </h1>
                        <p className="text-[#8197A4] text-lg md:text-xl font-medium leading-relaxed">
                            Open a folder to start watching your course content.
                        </p>
                    </div>

                    <button
                        onClick={onPlay}
                        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#00A8E1] text-white rounded-[4px] font-bold text-lg hover:bg-[#008CB9] transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(0,168,225,0.3)]"
                    >
                        <span>Open Course Folder</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-[90vh] w-full text-white overflow-hidden group font-sans">
            {/* --- Clean Background Treatments --- */}
            <div className="absolute inset-0 bg-[#0F171E]">
                {/* 1. Subtle Gradient Mesh - Blue tinted for Prime */}
                <div role="presentation" className={`absolute inset-0 bg-gradient-to-br transition-all duration-1000 ease-in-out opacity-80 ${featuredItem.type === 'video'
                    ? 'from-[#0F171E] via-[#1A242F] to-[#050505]'
                    : 'from-[#001D3D] via-[#0F171E] to-black'
                    }`}></div>

                {/* 2. Top Fade Gradient (for Navbar visibility) */}
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0F171E] to-transparent opacity-90 z-10"></div>

                {/* 3. Vignette & Fade Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F171E] via-[#0F171E]/40 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#0F171E] via-[#0F171E]/60 to-transparent"></div>
            </div>

            {/* --- Hero Content --- */}
            <div className="relative z-20 flex flex-col justify-end h-full px-8 md:px-16 pb-32 pt-20 max-w-[100%] mx-auto w-full">
                {/* Prime "Included with Prime" Badge */}
                <div className="flex items-center gap-2 mb-4 text-[#00A8E1] font-bold text-sm tracking-wide uppercase">
                    <Check size={16} strokeWidth={4} />
                    <span>Included with Prime Study</span>
                </div>

                {/* Main Title - Clean Sans Serif */}
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 drop-shadow-xl leading-[1.1] text-white max-w-4xl line-clamp-2">
                    {featuredItem.name}
                </h1>

                {/* Metadata Row */}
                <div className="flex items-center gap-4 text-gray-300 font-medium mb-6 text-base md:text-lg">
                    <span className="text-[#3BBF68] font-bold">98% Match</span>
                    <span className="text-gray-400">2025</span>
                    <span className="bg-[#252E39] border border-white/10 px-1.5 py-0.5 rounded-[2px] text-xs font-bold text-gray-300">X-Ray</span>
                    <span className="bg-[#252E39] border border-white/10 px-1.5 py-0.5 rounded-[2px] text-xs font-bold text-gray-300">UHD</span>
                    <span className="bg-[#252E39] border border-white/10 px-1.5 py-0.5 rounded-[2px] text-xs font-bold text-gray-300">16+</span>
                </div>

                {/* Description */}
                <p className="text-white text-lg max-w-2xl mb-8 drop-shadow-md line-clamp-3 leading-relaxed text-[#D6D6D6]">
                    Start watching this course to resume where you left off. Continue your learning journey with high-quality playback and note-taking features.
                </p>

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                    <button onClick={() => onPlay(featuredItem)} className={primaryButton}>
                        <Play fill="currentColor" size={24} />
                        <span>Resume</span>
                    </button>

                    <button
                        onClick={onToggleList}
                        className={inList ? "flex items-center justify-center gap-3 px-8 py-3.5 rounded-[4px] font-bold text-lg transition-all duration-200 bg-[#3BBF68] text-white hover:bg-[#2da356] shadow-lg" : secondaryButton}
                    >
                        {inList ? <Check size={24} strokeWidth={3} /> : <Plus size={24} />}
                        <span className="hidden sm:inline">{inList ? 'Added to List' : 'Add to Watchlist'}</span>
                    </button>

                    <button className="p-3.5 rounded-[4px] bg-[#252E39]/80 text-[#8197A4] hover:text-white border border-white/5 hover:bg-[#374252] transition-all backdrop-blur-sm">
                        <Info size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Hero;
