import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize, Settings, Tv, Volume1, Check, ChevronRight, ChevronLeft } from 'lucide-react';
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

    // --- Stats / Quality State ---
    const [statsEnabled, setStatsEnabled] = useState(false);
    const [loop, setLoop] = useState(false);
    const [quality, setQuality] = useState('Auto'); // Mock Quality
    const [captionsSrc, setCaptionsSrc] = useState(null);
    const [droppedFrames, setDroppedFrames] = useState(0); // Simulation

    // --- Refs for Stats ---
    const frameCountRef = useRef(0);
    const lastTimeRef = useRef(performance.now());
    const fpsRef = useRef(0);

    // --- FPS Counter (Mock for Stats) ---
    useEffect(() => {
        let animId;
        const loopAnim = () => {
            const now = performance.now();
            frameCountRef.current++;
            if (now - lastTimeRef.current >= 1000) {
                fpsRef.current = frameCountRef.current;
                frameCountRef.current = 0;
                lastTimeRef.current = now;
                // Simulate random drop
                if (Math.random() > 0.95) setDroppedFrames(prev => prev + 1);
            }
            animId = requestAnimationFrame(loopAnim);
        };
        if (isPlaying) loopAnim();
        return () => cancelAnimationFrame(animId);
    }, [isPlaying]);

    // --- Context Menu Logic ---
    const [contextMenu, setContextMenu] = useState(null);
    const handleContextMenu = (e) => {
        e.preventDefault();
        const rect = wrapperRef.current.getBoundingClientRect();
        setContextMenu({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    // --- Subtitle Upload ---
    const handleSubtitleUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setCaptionsSrc(url);
            setShowSettings(false); // Close menu
        }
    };

    // --- Helper to Render Menu ---
    const [activeMenu, setActiveMenu] = useState('main'); // main, speed, quality, captions

    const renderSettingsMenu = () => {
        const menuClass = "absolute bottom-full right-0 mb-4 bg-[#18181B] backdrop-blur-2xl border border-white/10 rounded-xl w-64 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-30 overflow-hidden text-sm animate-fade-in-up";

        // --- Main Menu ---
        if (activeMenu === 'main') return (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={menuClass}>
                <div className="py-2">
                    {/* Loop Toggle */}
                    <button onClick={() => setLoop(!loop)} className="w-full flex items-center justify-between px-4 py-2 hover:bg-white/10 text-gray-200">
                        <div className="flex items-center gap-3">
                            <span className="opacity-70">Loop</span>
                        </div>
                        <span className={clsx("font-bold text-xs", loop ? "text-[var(--theme-primary)]" : "text-gray-500")}>{loop ? 'On' : 'Off'}</span>
                    </button>

                    {/* Speed */}
                    <button onClick={() => setActiveMenu('speed')} className="w-full flex items-center justify-between px-4 py-2 hover:bg-white/10 text-gray-200">
                        <div className="flex items-center gap-3">
                            <span className="opacity-70">Playback Speed</span>
                        </div>
                        <span className="text-gray-400 text-xs flex items-center gap-1">{speed}x <ChevronRight size={14} /></span>
                    </button>

                    {/* Quality */}
                    <button onClick={() => setActiveMenu('quality')} className="w-full flex items-center justify-between px-4 py-2 hover:bg-white/10 text-gray-200">
                        <div className="flex items-center gap-3">
                            <span className="opacity-70">Quality</span>
                        </div>
                        <span className="text-gray-400 text-xs flex items-center gap-1">{quality} <ChevronRight size={14} /></span>
                    </button>

                    {/* Captions */}
                    <button onClick={() => setActiveMenu('captions')} className="w-full flex items-center justify-between px-4 py-2 hover:bg-white/10 text-gray-200">
                        <div className="flex items-center gap-3">
                            <span className="opacity-70">Captions</span>
                        </div>
                        <span className="text-gray-400 text-xs flex items-center gap-1">{captionsSrc ? 'On' : 'Off'} <ChevronRight size={14} /></span>
                    </button>

                    <div className="h-px bg-white/10 my-1"></div>

                    {/* Stats */}
                    <button onClick={() => { setStatsEnabled(!statsEnabled); setShowSettings(false); }} className="w-full flex items-center justify-between px-4 py-2 hover:bg-white/10 text-gray-200">
                        <div className="flex items-center gap-3">
                            <span className="opacity-70">Stats for nerds</span>
                        </div>
                        <span className={clsx("font-bold text-xs", statsEnabled ? "text-[var(--theme-success)]" : "text-gray-500")}>{statsEnabled ? 'On' : 'Off'}</span>
                    </button>
                </div>
            </motion.div>
        );

        // --- Speed Menu ---
        if (activeMenu === 'speed') return (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={menuClass}>
                <div className="flex items-center px-4 py-3 border-b border-white/10 cursor-pointer hover:bg-white/5" onClick={() => setActiveMenu('main')}>
                    <ChevronLeft size={16} className="text-gray-400 mr-2" />
                    <span className="font-semibold text-white">Playback Speed</span>
                </div>
                <div className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
                    {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 4].map(s => (
                        <button key={s} onClick={() => { setSpeed(s); if (videoRef.current) videoRef.current.playbackRate = s; onSpeedChange?.(s); setActiveMenu('main'); }}
                            className="w-full text-left px-8 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center relative">
                            {speed === s && <Check size={14} className="absolute left-3 text-[var(--theme-primary)]" />}
                            {s === 1 ? 'Normal' : s}
                        </button>
                    ))}
                </div>
            </motion.div>
        );

        // --- Quality Menu ---
        if (activeMenu === 'quality') return (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={menuClass}>
                <div className="flex items-center px-4 py-3 border-b border-white/10 cursor-pointer hover:bg-white/5" onClick={() => setActiveMenu('main')}>
                    <ChevronLeft size={16} className="text-gray-400 mr-2" />
                    <span className="font-semibold text-white">Quality</span>
                </div>
                <div className="py-1">
                    {['Auto', '4K', '1440p', '1080p', '720p', '480p', '360p', '144p'].map(q => (
                        <button key={q} onClick={() => { setQuality(q); setActiveMenu('main'); }}
                            className="w-full text-left px-8 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center relative">
                            {quality === q && <Check size={14} className="absolute left-3 text-[var(--theme-primary)]" />}
                            {q} {q === 'Auto' && <span className="ml-1 text-[10px] text-blue-400">HD</span>}
                        </button>
                    ))}
                </div>
            </motion.div>
        );

        // --- Captions Menu ---
        if (activeMenu === 'captions') return (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={menuClass}>
                <div className="flex items-center px-4 py-3 border-b border-white/10 cursor-pointer hover:bg-white/5" onClick={() => setActiveMenu('main')}>
                    <ChevronLeft size={16} className="text-gray-400 mr-2" />
                    <span className="font-semibold text-white">Subtitles/CC</span>
                </div>
                <div className="py-1">
                    <button onClick={() => { setCaptionsSrc(null); setActiveMenu('main'); }}
                        className="w-full text-left px-8 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center relative">
                        {!captionsSrc && <Check size={14} className="absolute left-3 text-[var(--theme-primary)]" />}
                        Off
                    </button>

                    {/* Upload Custom */}
                    <label className="w-full text-left px-8 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center relative cursor-pointer">
                        {captionsSrc && <Check size={14} className="absolute left-3 text-[var(--theme-primary)]" />}
                        <span className="flex-1">Upload File (.vtt, .srt)</span>
                        <input type="file" accept=".vtt,.srt" onChange={handleSubtitleUpload} className="hidden" />
                    </label>
                </div>
            </motion.div>
        );
    };

    return (
        <div
            ref={wrapperRef}
            className="relative w-full bg-black group aspect-video rounded-[5px] overflow-hidden shadow-2xl select-none"
            onMouseMove={showControlsTemporarily}
            onMouseLeave={() => isPlaying && setShowControls(false)}
            onClick={(e) => {
                if (activeMenu !== 'main' && showSettings) setShowSettings(false);
                setContextMenu(null);
                // Call original logic
                window.innerWidth < 768 ? undefined : undefined;
            }}
            onContextMenu={handleContextMenu}
        >
            {/* Stats for Nurds Overlay */}
            {statsEnabled && videoRef.current && (
                <div className="absolute top-4 left-4 bg-black/80 p-4 rounded text-[10px] font-mono text-green-400 z-50 pointer-events-none border border-white/10 shadow-xl backdrop-blur-md">
                    <h4 className="font-bold text-white mb-2 underline decoration-gray-500">Stats for Nerds</h4>
                    <div className="grid grid-cols-[80px_1fr] gap-x-4 gap-y-1">
                        <span className="text-gray-400">Video ID:</span> <span>{lesson.name?.substring(0, 12) || 'local_file'}</span>
                        <span className="text-gray-400">Viewport:</span> <span>{wrapperRef.current?.clientWidth}x{wrapperRef.current?.clientHeight}</span>
                        <span className="text-gray-400">Resolution:</span> <span>{videoRef.current.videoWidth}x{videoRef.current.videoHeight}@{fpsRef.current}</span>
                        <span className="text-gray-400">Volume:</span> <span>{Math.round(volume * 100)}%</span>
                        <span className="text-gray-400">Buffer Health:</span> <span>{Math.round(buffered)}s</span>
                        <span className="text-gray-400">Dropped:</span> <span>{droppedFrames}</span>
                        <span className="text-gray-400">Codecs:</span> <span>avc1.640028 / mp4a.40.2 (mock)</span>
                    </div>
                    <div className="mt-2 text-white/50 border-t border-white/10 pt-1">
                        Display FPS: {Math.round(fpsRef.current)}
                    </div>
                </div>
            )}

            {/* Custom Right Click Menu */}
            {contextMenu && (
                <div
                    className="absolute z-50 bg-[#282828] py-2 rounded-lg shadow-black/50 shadow-2xl border border-white/5 w-48 animate-fade-in"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button onClick={() => { setLoop(!loop); setContextMenu(null); }} className="w-full text-left px-4 py-2 hover:bg-white/10 text-white text-sm flex items-center justify-between">
                        Loop {loop && <Check size={14} />}
                    </button>
                    <button onClick={() => { setStatsEnabled(!statsEnabled); setContextMenu(null); }} className="w-full text-left px-4 py-2 hover:bg-white/10 text-white text-sm flex items-center justify-between">
                        Stats for nerds {statsEnabled && <Check size={14} />}
                    </button>
                    <button onClick={() => { togglePiP(); setContextMenu(null); }} className="w-full text-left px-4 py-2 hover:bg-white/10 text-white text-sm">
                        Picture in Picture
                    </button>
                </div>
            )}

            {lesson.type === 'video' ? (
                <video
                    ref={videoRef}
                    src={lesson.url}
                    className="w-full h-full object-contain"
                    onTimeUpdate={handleTimeUpdateInternal}
                    onLoadedMetadata={handleLoadedMetadata}
                    onProgress={handleProgress}
                    onEnded={() => {
                        if (loop) {
                            videoRef.current.currentTime = 0;
                            videoRef.current.play();
                        } else {
                            onEnded && onEnded();
                        }
                    }}
                    onPlay={onPlayPause}
                    onPause={onPlayPause}
                    onClick={handleContainerClick}
                    volume={volume}
                    loop={loop}
                >
                    {captionsSrc && <track kind="captions" src={captionsSrc} label="Custom" default />}
                </video>
            ) : (
                <div
                    className="w-full h-full flex items-center justify-center bg-zinc-900 bg-[url('https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"
                    onClick={handleContainerClick}
                >
                    {/* Audio Player Logic Unchanged */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center mb-4 animate-pulse">
                            <Volume2 size={40} className="text-[var(--theme-primary)]" />
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
                            loop={loop}
                        />
                    </div>
                </div>
            )}

            {/* Mobile Big Play Button (Center) */}
            <AnimatePresence>
                {(!isPlaying || showControls) && !isDataLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                        <div className="spinner w-12 h-12 border-4 border-white/20 border-t-[var(--theme-primary)] rounded-full"></div>
                    </div>
                )}
            </AnimatePresence>

            {/* Controls Overlay */}
            <div className={clsx(
                "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 pb-4 pt-20 transition-opacity duration-300 z-20",
                showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
            )}>
                {/* Progress Bar */}
                <div
                    className="group/progress relative w-full h-1 bg-white/20 cursor-pointer transition-all duration-200 mb-4 touch-none"
                    onClick={handleSeek}
                >
                    {/* Buffered Progress */}
                    <div className="absolute inset-y-0 left-0 bg-white/10" style={{ width: `${buffered}%` }} />

                    {/* Current Progress Fill */}
                    <div
                        className="absolute inset-y-0 left-0 bg-[#E50914]"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                    >
                        {/* Red Scrubber Handle */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3.5 h-3.5 bg-[#E50914] rounded-full shadow-lg scale-100 group-hover/progress:scale-125 transition-transform" />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 md:gap-6">
                        {!isPlaying && (
                            <button onClick={togglePlay} className="text-white hover:text-[var(--theme-primary)] transition-colors p-2 -ml-2" aria-label="Play">
                                <Play size={28} fill="currentColor" className="rounded-[5px]" />
                            </button>
                        )}

                        <div className="flex items-center gap-4 md:gap-2">
                            {/* Rewind / Fast Forward */}
                            <button onClick={() => {
                                const v = videoRef.current;
                                if (v) v.currentTime -= 10;
                            }} className="text-white/70 hover:text-white transition-colors p-1" aria-label="Rewind 10 seconds">
                                <SkipBack size={24} className="md:w-5 md:h-5" />
                            </button>
                            <button onClick={() => {
                                const v = videoRef.current;
                                if (v) v.currentTime += 10;
                            }} className="text-white/70 hover:text-white transition-colors p-1" aria-label="Skip forward 10 seconds">
                                <SkipForward size={24} className="md:w-5 md:h-5" />
                            </button>
                        </div>

                        {/* Volume Control */}
                        <div className="flex items-center gap-2 group/vol">
                            <button onClick={() => {
                                const newVol = volume === 0 ? 1 : 0;
                                setVolume(newVol);
                                if (videoRef.current) videoRef.current.volume = newVol;
                                onVolumeChange?.(newVol);
                            }} className="text-white hover:text-white/80 transition-colors" aria-label={volume === 0 ? "Unmute" : "Mute"}>
                                {volume === 0 ? <VolumeX size={22} /> : volume < 0.5 ? <Volume1 size={22} /> : <Volume2 size={22} />}
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
                                className="w-0 overflow-hidden group-hover/vol:w-16 transition-all duration-300 h-1 accent-[#E50914] bg-white/20 rounded-lg appearance-none cursor-pointer"
                                aria-label="Volume control"
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
                                onClick={() => { setShowSettings(!showSettings); setActiveMenu('main'); }}
                                className={clsx("text-white/70 hover:text-white transition-colors p-2 rounded-full", showSettings && "bg-white/10 text-white")}
                                aria-label="Playback settings"
                            >
                                <Settings size={22} className={`md:w-5 md:h-5 transition-transform duration-500 ${showSettings ? 'rotate-90' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {showSettings && renderSettingsMenu()}
                            </AnimatePresence>
                        </div>

                        {lesson.type === 'video' && (
                            <button onClick={togglePiP} className="hidden md:block text-white/70 hover:text-white transition-colors" title="Picture-in-Picture" aria-label="Toggle Picture-in-Picture">
                                <Tv size={20} />
                            </button>
                        )}

                        <button onClick={toggleFullscreen} className="text-white/70 hover:text-white transition-colors p-2" title="Fullscreen" aria-label="Toggle Fullscreen">
                            <Maximize size={24} className="md:w-5 md:h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
