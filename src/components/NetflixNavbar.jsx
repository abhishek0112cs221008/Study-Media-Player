import React, { useState, useEffect } from 'react';
import { Search, Menu, X, Home, Library, List, User, ChevronDown, FolderPlus } from 'lucide-react';
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
            className={clsx(
                "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16 transition-all duration-300",
                isScrolled ? "glass bg-[var(--theme-background)]/80 shadow-glow-red" : "bg-gradient-to-b from-[var(--theme-background)] to-transparent",
                "h-20" // Fixed height header
            )}
        >
            {/* Left Section: Logo & Links */}
            <div className="flex items-center gap-12">
                {/* Logo */}
                <div
                    className="cursor-pointer select-none"
                    onClick={() => setActiveTab('home')}
                >
                    <span className="text-2xl font-bold tracking-tight text-white drop-shadow-md font-sans">
                        prime <span className="text-[var(--theme-primary)]">study</span>
                    </span>
                </div>

                {/* Desktop Navigation Links (Centered-ish) */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map(link => {
                        const isActive = activeTab === link.id;
                        return (
                            <button
                                key={link.id}
                                onClick={() => {
                                    setActiveTab(link.id);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className={clsx(
                                    "relative text-lg font-semibold transition-colors duration-200",
                                    isActive ? "text-white" : "text-[var(--theme-text-secondary)] hover:text-white"
                                )}
                            >
                                {link.label}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute -bottom-7 left-0 right-0 h-[3px] bg-white rounded-t-sm"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Right Section: Actions */}
            <div className="flex items-center gap-6">
                {/* Search */}
                <div className="relative group">
                    <button
                        onClick={() => setShowSearch(!showSearch)}
                        className={clsx(
                            "text-[var(--theme-text-secondary)] hover:text-white transition-colors",
                            showSearch && "text-white"
                        )}
                    >
                        <Search size={22} strokeWidth={2.5} />
                    </button>
                    {showSearch && (
                        <div className="absolute right-0 top-12 w-72 glass bg-[var(--theme-background-elevated)] border border-[var(--theme-border)] rounded shadow-2xl p-2 animate-fade-in">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full bg-[var(--theme-background)] text-white px-3 py-2 rounded border border-transparent focus:border-[var(--theme-primary)] outline-none placeholder-[var(--theme-text-secondary)]"
                                value={searchQuery}
                                onChange={(e) => onSearch(e.target.value)}
                                autoFocus
                            />
                        </div>
                    )}
                </div>

                {/* User Profile - Simplified (No Theme Selector) */}
                <div className="hidden md:flex items-center gap-2 cursor-pointer text-[var(--theme-text-secondary)] hover:text-white transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-[var(--theme-background-elevated)] flex items-center justify-center border border-white/10 group-hover:border-white/30">
                        <User size={18} />
                    </div>
                    <ChevronDown size={14} />

                    {/* Simplified Dropdown */}
                    <div className="absolute top-12 right-20 w-48 glass bg-[var(--theme-background-elevated)] border border-[var(--theme-border)] rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 py-2">
                        <div className="px-4 py-2 text-xs font-bold text-[var(--theme-text-secondary)] uppercase tracking-wider">Profile</div>
                        <button className="w-full text-left px-4 py-2 text-white hover:bg-[var(--theme-background-elevated)] text-sm">
                            Account Settings
                        </button>
                    </div>
                </div>

                {/* Vertical Divider */}
                <div className="h-6 w-[1px] bg-white/20 hidden md:block"></div>

                {/* CTA Button: OPEN FOLDER */}
                <button
                    onClick={async () => {
                        setIsLoading(true);
                        await onLoadFolder();
                        setIsLoading(false);
                    }}
                    disabled={isLoading}
                    className="hidden md:flex items-center justify-center bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-dark)] text-white px-5 py-2.5 rounded-[4px] font-bold text-base transition-all shadow-lg hover:shadow-[var(--theme-primary)]/40 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Loading...' : 'Open Folder'}
                </button>

                {/* Mobile Menu */}
                <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 top-20 bg-[var(--theme-background)] z-40 overflow-y-auto md:hidden p-6"
                    >
                        {/* Mobile Links */}
                        <div className="flex flex-col gap-6">
                            {navLinks.map(link => (
                                <button
                                    key={link.id}
                                    onClick={() => {
                                        setActiveTab(link.id);
                                        setMobileMenuOpen(false);
                                    }}
                                    className={clsx(
                                        "text-xl font-bold flex items-center gap-4",
                                        activeTab === link.id ? "text-[var(--theme-primary)]" : "text-white"
                                    )}
                                >
                                    <link.icon size={24} />
                                    {link.label}
                                </button>
                            ))}

                            <hr className="border-gray-800 my-2" />

                            <button
                                onClick={() => { onLoadFolder(); setMobileMenuOpen(false); }}
                                className="w-full bg-[var(--theme-primary)] text-white py-3 rounded font-bold"
                            >
                                Try for free
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </motion.nav>
    );
};

export default Navbar;
