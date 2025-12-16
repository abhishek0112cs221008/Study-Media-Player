import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Tooltip = ({
    children,
    content,
    position = 'top',
    delay = 200,
    className = ''
}) => {
    const [isVisible, setIsVisible] = useState(false);
    let timeoutId;

    const handleMouseEnter = () => {
        timeoutId = setTimeout(() => setIsVisible(true), delay);
    };

    const handleMouseLeave = () => {
        clearTimeout(timeoutId);
        setIsVisible(false);
    };

    const positions = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2'
    };

    const arrows = {
        top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900',
        bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-900',
        left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-900',
        right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-900'
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            <AnimatePresence>
                {isVisible && content && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: position === 'top' ? 5 : -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className={`absolute ${positions[position]} z-50 pointer-events-none ${className}`}
                    >
                        <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-premium-lg border border-white/10 backdrop-blur-sm whitespace-nowrap">
                            {content}
                            <div className={`absolute w-0 h-0 border-4 ${arrows[position]}`}></div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Tooltip;
