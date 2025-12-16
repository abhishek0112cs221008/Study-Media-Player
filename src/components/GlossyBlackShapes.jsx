import React from 'react';
import { motion } from 'framer-motion';

const GlossyBlackShapes = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* 1. Main Glossy Tube Loop - Primary Element */}
            <motion.div
                initial={{ rotate: 0, scale: 0.9 }}
                animate={{ rotate: 360, scale: 1.05 }}
                transition={{ rotate: { duration: 30, ease: "linear", repeat: Infinity }, scale: { duration: 8, repeat: Infinity, repeatType: "reverse" } }}
                className="absolute top-[15%] left-[25%] w-64 h-64 md:w-96 md:h-96 opacity-60"
            >
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                    <defs>
                        {/* Metallic Black Gradient for Tube Body */}
                        <linearGradient id="glossyMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#000000" />
                            <stop offset="30%" stopColor="#1a1a1a" />
                            <stop offset="45%" stopColor="#e5e5e5" /> {/* Highlight */}
                            <stop offset="55%" stopColor="#ffffff" /> {/* Specular */}
                            <stop offset="70%" stopColor="#1a1a1a" />
                            <stop offset="100%" stopColor="#000000" />
                        </linearGradient>
                    </defs>

                    {/* The Tube Shape */}
                    <path
                        d="M 30 50 C 30 20, 70 20, 70 50 C 70 80, 30 80, 30 50 Z"
                        fill="none"
                        stroke="url(#glossyMetal)"
                        strokeWidth="16"
                        strokeLinecap="round"
                        transform="rotate(45 50 50)"
                    />

                    {/* Inner highlight for extra gloss */}
                    <path
                        d="M 30 50 C 30 20, 70 20, 70 50 C 70 80, 30 80, 30 50 Z"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeOpacity="0.3"
                        transform="rotate(45 50 50) translate(-1, -1)"
                        className="blur-[1px]"
                    />
                </svg>
            </motion.div>

            {/* 2. Glossy Sphere - Subtle Accent */}
            <motion.div
                initial={{ y: 0 }}
                animate={{ y: -30 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 5, ease: "easeInOut" }}
                className="absolute top-[20%] right-[15%] w-20 h-20 md:w-28 md:h-28 opacity-40"
            >
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
                    <defs>
                        <radialGradient id="blackSphere" cx="35%" cy="35%" r="60%">
                            <stop offset="0%" stopColor="#999" /> {/* Highlight point */}
                            <stop offset="20%" stopColor="#333" />
                            <stop offset="100%" stopColor="#111" />
                        </radialGradient>
                    </defs>
                    <circle cx="50" cy="50" r="40" fill="url(#blackSphere)" />
                    {/* Specular Glint */}
                    <ellipse cx="35" cy="30" rx="12" ry="6" fill="white" opacity="0.6" transform="rotate(-45 35 30)" blur="1" />
                </svg>
            </motion.div>

            {/* 3. Spring Boot Leaf - Minimal Tech Accent */}
            <motion.div
                initial={{ rotate: 0, scale: 0.9 }}
                animate={{ rotate: 360, scale: 1.1 }}
                transition={{ rotate: { duration: 25, ease: "linear", repeat: Infinity }, scale: { duration: 4, repeat: Infinity, repeatType: "reverse" } }}
                className="absolute bottom-[20%] right-[20%] w-16 h-16 md:w-24 md:h-24 opacity-25 mix-blend-screen"
            >
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]">
                    <path d="M 50 10 Q 80 10 90 40 Q 90 80 50 90 Q 10 80 10 40 Q 20 10 50 10 Z" fill="#22c55e" opacity="0.9" />
                    <path d="M 50 20 Q 60 20 65 40 Q 65 60 50 70 Q 35 60 35 40 Q 40 20 50 20 Z" fill="#86efac" />
                </svg>
            </motion.div>

        </div>
    );
};

export default GlossyBlackShapes;
