import React from 'react';

const ProgressRing = ({
    progress = 0,
    size = 48,
    strokeWidth = 3,
    className = ''
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className={`relative ${className}`} style={{ width: size, height: size }}>
            <svg className="progress-ring w-full h-full">
                {/* Background circle */}
                <circle
                    className="text-gray-700"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                {/* Progress circle */}
                <circle
                    className="progress-ring-circle text-[#E50914]"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    style={{
                        filter: 'drop-shadow(0 0 4px rgba(229, 9, 20, 0.5))'
                    }}
                />
            </svg>
            {/* Percentage text */}
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">
                    {Math.round(progress)}%
                </span>
            </div>
        </div>
    );
};

export default ProgressRing;
