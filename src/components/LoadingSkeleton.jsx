import React from 'react';

const LoadingSkeleton = ({ type = 'card', count = 1, className = '' }) => {
    const renderCardSkeleton = () => (
        <div className={`relative min-w-[240px] md:min-w-[300px] ${className}`}>
            <div className="h-36 md:h-48 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 p-[1px] animate-pulse">
                <div className="h-full w-full bg-[#181818] rounded-[7px] relative overflow-hidden border border-white/5">
                    {/* Skeleton shimmer overlay */}
                    <div className="absolute inset-0 shimmer"></div>

                    {/* Content placeholder */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                        <div className="w-14 h-14 rounded-full bg-white/5 mb-3 animate-pulse"></div>
                        <div className="w-3/4 h-4 bg-white/5 rounded animate-pulse"></div>
                        <div className="w-1/2 h-3 bg-white/5 rounded mt-2 animate-pulse"></div>
                    </div>

                    {/* Type badge placeholder */}
                    <div className="absolute top-3 right-3 w-12 h-5 bg-white/5 rounded animate-pulse"></div>
                </div>
            </div>
        </div>
    );

    const renderRowSkeleton = () => (
        <div className={`w-full ${className}`}>
            <div className="h-8 w-48 bg-white/5 rounded mb-6 animate-pulse"></div>
            <div className="flex gap-6">
                {Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx}>{renderCardSkeleton()}</div>
                ))}
            </div>
        </div>
    );

    const renderCircleSkeleton = () => (
        <div className={`w-12 h-12 rounded-full bg-white/5 animate-pulse ${className}`}>
            <div className="absolute inset-0 shimmer rounded-full"></div>
        </div>
    );

    const skeletonTypes = {
        card: renderCardSkeleton,
        row: renderRowSkeleton,
        circle: renderCircleSkeleton
    };

    const SkeletonComponent = skeletonTypes[type] || renderCardSkeleton;

    return (
        <>
            {Array.from({ length: count }).map((_, idx) => (
                <React.Fragment key={idx}>
                    <SkeletonComponent />
                </React.Fragment>
            ))}
        </>
    );
};

export default LoadingSkeleton;
