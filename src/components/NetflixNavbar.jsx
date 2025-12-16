import React, { useState, useEffect } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const Navbar = ({ onSearch, searchQuery, onLoadFolder, activeTab, setActiveTab }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) setIsScrolled(true);
            else setIsScrolled(false);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { id: 'home', label: 'Home' },
        { id: 'courses', label: 'Courses' },
        { id: 'folder', label: 'Open Folder', action: onLoadFolder },
        { id: 'list', label: 'My List' }
    ];

    return (
        <nav className={clsx(
            "fixed top-0 w-full z-50 transition-all duration-500 px-4 md:px-12 py-4 flex items-center justify-between",
            isScrolled ? "bg-[#141414] shadow-lg" : "bg-gradient-to-b from-black/90 to-transparent"
        )}>

            <div className="flex items-center gap-12">
                {/* Logo */}
                <div
                    className="text-2xl md:text-3xl font-black tracking-tighter text-[#E50914] cursor-pointer select-none hover:scale-105 transition-transform drop-shadow-md"
                    onClick={() => setActiveTab('home')}
                >
                    STUDYFLIX
                </div>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
                    {navLinks.map(link => (
                        <button
                            key={link.id}
                            onClick={() => {
                                if (link.action) {
                                    link.action();
                                } else {
                                    setActiveTab(link.id);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }
                            }}
                            className={clsx(
                                "transition-colors hover:text-white relative py-1",
                                activeTab === link.id ? "text-white font-bold" : ""
                            )}
                        >
                            {link.label}
                            {activeTab === link.id && (
                                <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E50914]" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-6 text-white">
                {/* Search Bar */}
                <div className={clsx(
                    "flex items-center transition-all duration-300 overflow-hidden",
                    showSearch ? "bg-black/50 border border-white/50 px-2 py-1 rounded gap-2 w-48 md:w-64" : "w-6 bg-transparent"
                )}>
                    <button onClick={() => setShowSearch(!showSearch)} className="shrink-0 hover:scale-110 transition-transform">
                        <Search size={22} className="text-white" />
                    </button>
                    <AnimatePresence>
                        {showSearch && (
                            <motion.input
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                type="text"
                                placeholder="Titles, people, genres"
                                className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-400 w-full min-w-0"
                                value={searchQuery}
                                onChange={(e) => onSearch(e.target.value)}
                                autoFocus
                            />
                        )}
                    </AnimatePresence>
                </div>

                {/* Mobile Menu Toggle */}
                <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -20, height: 0 }}
                        className="absolute top-16 left-0 right-0 bg-[#141414] border-t border-gray-800 p-6 flex flex-col gap-6 text-center md:hidden shadow-2xl"
                    >
                        {navLinks.map(link => (
                            <button
                                key={link.id + 'mobile'}
                                onClick={() => {
                                    if (link.action) link.action();
                                    else setActiveTab(link.id);
                                    setMobileMenuOpen(false);
                                }}
                                className={clsx(
                                    "text-gray-300 hover:text-white font-bold text-lg",
                                    activeTab === link.id ? "text-white" : ""
                                )}
                            >
                                {link.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

        </nav>
    );
};

export default Navbar;
