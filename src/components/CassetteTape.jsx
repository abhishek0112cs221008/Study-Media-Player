import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Plus } from 'lucide-react';

const CassetteTape = ({ title, active = false, progress = 0 }) => {
    // Generate random rotation for spools to make them look distinct
    const rotationA = useMemo(() => Math.random() * 360, []);
    const rotationB = useMemo(() => Math.random() * 360, []);

    return (
        <div className={clsx(
            "relative w-full aspect-[1.6] bg-[#1a1a1a] rounded-[10px] shadow-xl overflow-hidden select-none",
            "border-2 border-[#2a2a2a]",
            "group/tape"
        )}>
            {/* 4 Screws in corners */}
            {[
                "top-1.5 left-1.5",
                "top-1.5 right-1.5",
                "bottom-1.5 left-1.5",
                "bottom-1.5 right-1.5"
            ].map((pos, i) => (
                <div key={i} className={`absolute ${pos} w-2 h-2 rounded-full bg-gray-400 flex items-center justify-center shadow-inner z-20`}>
                    <Plus size={6} className="text-gray-600 rotate-45" strokeWidth={3} />
                </div>
            ))}

            {/* Main Sticker/Label Area */}
            <div className="absolute inset-[6px] rounded-[6px] overflow-hidden flex flex-col z-10">

                {/* Top Header (Dark Grey) */}
                <div className="h-[25%] bg-[#262626] border-b border-white/10 flex items-center px-4 relative">
                    <div className="flex-1">
                        {/* Handwriting Font Line */}
                        <div className="w-full h-[1px] bg-white/10 absolute top-3 left-0 right-0"></div>
                        <div className="w-full h-[1px] bg-white/10 absolute top-5 left-0 right-0"></div>

                        <h3 className="relative z-10 text-[10px] sm:text-xs font-bold text-gray-200 line-clamp-1 font-mono tracking-tight" style={{ fontFamily: 'Courier New, monospace' }}>
                            {title || "Untitled Mix"}
                        </h3>
                    </div>
                    <span className="text-[8px] font-bold text-gray-500 ml-2 border border-gray-600 px-1 rounded">A</span>
                </div>

                {/* Middle Section (Black) */}
                <div className="flex-1 bg-[#121212] relative flex items-center justify-center p-2">

                    {/* Dark Transparent Window */}
                    <div className="w-[80%] h-[70%] bg-[#000000] rounded-full border border-gray-800 relative flex items-center justify-between px-3 shadow-inner">

                        {/* Left Spool */}
                        <motion.div
                            animate={active ? { rotate: 360 } : { rotate: rotationA }}
                            transition={active ? { duration: 4, repeat: Infinity, ease: "linear" } : { duration: 0 }}
                            className="w-8 h-8 md:w-10 md:h-10 bg-[#e5e5e5] rounded-full flex items-center justify-center relative shadow-[0_0_5px_rgba(255,255,255,0.1)]"
                        >
                            {/* Tape content visual */}
                            <div className="absolute inset-0.5 rounded-full border-[3px] border-[#1a1a1a]"></div>
                            {/* Spool teeth */}
                            <div className="w-full h-1 bg-gray-400 absolute rotate-0"></div>
                            <div className="w-full h-1 bg-gray-400 absolute rotate-45"></div>
                            <div className="w-full h-1 bg-gray-400 absolute rotate-90"></div>
                            <div className="w-full h-1 bg-gray-400 absolute rotate-135"></div>
                        </motion.div>

                        {/* Tape Window / Middle View */}
                        <div className="flex-1 h-3 md:h-4 bg-[#0a0a0a] mx-2 relative overflow-hidden ring-1 ring-white/5 rounded-sm">
                            {/* Tape remaining visual */}
                            <div className="absolute top-0 bottom-0 left-0 bg-[#333] w-full opacity-80"></div>
                        </div>

                        {/* Right Spool */}
                        <motion.div
                            animate={active ? { rotate: 360 } : { rotate: rotationB }}
                            transition={active ? { duration: 4, repeat: Infinity, ease: "linear" } : { duration: 0 }}
                            className="w-8 h-8 md:w-10 md:h-10 bg-[#e5e5e5] rounded-full flex items-center justify-center relative shadow-[0_0_5px_rgba(255,255,255,0.1)]"
                        >
                            <div className="absolute inset-0.5 rounded-full border-[3px] border-[#1a1a1a]"></div>
                            <div className="w-full h-1 bg-gray-400 absolute rotate-0"></div>
                            <div className="w-full h-1 bg-gray-400 absolute rotate-45"></div>
                            <div className="w-full h-1 bg-gray-400 absolute rotate-90"></div>
                            <div className="w-full h-1 bg-gray-400 absolute rotate-135"></div>
                        </motion.div>

                    </div>

                    {/* Side Label Text */}
                    <span className="absolute right-2 text-[8px] font-bold text-gray-600 opacity-60 rotate-0">90</span>
                </div>

                {/* Bottom Section (Charcoal) */}
                <div className="h-[20%] bg-[#1F1F1F] border-t border-white/5 flex items-center justify-center">
                    <span className="text-[7px] md:text-[8px] font-mono text-gray-500 tracking-widest font-bold">2x30min</span>
                </div>
            </div>

            {/* Trapezoid Head at Bottom */}
            <div className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 w-[60%] h-[12%] bg-[#1a1a1a] z-30 clip-path-trapezoid flex items-center justify-center gap-4">
                {/* Screw in head */}
                <div className="w-2 h-2 rounded-full bg-gray-500 border border-gray-600 flex items-center justify-center">
                    <Plus size={5} className="text-gray-300" strokeWidth={2} />
                </div>
                {/* Guide holes */}
                <div className="w-1.5 h-1.5 rounded-full bg-black shadow-inner"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-black shadow-inner"></div>
            </div>

            {/* Progress Overlay (Subtle) */}
            {progress > 0 && (
                <div className="absolute bottom-0 left-0 h-1 bg-[var(--theme-primary)] z-50 transition-all duration-300" style={{ width: `${progress}%` }}></div>
            )}

            {/* Hover Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500 z-40"></div>
        </div>
    );
};

export default CassetteTape;
