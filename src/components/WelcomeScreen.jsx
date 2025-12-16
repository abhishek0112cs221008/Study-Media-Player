import React from 'react';
import { motion } from 'framer-motion';
import { Folder, PlayCircle, StickyNote, CheckCircle, BookOpen } from 'lucide-react';
import clsx from 'clsx';
import logo from '../assets/logo_white.png';

const WelcomeScreen = ({ onLoadFolder, darkMode }) => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 text-center max-w-2xl"
            >
                <div className="mb-10 relative">
                    <div className={clsx(
                        "w-32 h-32 mx-auto rounded-3xl flex items-center justify-center shadow-2xl rotate-3 transition-transform hover:rotate-6",
                        darkMode ? "bg-gradient-to-br from-white/10 to-white/5 border border-white/10" : "bg-white border border-gray-100"
                    )}>
                        <BookOpen size={48} className={darkMode ? "text-white" : "text-red-600"} />
                    </div>
                    {/* Floating Elements */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className={clsx("absolute -top-4 -right-12 p-3 rounded-2xl shadow-xl", darkMode ? "bg-black/50 backdrop-blur-md border border-white/10" : "bg-white border border-gray-100")}
                    >
                        <PlayCircle className="text-blue-500" size={24} />
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                        className={clsx("absolute -bottom-4 -left-12 p-3 rounded-2xl shadow-xl", darkMode ? "bg-black/50 backdrop-blur-md border border-white/10" : "bg-white border border-gray-100")}
                    >
                        <StickyNote className="text-yellow-500" size={24} />
                    </motion.div>
                </div>

                <h1 className={clsx("text-5xl font-bold mb-6 tracking-tight", darkMode ? "text-white" : "text-gray-900")}>
                    Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">Study Media Player</span>
                </h1>

                <p className={clsx("text-lg mb-10 leading-relaxed", darkMode ? "text-gray-400" : "text-gray-600")}>
                    The perfect environment for your local course videos, audio, and PDFs.
                    Organized, distraction-free, and beautiful.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onLoadFolder}
                        className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-full font-bold text-lg shadow-xl shadow-red-500/25 transition-all"
                    >
                        <Folder size={24} />
                        Open Course Folder
                    </motion.button>
                </div>

                <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
                    {[
                        { icon: PlayCircle, title: "Smart Player", desc: "Speed controls, PiP, and theater mode for efficient learning." },
                        { icon: StickyNote, title: "Contextual Notes", desc: "Take timestamped notes that jump back to the exact moment." },
                        { icon: CheckCircle, title: "Progress Tracking", desc: "Auto-tracks your progress across all your files." }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + (i * 0.1) }}
                            className={clsx(
                                "p-6 rounded-2xl border transition-colors hover:bg-white/5",
                                darkMode ? "border-white/5 bg-white/5" : "border-gray-100 bg-white"
                            )}
                        >
                            <item.icon className="text-red-500 mb-3" size={24} />
                            <h3 className={clsx("font-semibold mb-2", darkMode ? "text-white" : "text-gray-900")}>{item.title}</h3>
                            <p className={clsx("text-sm", darkMode ? "text-gray-400" : "text-gray-500")}>{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default WelcomeScreen;
