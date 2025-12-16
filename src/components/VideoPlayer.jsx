import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize, Settings, Tv, Volume1 } from 'lucide-react';
import clsx from 'clsx';

const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
};

const VideoPlayer = ({
    lesson,
    autoPlay = false,
    initialTime = 0,
    onTimeUpdate,
    onEnded,
    savedVolume = 1,
    savedSpeed = 1,
    onVolumeChange,
    onSpeedChange
}) => {
    const videoRef = useRef(null);
    const wrapperRef = useRef(null);
    const controlsTimeoutRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [buffered, setBuffered] = useState(0);
    const [volume, setVolume] = useState(savedVolume);
    const [speed, setSpeed] = useState(savedSpeed);
    const [showControls, setShowControls] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    // Sync props
    useEffect(() => {
        setVolume(savedVolume);
    }, [savedVolume]);

    useEffect(() => {
        setSpeed(savedSpeed);
        if (videoRef.current) {
            videoRef.current.playbackRate = savedSpeed;
        }
    }, [savedSpeed]);

    useEffect(() => {
        if (videoRef.current) {
            if (initialTime > 0) {
                videoRef.current.currentTime = initialTime;
            }
            if (autoPlay) {
                const playPromise = videoRef.current.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => setIsPlaying(true))
                        .catch(() => setIsPlaying(false));
                }
            }
        }
    }, [lesson.url]); // When url changes

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
            setIsDataLoaded(true);
            // Apply initial time if needed and we haven't started playing yet
            if (initialTime > 0 && Math.abs(videoRef.current.currentTime - initialTime) > 1) {
                videoRef.current.currentTime = initialTime;
            }
        }
    };

    const handleTimeUpdateInternal = () => {
        if (videoRef.current) {
            const curr = videoRef.current.currentTime;
            setCurrentTime(curr);
            onTimeUpdate?.(curr, videoRef.current.duration);
        }
    };

    const handleProgress = () => {
        if (videoRef.current && videoRef.current.buffered.length > 0) {
            const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
            setBuffered((bufferedEnd / videoRef.current.duration) * 100);
        }
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    const onPlayPause = (e) => {
        const isPaused = e.target.paused;
        setIsPlaying(!isPaused);
    };

    const handleSeek = (e) => {
        if (!videoRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        videoRef.current.currentTime = percent * videoRef.current.duration;
    };

    const showControlsTemporarily = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        if (isPlaying) {
            controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 2500);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Don't trigger if typing in inputs
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

            showControlsTemporarily();
            if (!videoRef.current) return;

            switch (e.key.toLowerCase()) {
                case ' ':
                case 'k':
                    e.preventDefault();
                    togglePlay();
                    break;
                case 'arrowright':
                case 'l':
                    e.preventDefault();
                    videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 10);
                    break;
                case 'arrowleft':
                case 'j':
                    e.preventDefault();
                    videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
                    break;
                case 'arrowup':
                    e.preventDefault();
                    const newVolUp = Math.min(1, volume + 0.1);
                    setVolume(newVolUp);
                    videoRef.current.volume = newVolUp;
                    onVolumeChange?.(newVolUp);
                    break;
                case 'arrowdown':
                    e.preventDefault();
                    const newVolDown = Math.max(0, volume - 0.1);
                    setVolume(newVolDown);
                    videoRef.current.volume = newVolDown;
                    onVolumeChange?.(newVolDown);
                    break;
                case 'f':
                    e.preventDefault();
                    toggleFullscreen();
                    break;
                case 'm':
                    e.preventDefault();
                    const targetVol = volume === 0 ? 1 : 0;
                    setVolume(targetVol);
                    videoRef.current.volume = targetVol;
                    onVolumeChange?.(targetVol);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [volume, isPlaying]);

    const toggleFullscreen = () => {
        if (!wrapperRef.current) return;
        if (!document.fullscreenElement) {
            wrapperRef.current.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
    };

    const togglePiP = async () => {
        if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
        } else if (videoRef.current) {
            await videoRef.current.requestPictureInPicture();
        }
    };

    // Double tap state
    const lastTapRef = useRef(0);
    const tapTimeoutRef = useRef(null);

    const handleContainerClick = (e) => {
        const now = Date.now();
        const DOUBLE_TAP_DELAY = 300;

        if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
            // Double tap detected
            const rect = wrapperRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;

            if (x < rect.width / 3) {
                // Left side double tap - Seek back
                if (videoRef.current) {
                    videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
                    showControlsTemporarily();
                }
            } else if (x > (rect.width * 2) / 3) {
                // Right side double tap - Seek forward
                if (videoRef.current) {
                    videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 10);
                    showControlsTemporarily();
                }
            } else {
                // Center double tap - Toggle Fullscreen
                toggleFullscreen();
            }
            lastTapRef.current = 0; // Reset
            if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
        } else {
            // Single tap - wait to see if it becomes a double tap
            if (window.innerWidth < 768) { // Only on mobile
                lastTapRef.current = now;
                // Don't toggle play immediately on mobile, let controls handle it or center button
                showControlsTemporarily();
                // Optional: Delay togglePlay if we want to separate single tap from double tap strictly
            } else {
                togglePlay(); // On desktop, click toggles play immediately
            }
        }
    };

    return (
        <div
            ref={wrapperRef}
            className="relative w-full bg-black group aspect-video rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 [&:fullscreen]:rounded-none [&:fullscreen]:ring-0 [&:fullscreen]:w-screen [&:fullscreen]:h-screen select-none"
            onMouseMove={showControlsTemporarily}
            onMouseLeave={() => isPlaying && setShowControls(false)}
            onClick={window.innerWidth < 768 ? undefined : undefined} // Handled by video click on desktop usually, but let's override
        >
            {lesson.type === 'video' ? (
                <video
                    ref={videoRef}
                    src={lesson.url}
                    className="w-full h-full object-contain"
                    onTimeUpdate={handleTimeUpdateInternal}
                    onLoadedMetadata={handleLoadedMetadata}
                    onProgress={handleProgress}
                    onEnded={onEnded}
                    onPlay={onPlayPause}
                    onPause={onPlayPause}
                    onClick={handleContainerClick} // Handle click/tap logic here
                    volume={volume}
                />
            ) : (
                <div
                    className="w-full h-full flex items-center justify-center bg-zinc-900 bg-[url('https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"
                    onClick={handleContainerClick}
                >
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center mb-4 animate-pulse">
                            <Music size={40} className="text-red-500" />
                        </div>
                        <h2 className="text-white text-xl font-medium px-4 text-center">{lesson.name}</h2>
                        <audio
                            ref={videoRef}
                            src={lesson.url}
                            onTimeUpdate={handleTimeUpdateInternal}
                            onLoadedMetadata={handleLoadedMetadata}
                            onEnded={onEnded}
                            onPlay={onPlayPause}
                            onPause={onPlayPause}
                        />
                    </div>
                </div>
            )}

            {/* Mobile Big Play Button (Center) */}
            <AnimatePresence>
                {(!isPlaying || showControls) && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                    >
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 shadow-2xl">
                            {isPlaying ? <Pause size={32} className="text-white fill-white" /> : <Play size={32} className="text-white fill-white ml-2" />}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Controls Overlay */}
            <div className={clsx(
                "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 pb-4 pt-20 transition-opacity duration-300 z-20",
                showControls ? "opacity-100" : "opacity-0 pointer-events-none"
            )}>
                {/* Progress Bar */}
                <div
                    className="group/progress relative w-full h-2 md:h-1.5 bg-white/20 rounded-full cursor-pointer hover:h-3 md:hover:h-2.5 transition-all duration-200 mb-6 md:mb-4 touch-none"
                    onClick={handleSeek}
                >
                    <div className="absolute inset-0 bg-white/10 rounded-full" style={{ width: `${buffered}%` }} />
                    <div className="absolute inset-0 bg-red-600 rounded-full flex items-center justify-end" style={{ width: `${(currentTime / duration) * 100}%` }}>
                        <div className="w-4 h-4 md:w-3.5 md:h-3.5 bg-white rounded-full shadow-md opacity-100 md:opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 md:gap-6">
                        <button onClick={togglePlay} className="text-white hover:text-red-500 transition-colors p-2 -ml-2">
                            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
                        </button>

                        <div className="flex items-center gap-4 md:gap-2">
                            <button onClick={() => {
                                const v = videoRef.current;
                                if (v) v.currentTime -= 10;
                            }} className="text-white/70 hover:text-white transition-colors p-1">
                                <SkipBack size={24} className="md:w-5 md:h-5" />
                            </button>
                            <button onClick={() => {
                                const v = videoRef.current;
                                if (v) v.currentTime += 10;
                            }} className="text-white/70 hover:text-white transition-colors p-1">
                                <SkipForward size={24} className="md:w-5 md:h-5" />
                            </button>
                        </div>

                        {/* Volume - Hidden on small mobile */}
                        <div className="hidden md:flex items-center gap-2 group/vol">
                            <button onClick={() => {
                                const newVol = volume === 0 ? 1 : 0;
                                setVolume(newVol);
                                if (videoRef.current) videoRef.current.volume = newVol;
                                onVolumeChange?.(newVol);
                            }} className="text-white/80 hover:text-white">
                                {volume === 0 ? <VolumeX size={20} /> : volume < 0.5 ? <Volume1 size={20} /> : <Volume2 size={20} />}
                            </button>
                            <input
                                type="range"
                                min="0" max="1" step="0.05"
                                value={volume}
                                onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    setVolume(val);
                                    if (videoRef.current) videoRef.current.volume = val;
                                    onVolumeChange?.(val);
                                }}
                                className="w-0 overflow-hidden group-hover/vol:w-20 transition-all duration-300 h-1 accent-red-500 bg-white/20 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        {/* Time Display */}
                        <span className="text-xs font-mono text-white/70 ml-2">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="relative">
                            <button
                                onClick={() => setShowSettings(!showSettings)}
                                className={clsx("text-white/70 hover:text-white transition-colors p-2 rounded-full", showSettings && "bg-white/10 text-white")}
                            >
                                <Settings size={22} className="md:w-5 md:h-5" />
                            </button>

                            <AnimatePresence>
                                {showSettings && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute bottom-full right-0 mb-3 bg-[#1e1e1e]/95 backdrop-blur-xl border border-white/10 rounded-xl p-2 w-32 shadow-2xl z-20"
                                    >
                                        <div className="text-xs font-semibold text-gray-400 px-3 py-2 uppercase tracking-wider">Speed</div>
                                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map(s => (
                                            <button
                                                key={s}
                                                className={clsx(
                                                    "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                                                    speed === s ? "bg-red-500 text-white font-medium" : "text-gray-300 hover:bg-white/10"
                                                )}
                                                onClick={() => {
                                                    setSpeed(s);
                                                    if (videoRef.current) videoRef.current.playbackRate = s;
                                                    onSpeedChange?.(s);
                                                    setShowSettings(false);
                                                }}
                                            >
                                                {s}x
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {lesson.type === 'video' && (
                            <button onClick={togglePiP} className="hidden md:block text-white/70 hover:text-white transition-colors" title="Picture-in-Picture">
                                <Tv size={20} />
                            </button>
                        )}

                        <button onClick={toggleFullscreen} className="text-white/70 hover:text-white transition-colors p-2" title="Fullscreen">
                            <Maximize size={24} className="md:w-5 md:h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
