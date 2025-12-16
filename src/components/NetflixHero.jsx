import { Play, Info, Plus, Check } from 'lucide-react';
import GlossyBlackShapes from './GlossyBlackShapes';

const Hero = ({ featuredItem, onPlay, onToggleList }) => {
    // Shared button styles for consistency
    const buttonBase = "flex items-center gap-3 px-8 py-3 rounded md:rounded-[4px] font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95";
    const primaryButton = `${buttonBase} bg-white text-black hover:bg-gray-200 shadow-[0_4px_15px_rgba(255,255,255,0.2)]`;
    const secondaryButton = `${buttonBase} bg-[rgba(109,109,110,0.7)] text-white hover:bg-[rgba(109,109,110,0.9)] backdrop-blur-md shadow-lg`;
    const listButton = `${buttonBase} border-2 border-[rgba(255,255,255,0.5)] bg-[rgba(42,42,42,0.4)] text-white hover:bg-[rgba(255,255,255,0.1)] hover:border-white backdrop-blur-sm`;

    // Dynamic Mesh Gradient Animation using CSS classes
    const meshGradient = `
        bg-[radial-gradient(at_0%_0%,_#1a202c_0,_transparent_50%),_radial-gradient(at_50%_0%,_#2d3748_0,_transparent_50%),_radial-gradient(at_100%_0%,_#1a202c_0,_transparent_50%)]
    `;

    if (!featuredItem) {
        return (
            <div className="relative h-[85vh] w-full text-white overflow-hidden bg-black">
                {/* Modern Animated Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-[#1a1a1a] to-black animate-pulse-slow">
                    <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-gray-900 to-black"></div>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent h-full"></div>
                <div className="brightness-125 saturate-150 contrast-125">
                    <GlossyBlackShapes />
                </div>

                <div className="relative z-20 flex flex-col justify-center h-full px-8 md:px-12 pb-24 max-w-4xl pt-[20vh] animate-fade-in">
                    <h1 className="text-6xl md:text-8xl font-black mb-6 drop-shadow-2xl tracking-tighter leading-[1.1]">
                        Welcome to <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#E50914] via-red-500 to-red-800 drop-shadow-sm">StudyFlix</span>
                    </h1>
                    <p className="text-xl md:text-2xl font-medium drop-shadow-lg text-gray-200 mb-10 leading-relaxed max-w-lg text-shadow">
                        Your personal cinema for learning. <br />
                        <span className="text-gray-400 text-lg">Organize, watch, and master your local courses with a premium experience.</span>
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
            {/* Dynamic Background with Smooth Transition */}
            <div className="absolute inset-0 bg-[#141414]">
                {/* Gradient Mesh */}
                <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-1000 ease-in-out ${featuredItem.type === 'video'
                    ? 'from-slate-900 via-purple-900/40 to-black'
                    : 'from-blue-900/40 via-slate-900 to-black'
                    }`}></div>

                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 brightness-100 contrast-150 mix-blend-overlay"></div>

                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/60 to-transparent"></div>

                <div className="absolute inset-0 brightness-125 saturate-150 contrast-125 z-0">
                    <GlossyBlackShapes />
                </div>
            </div>

            <div className="relative z-20 flex flex-col justify-center h-full px-8 md:px-12 pb-32 max-w-5xl pt-[15vh] animate-slide-up">
                <div className="flex items-center gap-4 mb-6 animate-fade-in delay-100">
                    <div className="w-1.5 h-12 bg-gradient-to-b from-[#E50914] to-[#ff1a24] shadow-glow-red rounded-full"></div>
                    <span className="text-gray-100 font-bold tracking-[0.3em] uppercase text-sm md:text-base drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        {folderName}
                    </span>
                </div>

                <h1 className="text-5xl md:text-8xl font-black mb-8 drop-shadow-[0_6px_10px_rgba(0,0,0,0.9)] leading-[1.1] tracking-tight text-white max-w-4xl line-clamp-3">
                    {featuredItem.name}
                </h1>

                <div className="flex items-center gap-6 text-gray-200 font-semibold mb-10 text-sm md:text-base flex-wrap">
                    <span className="text-[#46d369] font-bold drop-shadow-md flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#46d369] rounded-full animate-pulse"></span>
                        98% Match
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="glass px-3 py-1.5 rounded-md">{new Date().getFullYear()}</span>
                    <span className="border border-white/30 px-3 py-1 rounded text-xs bg-black/40 backdrop-blur-sm shadow-sm font-bold">HD</span>
                    <span className="capitalize flex items-center gap-2 font-mono text-gray-400 text-sm">
                        {featuredItem.type}
                    </span>
                </div>

                {/* Visual Progress in Hero */}
                {progress > 0 && (
                    <div className="mb-10 max-w-md group/progress cursor-pointer">
                        <div className="flex justify-between text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider group-hover/progress:text-white transition-colors">
                            <span>Resume Playback</span>
                            <span>{Math.round(progress)}% Complete</span>
                        </div>
                        <div className="h-2 bg-gray-800/60 rounded-full overflow-hidden backdrop-blur-sm border border-white/10 group-hover/progress:h-2.5 transition-all shadow-inner">
                            <div
                                className="h-full bg-gradient-to-r from-[#E50914] via-[#ff1a24] to-[#E50914] shadow-glow-red relative"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="absolute inset-0 shimmer"></div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap gap-4 animate-fade-in-up delay-200">
                    <button
                        onClick={() => onPlay(featuredItem)}
                        className={`${primaryButton} shadow-glow-red-lg hover:shadow-glow-red group relative overflow-hidden`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent shimmer opacity-0 group-hover:opacity-100"></div>
                        <Play fill="black" size={24} className="group-hover:scale-110 transition-transform relative z-10" />
                        <span className="relative z-10">{progress > 0 ? 'Resume' : 'Play'}</span>
                    </button>
                    <button
                        onClick={() => onToggleList(featuredItem)}
                        className={`${listButton} border-glow-hover group`}
                    >
                        {inList ? <Check size={24} className="text-green-400 group-hover:scale-110 transition-transform" /> : <Plus size={24} className="group-hover:rotate-90 transition-transform" />}
                        {inList ? 'In My List' : 'My List'}
                    </button>
                    <button className={`${secondaryButton} group`}>
                        <Info size={24} className="group-hover:scale-110 transition-transform" />
                        Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Hero;
