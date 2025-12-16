import React from 'react';
import { motion } from 'framer-motion';

const NotificationBadge = ({
    count = 0,
    max = 99,
    showZero = false,
    pulse = true,
    className = ''
}) => {
    if (!showZero && count === 0) return null;

    const displayCount = count > max ? `${max}+` : count;

    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute -top-1 -right-1 ${className}`}
        >
            <div className={`
                min-w-[18px] h-[18px] 
                bg-gradient-to-br from-[#E50914] to-[#b81d24]
                rounded-full 
                flex items-center justify-center 
                text-[10px] font-bold text-white
                px-1.5
                shadow-glow-red
                border border-white/20
                ${pulse ? 'pulse-glow' : ''}
            `}>
                {displayCount}
            </div>
        </motion.div>
    );
};

export default NotificationBadge;
