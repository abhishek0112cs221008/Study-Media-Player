import React, { useState } from 'react';
import { ThumbsUp, Plus, Check, Share2, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const VideoMetadata = ({
    lesson,
    progress = 0,
    inList = false,
    onToggleList,
    formatTitle
}) => {
    const [showDescription, setShowDescription] = useState(false);
    const [liked, setLiked] = useState(false);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: lesson.name,
                text: `Check out this lesson: ${formatTitle(lesson.name)}`
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    return (
        <div className="w-full bg-[#0f0f0f] border-b border-white/5">
            <div className="max-w-[1280px] mx-auto px-3 py-2">
                {/* Title - More Compact */}
                <h1 className="text-sm md:text-base font-semibold text-white mb-1.5 leading-tight line-clamp-2 overflow-hidden text-ellipsis">
                    {formatTitle(lesson.name)}
                </h1>

                {/* Stats Row - Compact */}
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                    {progress > 0 && (
                        <div className="flex items-center gap-1">
                            <TrendingUp size={12} className="text-green-500" />
                            <span className="font-medium text-green-500">{Math.round(progress)}%</span>
                        </div>
                    )}
                    <span className="capitalize px-1.5 py-0.5 bg-white/5 rounded text-[10px] font-medium">
                        {lesson.type}
                    </span>
                </div>

                {/* Action Buttons - Compact */}
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => setLiked(!liked)}
                        className={`
                            flex items-center gap-1 px-2 py-1 rounded-full font-medium text-[11px] transition-all
                            ${liked
                                ? 'bg-white/20 text-white'
                                : 'bg-white/5 text-white hover:bg-white/10'
                            }
                        `}
                    >
                        <ThumbsUp size={12} className={liked ? 'fill-white' : ''} />
                        <span className="hidden sm:inline">{liked ? 'Liked' : 'Like'}</span>
                    </button>

                    <button
                        onClick={onToggleList}
                        className={`
                            flex items-center gap-1 px-2 py-1 rounded-full font-medium text-[11px] transition-all
                            ${inList
                                ? 'bg-white/20 text-white'
                                : 'bg-white/5 text-white hover:bg-white/10'
                            }
                        `}
                    >
                        {inList ? <Check size={12} /> : <Plus size={12} />}
                        <span className="hidden sm:inline">{inList ? 'Saved' : 'Save'}</span>
                    </button>

                    <button
                        onClick={handleShare}
                        className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 text-white hover:bg-white/10 font-medium text-[11px] transition-all"
                    >
                        <Share2 size={12} />
                        <span className="hidden md:inline">Share</span>
                    </button>

                    {/* Expandable Description Toggle */}
                    <button
                        onClick={() => setShowDescription(!showDescription)}
                        className="ml-auto flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 text-[11px] transition-all"
                    >
                        <span className="hidden sm:inline">Info</span>
                        {showDescription ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>
                </div>

                {/* Description (Expandable) - Compact */}
                {showDescription && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 pt-2 border-t border-white/10"
                    >
                        <div className="text-xs text-gray-400 space-y-1">
                            <p><strong className="text-gray-300">Type:</strong> {lesson.type.toUpperCase()}</p>
                            <p className="line-clamp-1"><strong className="text-gray-300">Path:</strong> {lesson.path}</p>
                            {progress > 0 && (
                                <p><strong className="text-gray-300">Progress:</strong> {Math.round(progress)}%</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default VideoMetadata;
