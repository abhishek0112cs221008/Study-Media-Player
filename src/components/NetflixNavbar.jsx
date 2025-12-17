import React, { useState, useEffect } from 'react';
import { Search, Menu, X, Home, Library, FolderPlus, List, ChevronRight, Loader2, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import NotificationBadge from './NotificationBadge';

const Navbar = ({ onSearch, searchQuery, onLoadFolder, activeTab, setActiveTab, stats, onOpenThemeSelector }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) setIsScrolled(true);
            else setIsScrolled(false);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'courses', label: 'Courses', icon: Library },
        { id: 'list', label: 'My List', icon: List }
    ];

    return (
        <motion.nav
            layout
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className={clsx(
                "fixed z-50 flex items-center justify-between transition-all duration-300",
                // FLOATING PILL DESIGN always active (or mostly) for this specific look
                "top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl rounded-full px-5 py-2 bg-[#111]/90 backdrop-blur-xl border border-white/10 shadow-2xl"
            )}
        >

            {/* Logo - Red Bebas Style */}
            <div
                className="group relative cursor-pointer select-none flex items-center gap-2"
                onClick={() => setActiveTab('home')}
                aria-label="Go to Home"
            >
                <span className="relative text-3xl md:text-4xl font-normal tracking-tight text-[#E50914] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] font-['Bebas_Neue'] scale-y-105">
                    STUDYFLIX
                </span>
            </div>

            {/* Centered Desktop Links - Pill Container */}
            <div className="hidden md:flex items-center gap-1 bg-[#222]/50 p-1 rounded-full border border-white/5 backdrop-blur-md">
                {navLinks.map(link => {
                    const Icon = link.icon;
                    const isActive = activeTab === link.id;
                    return (
                        <button
                            key={link.id}
                            onClick={() => {
                                setActiveTab(link.id);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={clsx(
                                "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
                                isActive
                                    ? "bg-[#333] text-white shadow-sm"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                            aria-label={link.label}
                        >
                            <Icon size={16} className={clsx("transition-transform", isActive && "scale-105")} />
                            {link.label}
                            {link.id === 'list' && stats?.myListCount > 0 && (
                                <NotificationBadge count={stats.myListCount} pulse={false} />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                {/* Search Bar - Dark Pill */}
                <div className="hidden md:flex items-center bg-[#222]/80 border border-white/5 rounded-full px-3 py-1.5 w-64 focus-within:w-72 focus-within:bg-[#333] transition-all duration-300">
                    <input
                        type="text"
                        placeholder="Search courses..."
                        className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-500 w-full"
                        value={searchQuery}
                        onChange={(e) => onSearch(e.target.value)}
                    />
                    <Search size={18} className="text-gray-400" />
                </div>
                {/* Mobile Search Icon */}
                <button onClick={() => setShowSearch(!showSearch)} className="md:hidden text-gray-300 hover:text-white">
                    <Search size={22} />
                </button>


                {/* Theme Selector Button */}
                <button
                    onClick={onOpenThemeSelector}
                    className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-300"
                    title="Theme Options"
                >
                    <Palette size={20} />
                </button>

                {/* CTA Button: Get Started (Red) */}
                <button
                    onClick={async () => {
                        setIsLoading(true);
                        await onLoadFolder();
                        setIsLoading(false);
                    }}
                    disabled={isLoading}
                    className="hidden md:flex items-center gap-2 bg-[#E50914] hover:bg-[#ff0f1f] text-white px-5 py-2 rounded-full font-bold text-sm transition-all duration-300 shadow-[0_4px_15px_rgba(229,9,20,0.4)] hover:shadow-[0_6px_20px_rgba(229,9,20,0.6)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    {isLoading ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <FolderPlus size={18} />
                    )}
                    <span>{isLoading ? 'Loading...' : 'Get Started'}</span>
                    {!isLoading && <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                </button>

                {/* Mobile Menu Toggle */}
                <button className="md:hidden text-white p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="absolute top-full left-0 right-0 mt-4 bg-[#141414]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 flex flex-col gap-4 text-center md:hidden shadow-2xl overflow-hidden"
                    >
                        {/* Mobile Search Input */}
                        <div className="flex items-center bg-[#222] rounded-full px-4 py-3 border border-white/10">
                            <Search size={18} className="text-gray-400 mr-2" />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                className="bg-transparent border-none outline-none text-white w-full"
                                value={searchQuery}
                                onChange={(e) => onSearch(e.target.value)}
                            />
                        </div>


                        {navLinks.map(link => {
                            const Icon = link.icon;
                            return (
                                <button
                                    key={link.id + 'mobile'}
                                    onClick={() => {
                                        setActiveTab(link.id);
                                        setMobileMenuOpen(false);
                                    }}
                                    className={clsx(
                                        "flex items-center justify-center gap-3 p-3 rounded-xl transition-colors",
                                        activeTab === link.id ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <Icon size={20} />
                                    <span className="font-semibold text-lg">{link.label}</span>
                                </button>
                            );
                        })}
                        <div className="h-px bg-white/10 my-2" />
                        <button
                            onClick={() => { onLoadFolder(); setMobileMenuOpen(false); }}
                            className="bg-[#E50914] text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2"
                        >
                            <FolderPlus size={20} />
                            Get Started
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

        </motion.nav>
    );
};

export default Navbar;
