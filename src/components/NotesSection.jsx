import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StickyNote, Clock, Trash2, Save, Plus } from 'lucide-react';
import clsx from 'clsx';

const NotesSection = ({
    notes = [],
    onAddNote,
    onDeleteNote,
    onJumpToTimestamp,
    getCurrentTime,
    darkMode
}) => {
    const [noteInput, setNoteInput] = useState('');

    const handleSave = () => {
        if (!noteInput.trim()) return;
        const time = getCurrentTime?.();
        onAddNote(noteInput, time);
        setNoteInput('');
    };

    const formatTimestamp = (s) => {
        if (s == null) return null;
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <div className="max-w-4xl mx-auto mt-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-500/10 rounded-lg">
                    <StickyNote size={24} className="text-red-500" />
                </div>
                <h2 className={clsx("text-2xl font-bold", darkMode ? "text-white" : "text-gray-900")}>Notes</h2>
                <span className={clsx("text-sm font-medium px-2 py-1 rounded-md ml-auto", darkMode ? "bg-white/10 text-gray-400" : "bg-black/5 text-gray-500")}>
                    {notes.length} notes
                </span>
            </div>

            {/* Input Area */}
            <div className={clsx(
                "rounded-2xl p-1 mb-8 shadow-lg transition-all ring-1 focus-within:ring-2 focus-within:ring-red-500/50",
                darkMode ? "bg-white/5 ring-white/10" : "bg-white ring-black/5"
            )}>
                <div className={clsx("rounded-xl p-4 transition-colors", darkMode ? "bg-[#1A1A1A]" : "bg-gray-50")}>
                    <textarea
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        placeholder="Type a note... (will be timestamped at current video time)"
                        className={clsx(
                            "w-full bg-transparent border-0 resize-none h-24 p-0 text-base focus:ring-0",
                            darkMode ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-400"
                        )}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSave();
                            }
                        }}
                    />
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-dashed border-gray-200 dark:border-gray-700">
                        <span className="text-xs text-gray-400">Press Enter to save</span>
                        <button
                            onClick={handleSave}
                            disabled={!noteInput.trim()}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 font-medium text-sm"
                        >
                            <Save size={16} />
                            Save
                        </button>
                    </div>
                </div>
            </div>

            {/* Notes List */}
            <div className="space-y-4">
                <AnimatePresence mode='popLayout'>
                    {notes.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl"
                        >
                            <StickyNote size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                            <p className="text-gray-500 text-sm">No notes yet. Start typing above!</p>
                        </motion.div>
                    ) : (
                        notes.map((note, idx) => (
                            <motion.div
                                key={note.date + idx} // fallback key
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                layout
                                className={clsx(
                                    "group relative p-5 rounded-2xl border transition-all hover:shadow-xl",
                                    darkMode
                                        ? "bg-white/5 border-white/5 hover:bg-white/10"
                                        : "bg-white border-gray-100 hover:border-red-100"
                                )}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    {note.timestampSeconds != null && (
                                        <button
                                            onClick={() => onJumpToTimestamp(note.timestampSeconds)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
                                        >
                                            <Clock size={12} />
                                            {formatTimestamp(note.timestampSeconds)}
                                        </button>
                                    )}
                                    <div className="ml-auto flex items-center gap-3">
                                        <span className={clsx("text-xs font-medium", darkMode ? "text-gray-500" : "text-gray-400")}>
                                            {new Date(note.date).toLocaleDateString()}
                                        </span>
                                        <button
                                            onClick={() => onDeleteNote(idx)}
                                            className={clsx(
                                                "p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all",
                                                darkMode ? "hover:bg-red-500/20 text-red-500" : "hover:bg-red-100 text-red-600"
                                            )}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <p className={clsx("text-base leading-relaxed whitespace-pre-wrap", darkMode ? "text-gray-200" : "text-gray-700")}>
                                    {note.text}
                                </p>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default NotesSection;
