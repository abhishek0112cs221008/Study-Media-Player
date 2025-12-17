import React from 'react';
import { Play, Info, Plus } from 'lucide-react';
import GlossyBlackShapes from './GlossyBlackShapes';

const Hero = ({ featuredItem, onPlay, onToggleList }) => {
    // Primary: Netflix White Play Button
    const primaryButton = "flex items-center justify-center gap-3 px-8 py-3 rounded-[4px] font-bold text-xl transition-all duration-200 bg-white text-black hover:bg-white/90 active:scale-95 whitespace-nowrap";

    // Secondary: Netflix Gray More Info Button
    const secondaryButton = "flex items-center justify-center gap-3 px-8 py-3 rounded-[4px] font-bold text-xl transition-all duration-200 bg-[rgba(109,109,110,0.7)] text-white hover:bg-[rgba(109,109,110,0.4)] active:scale-95 whitespace-nowrap backdrop-blur-sm";

    if (!featuredItem) {
        return (
            <div className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden bg-[var(--theme-background)]">
                {/* Minimal Background */}
                <div className="absolute inset-0 bg-[var(--theme-background)]">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f0f] via-black to-black"></div>
                    <div className="absolute top-0 right-0 w-full h-full opacity-40 mix-blend-screen pointer-events-none">
                        <GlossyBlackShapes />
                    </div>
                </div>

                {/* Call to Action Center */}
                <div className="relative z-10 text-center space-y-8 animate-fade-in-up">
                    <div className="inline-block p-6 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_40px_var(--theme-glow)] mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--theme-primary)] to-[var(--theme-primary-dark)] flex items-center justify-center shadow-lg">
                            <Plus size={32} className="text-white" />
                        </div>
                    </div>

                    <div className="space-y-4 max-w-lg mx-auto px-4">
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-2xl">
                            Ready to Learn?
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed">
                            Open a folder from your computer to start your cinematic learning experience.
                        </p>
                    </div>

                    <button
                        onClick={onPlay}
                        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-lg font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    >
                        <span>Open Course Folder</span>
                        <Play size={20} fill="black" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-[90vh] w-full text-white overflow-hidden group font-sans">
            {/* --- Background Treatments --- */}
            <div className="absolute inset-0 bg-[var(--theme-background)]">
                {/* 1. Subtle Gradient Mesh */}
                <div role="presentation" className={`absolute inset-0 bg-gradient-to-br transition-all duration-1000 ease-in-out opacity-60 ${featuredItem.type === 'video'
                    ? 'from-gray-900 via-[#1a1a1a] to-black'
                    : 'from-blue-900/20 via-gray-900 to-black'
                    }`}></div>

                {/* 2. Cinematic Noise/Grain Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>

                {/* 3. Vignette & Fade Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-background)] via-[var(--theme-background)]/20 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--theme-background)] via-[var(--theme-background)]/50 to-transparent"></div>

                {/* 4. 3D Elements (Glossy Shapes) - Positioned to not clash */}
                <div className="absolute top-0 right-0 w-2/3 h-full opacity-60 brightness-75 contrast-125 pointer-events-none z-0 mix-blend-screen">
                    {/* GlossyShapes removed/minimized in new clean look, or kept subtle */}
                    <div className="opacity-30">
                        <GlossyBlackShapes />
                    </div>
                </div>
            </div>

            {/* --- Hero Content --- */}
            <div className="relative z-20 flex flex-col justify-end h-full px-4 md:px-16 pb-32 pt-20 max-w-[100%] mx-auto w-full">
                {/* Main Title */}
                <h1 className="text-5xl sm:text-6xl md:text-8xl font-normal mb-6 drop-shadow-xl leading-[0.9] text-white max-w-4xl line-clamp-2 font-['Bebas_Neue']">
                    {featuredItem.name}
                </h1>

                {/* Metadata Row */}
                <div className="flex items-center gap-4 text-gray-200 font-medium mb-6 text-lg">
                    <span className="text-[#46d369] font-bold">98% Match</span>
                    <span className="text-gray-400">2025</span>
                    <span className="border border-gray-400 px-1.5 py-0.5 rounded-[2px] text-xs">HD</span>
                </div>

                {/* Description - Using real data if available or generic */}
                <p className="text-white text-lg max-w-2xl mb-8 drop-shadow-md line-clamp-3 leading-snug">
                    Start watching this course to resume where you left off. Continue your learning journey with high-quality playback and note-taking features.
                </p>

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                    <button onClick={() => onPlay(featuredItem)} className={primaryButton}>
                        <Play fill="currentColor" size={28} />
                        <span>Play</span>
                    </button>

                    <button className={secondaryButton}>
                        <Info size={28} />
                        <span>More Info</span>
                    </button>
                    {/* Removed "My List" button from Hero to match cleaner Netflix Hero */}
                </div>
            </div>
        </div>
    );
};

export default Hero;
