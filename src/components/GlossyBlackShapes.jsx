import React from 'react';
import { motion } from 'framer-motion';

const GlossyBlackShapes = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* 1. Pencil - Floating and Rotating */}
            <motion.div
                initial={{ rotate: -15, y: 0 }}
                animate={{ rotate: 15, y: -20 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 6, ease: "easeInOut" }}
                className="absolute top-[10%] left-[15%] w-32 h-32 md:w-48 md:h-48 opacity-50"
            >
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_10px_30px_rgba(255,182,193,0.3)]">
                    <defs>
                        <linearGradient id="pencilBody" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FFB6C1" />
                            <stop offset="50%" stopColor="#FF69B4" />
                            <stop offset="100%" stopColor="#C71585" />
                        </linearGradient>
                        <linearGradient id="pencilTip" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#8B4513" />
                            <stop offset="100%" stopColor="#654321" />
                        </linearGradient>
                    </defs>
                    {/* Pencil body */}
                    <rect x="20" y="30" width="60" height="12" fill="url(#pencilBody)" rx="2" transform="rotate(-30 50 50)" />
                    {/* Pencil tip */}
                    <polygon points="15,36 20,30 20,42" fill="url(#pencilTip)" transform="rotate(-30 50 50)" />
                    {/* Eraser */}
                    <rect x="78" y="30" width="8" height="12" fill="#FF6B9D" rx="1" transform="rotate(-30 50 50)" />
                    {/* Highlight */}
                    <rect x="25" y="32" width="40" height="3" fill="white" opacity="0.4" rx="1" transform="rotate(-30 50 50)" />
                </svg>
            </motion.div>

            {/* 2. Letter A - Rotating Slowly */}
            <motion.div
                initial={{ rotate: 0, scale: 0.95 }}
                animate={{ rotate: 360, scale: 1.05 }}
                transition={{ rotate: { duration: 40, ease: "linear", repeat: Infinity }, scale: { duration: 8, repeat: Infinity, repeatType: "reverse" } }}
                className="absolute top-[5%] right-[20%] w-24 h-24 md:w-36 md:h-36 opacity-40"
            >
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_20px_rgba(147,112,219,0.4)]">
                    <defs>
                        <linearGradient id="letterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#9370DB" />
                            <stop offset="50%" stopColor="#8A2BE2" />
                            <stop offset="100%" stopColor="#6A0DAD" />
                        </linearGradient>
                    </defs>
                    <text x="50" y="75" fontSize="70" fontWeight="bold" fill="url(#letterGrad)" textAnchor="middle" fontFamily="Arial, sans-serif">A</text>
                    <text x="50" y="75" fontSize="70" fontWeight="bold" fill="white" opacity="0.2" textAnchor="middle" fontFamily="Arial, sans-serif" transform="translate(-2, -2)">A</text>
                </svg>
            </motion.div>

            {/* 3. Ruler - Sliding Animation */}
            <motion.div
                initial={{ x: 0, rotate: 45 }}
                animate={{ x: 30, rotate: 50 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 7, ease: "easeInOut" }}
                className="absolute top-[40%] left-[5%] w-40 h-40 md:w-56 md:h-56 opacity-35"
            >
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_5px_20px_rgba(100,149,237,0.3)]">
                    <defs>
                        <linearGradient id="rulerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#87CEEB" />
                            <stop offset="50%" stopColor="#6495ED" />
                            <stop offset="100%" stopColor="#4169E1" />
                        </linearGradient>
                    </defs>
                    <rect x="30" y="20" width="8" height="60" fill="url(#rulerGrad)" rx="1" />
                    {/* Ruler markings */}
                    <line x1="30" y1="25" x2="35" y2="25" stroke="white" strokeWidth="0.5" opacity="0.8" />
                    <line x1="30" y1="35" x2="36" y2="35" stroke="white" strokeWidth="0.8" opacity="0.9" />
                    <line x1="30" y1="45" x2="35" y2="45" stroke="white" strokeWidth="0.5" opacity="0.8" />
                    <line x1="30" y1="55" x2="36" y2="55" stroke="white" strokeWidth="0.8" opacity="0.9" />
                    <line x1="30" y1="65" x2="35" y2="65" stroke="white" strokeWidth="0.5" opacity="0.8" />
                    <line x1="30" y1="75" x2="36" y2="75" stroke="white" strokeWidth="0.8" opacity="0.9" />
                </svg>
            </motion.div>

            {/* 4. Eraser - Bouncing */}
            <motion.div
                initial={{ y: 0, rotate: 0 }}
                animate={{ y: -25, rotate: 10 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 4, ease: "easeInOut" }}
                className="absolute bottom-[25%] left-[20%] w-20 h-20 md:w-28 md:h-28 opacity-45"
            >
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_10px_25px_rgba(255,105,180,0.3)]">
                    <defs>
                        <linearGradient id="eraserGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FF69B4" />
                            <stop offset="50%" stopColor="#FF1493" />
                            <stop offset="100%" stopColor="#C71585" />
                        </linearGradient>
                    </defs>
                    <rect x="30" y="35" width="40" height="25" fill="url(#eraserGrad)" rx="3" />
                    <rect x="30" y="35" width="40" height="8" fill="#FFB6C1" rx="2" />
                    <rect x="33" y="37" width="15" height="4" fill="white" opacity="0.5" rx="1" />
                </svg>
            </motion.div>

            {/* 5. Magnifying Glass - Rotating and Floating */}
            <motion.div
                initial={{ rotate: -10, scale: 0.9 }}
                animate={{ rotate: 10, scale: 1.1 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 5, ease: "easeInOut" }}
                className="absolute bottom-[15%] right-[25%] w-24 h-24 md:w-32 md:h-32 opacity-40"
            >
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_5px_20px_rgba(100,149,237,0.4)]">
                    <defs>
                        <radialGradient id="glassGrad" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#E0F7FF" />
                            <stop offset="70%" stopColor="#87CEEB" />
                            <stop offset="100%" stopColor="#4682B4" />
                        </radialGradient>
                    </defs>
                    {/* Glass circle */}
                    <circle cx="45" cy="40" r="20" fill="url(#glassGrad)" opacity="0.7" />
                    <circle cx="45" cy="40" r="20" fill="none" stroke="#4169E1" strokeWidth="3" />
                    {/* Handle */}
                    <line x1="60" y1="55" x2="75" y2="70" stroke="#4169E1" strokeWidth="4" strokeLinecap="round" />
                    {/* Glint */}
                    <circle cx="38" cy="33" r="5" fill="white" opacity="0.8" />
                </svg>
            </motion.div>

            {/* 6. Cylindrical Container - Rotating */}
            <motion.div
                initial={{ rotate: 0, y: 0 }}
                animate={{ rotate: 360, y: -15 }}
                transition={{ rotate: { duration: 35, ease: "linear", repeat: Infinity }, y: { duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" } }}
                className="absolute top-[50%] right-[10%] w-28 h-28 md:w-40 md:h-40 opacity-50"
            >
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_15px_35px_rgba(147,112,219,0.3)]">
                    <defs>
                        <linearGradient id="cylinderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6A5ACD" />
                            <stop offset="30%" stopColor="#9370DB" />
                            <stop offset="50%" stopColor="#B19CD9" />
                            <stop offset="70%" stopColor="#9370DB" />
                            <stop offset="100%" stopColor="#6A5ACD" />
                        </linearGradient>
                        <radialGradient id="cylinderTop" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#B19CD9" />
                            <stop offset="100%" stopColor="#8A2BE2" />
                        </radialGradient>
                    </defs>
                    {/* Cylinder body */}
                    <rect x="35" y="30" width="30" height="45" fill="url(#cylinderGrad)" />
                    {/* Top ellipse */}
                    <ellipse cx="50" cy="30" rx="15" ry="6" fill="url(#cylinderTop)" />
                    {/* Bottom ellipse */}
                    <ellipse cx="50" cy="75" rx="15" ry="6" fill="#6A5ACD" />
                    {/* Highlight */}
                    <rect x="38" y="35" width="8" height="35" fill="white" opacity="0.2" rx="1" />
                </svg>
            </motion.div>

        </div>
    );
};

export default GlossyBlackShapes;
