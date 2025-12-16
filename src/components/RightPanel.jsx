import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { StickyNote, ListVideo, PlayCircle, CheckCircle, Music, FileText, ArrowRight, ArrowUpDown, Clock } from 'lucide-react';
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
    nextCourse,       // { name, lessons: [], ... }
    onPlayCourse      // handler to start next course
}) => {
    const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'playlist'
    const [sortOrder, setSortOrder] = useState('default'); // 'default' | 'asc' | 'desc'

    const sortedPlaylist = useMemo(() => {
        let sorted = [...playlist];
        if (sortOrder === 'asc') sorted.sort((a, b) => a.name.localeCompare(b.name));
        if (sortOrder === 'desc') sorted.sort((a, b) => b.name.localeCompare(a.name));
        return sorted;
    }, [playlist, sortOrder]);

    return (
        <div className="h-full flex flex-col bg-[#141414]">
            {/* Tabs Header */}
            <div className="flex items-center border-b border-white/10 shrink-0">
                <button
                    onClick={() => setActiveTab('notes')}
                    className={clsx(
                        "flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors relative",
                        activeTab === 'notes' ? "text-white" : "text-gray-500 hover:text-gray-300"
                    )}
                >
                    <StickyNote size={18} />
                    <span>Notes ({notes.length})</span>
                    {activeTab === 'notes' && (
                        <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('playlist')}
                    className={clsx(
                        "flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors relative",
                        activeTab === 'playlist' ? "text-white" : "text-gray-500 hover:text-gray-300"
                    )}
                >
                    <ListVideo size={18} />
                    <span>Up Next</span>
                    {activeTab === 'playlist' && (
                        <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
                    )}
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent bg-[#141414]">
                {activeTab === 'notes' ? (
                    <div className="p-6">
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
                    <div className="flex flex-col min-h-full">
                        {/* Controls */}
                        <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center bg-[#181818]">
                            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{sortedPlaylist.length} Items</span>
                            <button
                                onClick={() => setSortOrder(prev => prev === 'default' ? 'asc' : prev === 'asc' ? 'desc' : 'default')}
                                className="text-xs flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
                            >
                                <ArrowUpDown size={14} />
                                <span>{sortOrder === 'default' ? 'Original' : sortOrder === 'asc' ? 'A-Z' : 'Z-A'}</span>
                            </button>
                        </div>

                        {playlist.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 text-sm">No related videos found.</div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {sortedPlaylist.map((item, idx) => {
                                    const isCurrent = currentLesson?.path === item.path;
                                    const itemProgress = progress[item.path] || 0;
                                    const isCompleted = itemProgress >= 90;
                                    const Icon = isCompleted ? CheckCircle : item.type === 'video' ? PlayCircle : item.type === 'audio' ? Music : FileText;

                                    return (
                                        <div
                                            key={item.path}
                                            onClick={() => onPlayLesson(item)}
                                            className={clsx(
                                                "flex gap-3 p-4 cursor-pointer transition-colors hover:bg-white/5 relative group",
                                                isCurrent ? "bg-white/10 border-l-4 border-red-600" : "border-l-4 border-transparent"
                                            )}
                                        >
                                            <div className="relative shrink-0 w-28 h-18 bg-gray-800 rounded-md overflow-hidden border border-white/5 group-hover:border-white/20 transition-colors">
                                                {/* Thumbnail Placeholder */}
                                                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                                                    {isCurrent ? (
                                                        <div className="flex gap-1 items-end h-4">
                                                            <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-red-500 rounded-full" />
                                                            <motion.div animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 1.1, delay: 0.1 }} className="w-1 bg-red-500 rounded-full" />
                                                            <motion.div animate={{ height: [4, 10, 4] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1 bg-red-500 rounded-full" />
                                                        </div>
                                                    ) : (
                                                        <Icon size={24} className={clsx(isCompleted ? "text-green-500" : "text-gray-500")} />
                                                    )}
                                                </div>
                                                {/* Progress Bar */}
                                                {itemProgress > 0 && (
                                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                                                        <div className="h-full bg-red-600" style={{ width: `${itemProgress}%` }} />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                                                <h4 className={clsx(
                                                    "text-sm font-medium line-clamp-2 leading-tight transition-colors",
                                                    isCurrent ? "text-red-500 font-bold" : "text-gray-200 group-hover:text-white"
                                                )}>
                                                    {item.name}
                                                </h4>

                                                <div className="flex items-center gap-3">
                                                    {isCurrent ? (
                                                        <span className="text-[10px] uppercase font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded animate-pulse">
                                                            Now Playing
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] uppercase font-bold text-gray-500 bg-white/5 px-1.5 py-0.5 rounded">{item.type}</span>
                                                    )}

                                                    {!isCurrent && itemProgress > 0 && (
                                                        <span className={clsx(
                                                            "text-[10px] font-medium",
                                                            isCompleted ? "text-green-500" : "text-blue-400"
                                                        )}>
                                                            {isCompleted ? "Completed" : `${Math.round(itemProgress)}% Left`}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        {/* Next Course Suggestion */}
                        {nextCourse && (
                            <div className="mt-8 p-4 bg-gradient-to-br from-gray-900 to-black border-t border-white/10">
                                <h5 className="text-gray-400 text-xs font-bold uppercase mb-3">Up Next Recommendation</h5>
                                <button
                                    onClick={() => onPlayCourse(nextCourse)}
                                    className="w-full flex items-center gap-4 group text-left"
                                >
                                    <div className="w-16 h-16 bg-zinc-800 rounded flex items-center justify-center shrink-0 group-hover:bg-zinc-700 transition-colors">
                                        <ListVideo size={24} className="text-gray-400" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white group-hover:underline mb-1 line-clamp-1">{nextCourse.name}</div>
                                        <div className="text-xs text-gray-500">Start next folder</div>
                                    </div>
                                    <div className="ml-auto">
                                        <ArrowRight size={20} className="text-gray-500 group-hover:text-white transition-colors" />
                                    </div>
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
