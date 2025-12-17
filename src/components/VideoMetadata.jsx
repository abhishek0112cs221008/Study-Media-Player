import React, { useState } from 'react';
import { ThumbsUp, Plus, Check, Share2, ChevronDown, ChevronUp, BookOpen, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
        <div className="w-full" style={{ background: 'var(--theme-background)', borderBottom: '1px solid var(--theme-border)' }}>
            <div className="px-6 py-4">
                {/* Title */}
                <h1 className="text-xl font-semibold mb-3 leading-tight" style={{ color: 'var(--theme-text-primary)' }}>
                    {formatTitle(lesson.name)}
                </h1>

                {/* Channel/Course Info & Actions Row */}
                <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                    {/* Left: Course Info */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--theme-primary)' }}>
                            <BookOpen size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm" style={{ color: 'var(--theme-text-primary)' }}>
                                Study Course
                            </p>
                            <p className="text-xs" style={{ color: 'var(--theme-text-secondary)' }}>
                                {progress > 0 ? `${Math.round(progress)}% complete` : 'Not started'}
                            </p>
                        </div>
                    </div>

                    {/* Right: Action Buttons */}
                    <div className="flex items-center gap-2">
                        {/* Like Button */}
                        <button
                            onClick={() => setLiked(!liked)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all"
                            style={{
                                background: liked ? 'var(--theme-background-elevated)' : 'var(--theme-background-elevated)',
                                color: 'var(--theme-text-primary)',
                            }}
                        >
                            <ThumbsUp size={18} className={liked ? 'fill-current' : ''} />
                            <span className="hidden sm:inline">{liked ? 'Liked' : 'Like'}</span>
                        </button>

                        {/* Save to List Button */}
                        <button
                            onClick={onToggleList}
                            className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all"
                            style={{
                                background: 'var(--theme-background-elevated)',
                                color: 'var(--theme-text-primary)',
                            }}
                        >
                            {inList ? <Check size={18} /> : <Plus size={18} />}
                            <span className="hidden sm:inline">{inList ? 'Saved' : 'Save'}</span>
                        </button>

                        {/* Share Button */}
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all"
                            style={{
                                background: 'var(--theme-background-elevated)',
                                color: 'var(--theme-text-primary)',
                            }}
                        >
                            <Share2 size={18} />
                            <span className="hidden md:inline">Share</span>
                        </button>

                        {/* More Options (Download, etc) */}
                        <button
                            className="flex items-center justify-center w-10 h-10 rounded-full transition-all"
                            style={{
                                background: 'var(--theme-background-elevated)',
                                color: 'var(--theme-text-primary)',
                            }}
                            title="Download"
                        >
                            <Download size={18} />
                        </button>
                    </div>
                </div>

                {/* Description Section (Expandable) */}
                <div
                    className="rounded-xl p-4 cursor-pointer transition-all"
                    style={{ background: 'var(--theme-background-elevated)' }}
                    onClick={() => setShowDescription(!showDescription)}
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-semibold px-2 py-1 rounded" style={{ background: 'var(--theme-primary)', color: 'white' }}>
                                    {lesson.type.toUpperCase()}
                                </span>
                                {progress > 0 && (
                                    <span className="text-xs font-semibold" style={{ color: 'var(--theme-primary)' }}>
                                        {Math.round(progress)}% watched
                                    </span>
                                )}
                            </div>
                            <AnimatePresence>
                                {showDescription ? (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-3 text-sm space-y-2"
                                        style={{ color: 'var(--theme-text-secondary)' }}
                                    >
                                        <p><strong style={{ color: 'var(--theme-text-primary)' }}>File:</strong> {lesson.name}</p>
                                        <p className="line-clamp-2"><strong style={{ color: 'var(--theme-text-primary)' }}>Path:</strong> {lesson.path}</p>
                                    </motion.div>
                                ) : (
                                    <p className="text-sm mt-1" style={{ color: 'var(--theme-text-secondary)' }}>
                                        Click to see more details...
                                    </p>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="ml-4">
                            {showDescription ? <ChevronUp size={20} style={{ color: 'var(--theme-text-secondary)' }} /> : <ChevronDown size={20} style={{ color: 'var(--theme-text-secondary)' }} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoMetadata;
