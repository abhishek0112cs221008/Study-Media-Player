import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Palette } from 'lucide-react';
import { themes } from '../utils/themeConfig';

const ThemeSelector = ({ currentTheme, onThemeChange, isOpen, onClose }) => {
    const themeArray = Object.values(themes);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />

                    {/* Theme Selector Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-[95%] max-w-2xl"
                    >
                        <div className="bg-[#1a1a1a]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                        <Palette size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Choose Your Theme</h2>
                                        <p className="text-sm text-gray-400">Personalize your study experience</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Theme Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {themeArray.map((theme) => {
                                    const isActive = currentTheme === theme.id;

                                    return (
                                        <motion.button
                                            key={theme.id}
                                            onClick={() => {
                                                onThemeChange(theme.id);
                                                setTimeout(onClose, 300);
                                            }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`relative group p-4 rounded-2xl border-2 transition-all duration-300 ${isActive
                                                    ? 'border-white/30 bg-white/5 shadow-lg'
                                                    : 'border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/5'
                                                }`}
                                        >
                                            {/* Color Preview Circle */}
                                            <div className="relative mb-3">
                                                <div
                                                    className="w-16 h-16 mx-auto rounded-full shadow-lg transition-all duration-300 group-hover:scale-110"
                                                    style={{
                                                        background: theme.gradient,
                                                        boxShadow: `0 8px 24px ${theme.glow}`,
                                                    }}
                                                />

                                                {/* Active Checkmark */}
                                                {isActive && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg"
                                                    >
                                                        <Check size={14} className="text-black" strokeWidth={3} />
                                                    </motion.div>
                                                )}
                                            </div>

                                            {/* Theme Info */}
                                            <div className="text-center">
                                                <h3 className={`font-bold text-sm mb-1 transition-colors ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                                                    }`}>
                                                    {theme.name}
                                                </h3>
                                                <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                                                    {theme.description}
                                                </p>
                                            </div>

                                            {/* Hover Glow Effect */}
                                            <div
                                                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"
                                                style={{
                                                    background: theme.gradient,
                                                    opacity: 0.1,
                                                }}
                                            />
                                        </motion.button>
                                    );
                                })}
                            </div>

                            {/* Footer Tip */}
                            <div className="mt-6 pt-4 border-t border-white/5">
                                <p className="text-xs text-gray-500 text-center">
                                    Your theme preference will be saved automatically
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ThemeSelector;
