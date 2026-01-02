import React from 'react';
import { Play, Clock, BookOpen, Check, Plus } from 'lucide-react';

const VideoCard = ({ title, type = 'video', progress = 0, duration = null, quality = 'HD', onPlay, inList = false, onToggleList }) => {
    // Format duration from seconds to readable format
    const formatDuration = (seconds) => {
        if (!seconds) return null;
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };

    const getIcon = () => {
        switch (type) {
            case 'video':
                return <Play size={32} className="text-white opacity-80" />;
            case 'audio':
                return <svg className="w-8 h-8 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20"><path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" /></svg>;
            case 'pdf':
                return <BookOpen size={32} className="text-white opacity-80" />;
            default:
                return <Play size={32} className="text-white opacity-80" />;
        }
    };

    return (
        <div
            className="group relative cursor-pointer mr-2"
            onClick={onPlay}
        >
            {/* Card Content - 16:9 Aspect Ratio */}
            <div className="relative aspect-video rounded-md overflow-hidden bg-[#1A242F] border border-white/5 transition-all duration-300 md:hover:scale-105 hover:z-20 hover:border-[#00A8E1] hover:shadow-[0_0_20px_rgba(0,168,225,0.3)]">

                {/* Fallback Gradient/Thumbnail */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1A242F] to-[#0F171E] group-hover:from-[#252E39] group-hover:to-[#1A242F] transition-colors">
                    {/* Centered Icon as placeholder for thumbnail */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity scale-100 group-hover:scale-110 duration-500">
                        {getIcon()}
                    </div>
                </div>

                {/* Progress Bar (Bottom) */}
                {progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                        <div
                            className="h-full bg-[#00A8E1]"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                )}

                {/* Prime Badge (Top Left) */}
                <div className="absolute top-0 left-0">
                    <div className="bg-[#00A8E1] text-white text-[10px] font-bold px-2 py-1 rounded-br-md flex items-center gap-1 shadow-md">
                        <span className="italic font-extrabold font-sans">prime study</span>
                    </div>
                </div>

                {/* Duration (Top Right) */}
                {duration && (
                    <div className="absolute top-2 right-2 bg-black/70 px-1.5 py-0.5 rounded text-[10px] text-white font-medium backdrop-blur-sm">
                        {formatDuration(duration)}
                    </div>
                )}

                {/* Hover Play Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <Play size={18} fill="white" className="ml-0.5 text-white" />
                    </div>
                </div>

                {/* Quick Add Button (Top Right on Hover) */}
                <div
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30"
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleList();
                    }}
                >
                    <div className={`w-8 h-8 rounded-full border-2 ${inList ? 'border-[#3BBF68] bg-[#3BBF68]' : 'border-white bg-black/40'} flex items-center justify-center backdrop-blur-sm hover:scale-110 transition-transform`}>
                        {inList ? <Check size={16} className="text-white" strokeWidth={3} /> : <Plus size={16} className="text-white" strokeWidth={3} />}
                    </div>
                </div>

                {/* Hover Metadata Overlay (Bottom Gradient) */}
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <h3 className="text-white text-sm font-bold leading-tight mb-1 line-clamp-1">{title}</h3>
                    <div className="flex items-center gap-2 text-[10px] text-gray-300">
                        <span className="flex items-center gap-0.5 text-[#00A8E1]">
                            <Check size={10} strokeWidth={4} />
                            Included with Prime Study
                        </span>
                    </div>
                </div>
            </div>

            {/* Title Below Card (Visible by default like Prime) */}
            <div className="mt-2 px-0.5 group-hover:text-[#00A8E1] transition-colors">
                <h3 className="text-white text-sm font-medium leading-tight line-clamp-1 group-hover:font-bold">{title}</h3>
            </div>
        </div>
    );
};

export default VideoCard;
