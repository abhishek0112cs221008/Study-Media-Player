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
    onPlayCourse
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
        <div className="h-full flex flex-col" style={{ background: 'var(--theme-background-light)' }}>
            {/* Tabs Header - YouTube Style */}
            <div className="flex items-center shrink-0" style={{ borderBottom: '1px solid var(--theme-border)' }}>
                <button
                    onClick={() => setActiveTab('playlist')}
                    className={clsx(
                        "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-all relative",
                    )}
                    style={{
                        color: activeTab === 'playlist' ? 'var(--theme-text-primary)' : 'var(--theme-text-secondary)',
                    }}
                >
                    <ListVideo size={18} />
                    <span>Playlist</span>
                    {activeTab === 'playlist' && (
                        <motion.div
                            layoutId="tab-indicator"
                            className="absolute bottom-0 left-0 right-0 h-0.5"
                            style={{ background: 'var(--theme-primary)' }}
                        />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('notes')}
                    className={clsx(
                        "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-all relative",
                    )}
                    style={{
                        color: activeTab === 'notes' ? 'var(--theme-text-primary)' : 'var(--theme-text-secondary)',
                    }}
                >
                    <StickyNote size={18} />
                    <span>Notes ({notes.length})</span>
                    {activeTab === 'notes' && (
                        <motion.div
                            layoutId="tab-indicator"
                            className="absolute bottom-0 left-0 right-0 h-0.5"
                            style={{ background: 'var(--theme-primary)' }}
                        />
                    )}
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
                                <h3 className="font-semibold text-sm" style={{ color: 'var(--theme-text-primary)' }}>
                                    Up Next
                                </h3>
                                <p className="text-xs mt-0.5" style={{ color: 'var(--theme-text-secondary)' }}>
                                    {playlist.length} {playlist.length === 1 ? 'video' : 'videos'}
                                </p>
                            </div>
                            <button
                                onClick={() => setSortOrder(prev => prev === 'default' ? 'asc' : prev === 'asc' ? 'desc' : 'default')}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
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
                                            onClick={() => onPlayLesson(item)}
                                            className={clsx(
                                                "flex gap-3 p-3 cursor-pointer transition-all group",
                                            )}
                                            style={{
                                                background: isCurrent ? 'var(--theme-background-elevated)' : 'transparent',
                                                borderLeft: isCurrent ? `3px solid var(--theme-primary)` : '3px solid transparent',
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!isCurrent) e.currentTarget.style.background = 'var(--theme-background-elevated)';
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isCurrent) e.currentTarget.style.background = 'transparent';
                                            }}
                                        >
                                            {/* Thumbnail */}
                                            <div className="relative shrink-0 w-40 h-24 rounded-lg overflow-hidden" style={{ background: 'var(--theme-background)' }}>
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

                        {/* Next Course Suggestion */}
                        {nextCourse && (
                            <div className="mt-4 p-4" style={{ borderTop: '1px solid var(--theme-border)' }}>
                                <h5 className="text-xs font-semibold uppercase mb-3" style={{ color: 'var(--theme-text-secondary)' }}>
                                    Up Next
                                </h5>
                                <button
                                    onClick={() => onPlayCourse(nextCourse)}
                                    className="w-full flex items-center gap-3 group text-left p-3 rounded-lg transition-all"
                                    style={{ background: 'var(--theme-background-elevated)' }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'var(--theme-background)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'var(--theme-background-elevated)';
                                    }}
                                >
                                    <div className="w-12 h-12 rounded flex items-center justify-center shrink-0" style={{ background: 'var(--theme-background)' }}>
                                        <ListVideo size={20} style={{ color: 'var(--theme-text-secondary)' }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-semibold line-clamp-1 group-hover:underline" style={{ color: 'var(--theme-text-primary)' }}>
                                            {nextCourse.name}
                                        </div>
                                        <div className="text-xs" style={{ color: 'var(--theme-text-secondary)' }}>
                                            Next course
                                        </div>
                                    </div>
                                    <ArrowRight size={18} style={{ color: 'var(--theme-text-secondary)' }} />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RightPanel;
