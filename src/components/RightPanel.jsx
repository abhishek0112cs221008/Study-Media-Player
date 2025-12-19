import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { StickyNote, ListVideo, PlayCircle, CheckCircle, Music, FileText, ArrowRight, Play, ArrowUpDown } from 'lucide-react';
import NotesSection from './NotesSection';

const RightPanel = ({
    notes,
    onAddNote,
    onDeleteNote,
    getCurrentTime,
    onJumpToTimestamp,

    // Playlist props
    playlist = [],
    currentLesson,
    onPlayLesson,
    progress,
    nextCourse,
    onPlayCourse,

    onGoHome,
}) => {
    const [activeTab, setActiveTab] = useState('playlist'); // Default to playlist like YouTube
    const [sortOrder, setSortOrder] = useState('default'); // 'default' | 'asc' | 'desc'

    const sortedPlaylist = useMemo(() => {
        let sorted = [...playlist];
        if (sortOrder === 'asc') {
            sorted.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
        }
        if (sortOrder === 'desc') {
            sorted.sort((a, b) => b.name.localeCompare(a.name, undefined, { numeric: true, sensitivity: 'base' }));
        }
        return sorted;
    }, [playlist, sortOrder]);

    return (
        <div className="h-full flex flex-col theater-container" style={{ background: 'var(--theater-bg)' }}>
            {/* Breadcrumbs - Drawing Style Dynamic */}
            <div className="theater-breadcrumb flex items-center gap-1 group">
                <button
                    onClick={onGoHome}
                    className="hover:text-white transition-colors"
                    title="Go to Home"
                >
                    Home
                </button>
                <span className="opacity-40 mx-1">&gt;</span>
                <span className="text-[var(--theater-accent)] font-bold tracking-tight uppercase ml-2 text-sm">Study Mode</span>
            </div>

            {/* Tabs Header - Drawing Style */}
            <div className="theater-tab-container bg-black/40 backdrop-blur-md">
                <button
                    onClick={() => setActiveTab('playlist')}
                    className={clsx("theater-tab pb-4", activeTab === 'playlist' && "active")}
                >
                    PLAYLIST
                </button>
                <button
                    onClick={() => setActiveTab('notes')}
                    className={clsx("theater-tab pb-4", activeTab === 'notes' && "active")}
                >
                    NOTES
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
                {activeTab === 'notes' ? (
                    <div className="p-4">
                        <NotesSection
                            notes={notes}
                            onAddNote={onAddNote}
                            onDeleteNote={onDeleteNote}
                            getCurrentTime={getCurrentTime}
                            onJumpToTimestamp={onJumpToTimestamp}
                            darkMode={true}
                        />
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {/* Playlist Header with Sort */}
                        <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--theme-border)' }}>
                            <div>
                                <h3 className="font-bold text-[11px] uppercase tracking-wider text-[var(--theater-text)]">
                                    Up Next
                                </h3>
                                <p className="text-[10px] text-[var(--theater-text-muted)]">
                                    {playlist.length} {playlist.length === 1 ? 'video' : 'videos'}
                                </p>
                            </div>
                            <button
                                onClick={() => setSortOrder(prev => prev === 'default' ? 'asc' : prev === 'asc' ? 'desc' : 'default')}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[5px] text-xs font-medium transition-all"
                                style={{
                                    background: 'var(--theme-background-elevated)',
                                    color: 'var(--theme-text-secondary)',
                                }}
                                title="Sort playlist"
                            >
                                <ArrowUpDown size={14} />
                                <span>{sortOrder === 'default' ? 'Default' : sortOrder === 'asc' ? 'A-Z' : 'Z-A'}</span>
                            </button>
                        </div>

                        {sortedPlaylist.length === 0 ? (
                            <div className="p-8 text-center text-sm" style={{ color: 'var(--theme-text-secondary)' }}>
                                No videos in playlist
                            </div>
                        ) : (
                            <div>
                                {sortedPlaylist.map((item, idx) => {
                                    const isCurrent = currentLesson?.path === item.path;
                                    const itemProgress = progress[item.path] || 0;
                                    const isCompleted = itemProgress >= 90;
                                    const Icon = item.type === 'video' ? PlayCircle : item.type === 'audio' ? Music : FileText;

                                    return (
                                        <div
                                            key={item.path}
                                            className={clsx(
                                                "flex gap-4 p-3 cursor-pointer transition-all duration-300 group rounded-[5px] border border-transparent",
                                                isCurrent ? "bg-[var(--theater-surface)] border-white/10 shadow-lg" : "hover:bg-white/5"
                                            )}
                                            onClick={() => onPlayLesson(item)}
                                        >
                                            {/* Thumbnail */}
                                            <div className="relative shrink-0 w-32 h-20 rounded-[5px] overflow-hidden bg-black/40 border border-white/5">
                                                {/* Thumbnail Content */}
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    {isCurrent ? (
                                                        <div className="flex gap-1 items-end h-5">
                                                            <motion.div
                                                                animate={{ height: [8, 16, 8] }}
                                                                transition={{ repeat: Infinity, duration: 0.8 }}
                                                                className="w-1 rounded-full"
                                                                style={{ background: 'var(--theme-primary)' }}
                                                            />
                                                            <motion.div
                                                                animate={{ height: [12, 20, 12] }}
                                                                transition={{ repeat: Infinity, duration: 1.1, delay: 0.1 }}
                                                                className="w-1 rounded-full"
                                                                style={{ background: 'var(--theme-primary)' }}
                                                            />
                                                            <motion.div
                                                                animate={{ height: [8, 14, 8] }}
                                                                transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                                                                className="w-1 rounded-full"
                                                                style={{ background: 'var(--theme-primary)' }}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <Icon size={32} style={{ color: isCompleted ? 'var(--theme-success)' : 'var(--theme-text-secondary)' }} />
                                                    )}
                                                </div>

                                                {/* Progress Bar */}
                                                {itemProgress > 0 && (
                                                    <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
                                                        <div className="h-full" style={{ width: `${itemProgress}%`, background: 'var(--theme-primary)' }} />
                                                    </div>
                                                )}

                                                {/* Play Overlay on Hover */}
                                                {!isCurrent && (
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Play size={28} className="text-white" fill="white" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Video Info */}
                                            <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                                                <h4
                                                    className={clsx(
                                                        "text-sm font-medium line-clamp-2 leading-tight",
                                                    )}
                                                    style={{
                                                        color: isCurrent ? 'var(--theme-primary)' : 'var(--theme-text-primary)',
                                                        fontWeight: isCurrent ? '600' : '500',
                                                    }}
                                                >
                                                    {item.name}
                                                </h4>

                                                <div className="flex items-center gap-2 flex-wrap">
                                                    {isCurrent ? (
                                                        <span
                                                            className="text-xs font-semibold px-2 py-0.5 rounded"
                                                            style={{ background: 'var(--theme-primary)', color: 'white' }}
                                                        >
                                                            Now Playing
                                                        </span>
                                                    ) : (
                                                        <>
                                                            <span
                                                                className="text-xs uppercase font-medium px-1.5 py-0.5 rounded"
                                                                style={{ background: 'var(--theme-background)', color: 'var(--theme-text-secondary)' }}
                                                            >
                                                                {item.type}
                                                            </span>
                                                            {itemProgress > 0 && (
                                                                <span
                                                                    className="text-xs font-medium"
                                                                    style={{ color: isCompleted ? 'var(--theme-success)' : 'var(--theme-primary)' }}
                                                                >
                                                                    {isCompleted ? '✓ Completed' : `${Math.round(itemProgress)}%`}
                                                                </span>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Next Course Suggestion - MOVED TO STATUS BAR IN APP.JSX */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RightPanel;
