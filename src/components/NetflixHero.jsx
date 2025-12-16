import React from 'react';
import { Play, Info, Plus, Check } from 'lucide-react';

const Hero = ({ featuredItem, onPlay, onToggleList }) => {
    // Shared button styles for consistency
    const buttonBase = "flex items-center gap-3 px-8 py-3 rounded md:rounded-[4px] font-bold text-lg transition-transform active:scale-95 duration-200";
    const primaryButton = `${buttonBase} bg-white text-black hover:bg-white/90`;
    const secondaryButton = `${buttonBase} bg-[rgba(109,109,110,0.7)] text-white hover:bg-[rgba(109,109,110,0.9)] backdrop-blur-sm`;
    const listButton = `${buttonBase} border-2 border-[rgba(255,255,255,0.7)] bg-[rgba(42,42,42,0.6)] text-white hover:bg-[rgba(255,255,255,0.1)] hover:border-white backdrop-blur-sm`;

    if (!featuredItem) {
        return (
            <div className="relative h-[85vh] w-full text-white overflow-hidden">
                {/* Background: Gradient + Pattern Fallback */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800">
                    <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent h-full"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/40 to-transparent w-full"></div>
                </div>

                <div className="relative z-10 flex flex-col justify-center h-full px-4 md:px-12 pb-24 max-w-2xl pt-[20vh] animate-fade-in">
                    <h1 className="text-6xl md:text-8xl font-black mb-6 drop-shadow-2xl tracking-tighter leading-[1.1]">
                        Welcome to <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E50914] to-red-600">StudyFlix</span>
                    </h1>
                    <p className="text-xl md:text-2xl font-medium drop-shadow-lg text-gray-200 mb-10 leading-relaxed max-w-lg">
                        Your personal cinema for learning. <br />
                        Organize, watch, and master your local courses with a premium experience.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button onClick={onPlay} className={primaryButton}>
                            <Play fill="black" size={24} />
                            Load Folder
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Extract folder name (parent directory)
    const getFolderName = (path) => {
        if (!path) return 'Featured Course';
        const parts = path.split('/');
        return parts.length > 1 ? parts[parts.length - 2] : 'Featured Content';
    };

    const folderName = featuredItem ? getFolderName(featuredItem.path) : '';
    const progress = featuredItem?.progress || 0;
    const inList = featuredItem?.inList || false;

    return (
        <div className="relative h-[85vh] w-full text-white overflow-hidden group">
            {/* Dynamic Background */}
            <div className="absolute inset-0">
                {/* Fallback gradient if image fails or for generic type */}
                <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-1000 ease-in-out ${featuredItem.type === 'video' ? 'from-slate-900 via-purple-900 to-slate-900' : 'from-blue-900 via-slate-900 to-black'
                    }`}></div>

                {/* Decorative Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/20 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/50 to-transparent"></div>
            </div>

            <div className="relative z-10 flex flex-col justify-center h-full px-4 md:px-12 pb-32 max-w-4xl pt-[15vh] animate-slide-up">
                <div className="flex items-center gap-3 mb-6 animate-fade-in delay-100">
                    <div className="w-1 h-8 bg-[#E50914] rounded-full shadow-[0_0_10px_#E50914]"></div>
                    <span className="text-gray-200 font-bold tracking-[0.2em] uppercase text-sm md:text-base drop-shadow-md">
                        {folderName}
                    </span>
                </div>

                <h1 className="text-4xl md:text-6xl font-black mb-6 drop-shadow-2xl leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 max-w-3xl line-clamp-3">
                    {featuredItem.name}
                </h1>

                <div className="flex items-center gap-6 text-gray-300 font-semibold mb-8 text-sm md:text-base">
                    <span className="text-[#46d369] font-bold drop-shadow-lg">98% Match</span>
                    <span className="bg-white/10 px-2 py-1 rounded border border-white/10 backdrop-blur-md">{new Date().getFullYear()}</span>
                    <span className="border border-white/30 px-2 py-0.5 rounded textxs bg-black/40 backdrop-blur-sm shadow-sm">HD</span>
                    <span className="capitalize flex items-center gap-2">
                        {featuredItem.type}
                    </span>
                </div>

                {/* Visual Progress in Hero */}
                {progress > 0 && (
                    <div className="mb-8 max-w-md">
                        <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                            <span>Resume Playback</span>
                            <span>{Math.round(progress)}% Left</span>
                        </div>
                        <div className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                            <div className="h-full bg-[#E50914] shadow-[0_0_15px_#E50914]" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap gap-4 animate-fade-in-up delay-200">
                    <button onClick={() => onPlay(featuredItem)} className={primaryButton}>
                        <Play fill="black" size={24} className="group-hover:scale-110 transition-transform" />
                        {progress > 0 ? 'Resume' : 'Play'}
                    </button>
                    <button onClick={() => onToggleList(featuredItem)} className={listButton}>
                        {inList ? <Check size={24} className="text-green-400" /> : <Plus size={24} />}
                        {inList ? 'In My List' : 'My List'}
                    </button>
                    <button className={secondaryButton}>
                        <Info size={24} className="group-hover:scale-110 transition-transform" />
                        Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Hero;
