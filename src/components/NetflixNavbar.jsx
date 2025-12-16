import React, { useState, useEffect } from 'react';
import { Search, Menu, X, Home, Library, FolderPlus, List, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import NotificationBadge from './NotificationBadge';

const Navbar = ({ onSearch, searchQuery, onLoadFolder, activeTab, setActiveTab, stats }) => {
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
                "fixed z-50 flex items-center justify-between",
                isScrolled || mobileMenuOpen
                    ? "top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl rounded-full px-6 py-4 bg-[#141414]/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                    : "top-0 left-0 w-full rounded-none px-4 md:px-12 py-6 bg-gradient-to-b from-black/80 to-transparent border-transparent"
            )}
        >

            {/* Logo */}
            <div
                className="group relative cursor-pointer select-none flex items-center gap-2"
                onClick={() => setActiveTab('home')}
            >
                <div className="absolute -inset-4 bg-red-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative text-xl md:text-2xl font-black tracking-tighter text-[#E50914] drop-shadow-md font-nasa">
                    STUDYFLIX
                </span>
            </div>

            {/* Centered Desktop Links */}
            <div className="hidden md:flex items-center gap-1 bg-white/5 p-1.5 rounded-full border border-white/5 backdrop-blur-sm">
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
                                "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2",
                                isActive ? "text-white bg-white/10 shadow-inner" : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Icon size={16} className={clsx("transition-transform", isActive && "scale-110")} />
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
                {/* Search Toggle */}
                <div className={clsx(
                    "flex items-center transition-all duration-300 overflow-hidden rounded-full",
                    showSearch ? "glass border-glow-hover pl-3 pr-1 py-1 w-48 md:w-64" : "w-10 h-10 justify-center hover:bg-white/10 rounded-full cursor-pointer"
                )}>
                    <AnimatePresence>
                        {showSearch && (
                            <motion.input
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                type="text"
                                placeholder="Search courses..."
                                className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-400 w-full min-w-0 mr-2 focus:placeholder-gray-500"
                                value={searchQuery}
                                onChange={(e) => onSearch(e.target.value)}
                                autoFocus
                            />
                        )}
                    </AnimatePresence>
                    <button onClick={() => setShowSearch(!showSearch)} className="shrink-0 text-gray-300 hover:text-white transition-colors">
                        <Search size={20} />
                    </button>
                </div>

                {/* CTA Button: Add Folder */}
                <button
                    onClick={async () => {
                        setIsLoading(true);
                        await onLoadFolder();
                        setIsLoading(false);
                    }}
                    disabled={isLoading}
                    className="hidden md:flex items-center gap-2 bg-[#E50914] hover:bg-[#b81d24] text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 shadow-glow-red hover:shadow-glow-red-lg hover:scale-105 active:scale-95 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer opacity-0 group-hover:opacity-100"></div>
                    {isLoading ? (
                        <Loader2 size={18} className="relative z-10 spinner" />
                    ) : (
                        <FolderPlus size={18} className="relative z-10" />
                    )}
                    <span className="relative z-10">{isLoading ? 'Loading...' : 'Get Started'}</span>
                    {!isLoading && <ChevronRight size={16} className="opacity-70 group-hover:translate-x-1 transition-transform relative z-10" />}
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
