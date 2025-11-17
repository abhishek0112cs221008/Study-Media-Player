import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Search, Folder, Menu, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Settings, Maximize, Tv, CheckCircle, StickyNote, Save, Trash2, Clock, ChevronRight, PlayCircle, Music, FileText, Sun, Moon, ArrowUpDown, Check } from 'lucide-react';

const StudyApp = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [courses, setCourses] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [progress, setProgress] = useState({});
  const [notes, setNotes] = useState({});
  const [noteInput, setNoteInput] = useState('');
  const [expandedCourses, setExpandedCourses] = useState({});
  const [sortBy, setSortBy] = useState('name');
  const [filterType, setFilterType] = useState('all');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const [showControls, setShowControls] = useState(true);
  
  const videoRef = useRef(null);
  const directoryHandleRef = useRef(null);
  const videoWrapperRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showSettings || showSpeedMenu) {
        setShowSettings(false);
        setShowSpeedMenu(false);
      }
    };

    if (showSettings || showSpeedMenu) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showSettings, showSpeedMenu]);

  useEffect(() => {
    const saved = localStorage.getItem('studyAppState');
    if (saved) {
      const data = JSON.parse(saved);
      setProgress(data.progress || {});
      setNotes(data.notes || {});
      setVolume(data.volume || 1);
      setPlaybackSpeed(data.playbackSpeed || 1);
      setDarkMode(data.darkMode !== undefined ? data.darkMode : true);
      setSortBy(data.sortBy || 'name');
    }
  }, []);

  useEffect(() => {
    const data = { progress, notes, volume, playbackSpeed, darkMode, sortBy };
    localStorage.setItem('studyAppState', JSON.stringify(data));
  }, [progress, notes, volume, playbackSpeed, darkMode, sortBy]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = volume;
    video.playbackRate = playbackSpeed;
    video.muted = isMuted;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (currentLesson) {
        const prog = (video.currentTime / video.duration) * 100;
        setProgress(prev => ({ ...prev, [currentLesson.path]: prog }));
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      if (currentLesson && progress[currentLesson.path]) {
        const seekTime = (progress[currentLesson.path] / 100) * video.duration;
        if (seekTime > 5) video.currentTime = seekTime;
      }
    };

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        setBuffered((bufferedEnd / video.duration) * 100);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('progress', handleProgress);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('progress', handleProgress);
    };
  }, [currentLesson, volume, playbackSpeed, isMuted, progress]);

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleProgressClick = (e) => {
    const video = videoRef.current;
    if (!video) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    video.currentTime = percent * video.duration;
  };

  const skipBackward = () => {
    const video = videoRef.current;
    if (video) video.currentTime = Math.max(0, video.currentTime - 10);
  };

  const skipForward = () => {
    const video = videoRef.current;
    if (video) video.currentTime = Math.min(video.duration, video.currentTime + 10);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
      setIsMuted(!video.muted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    const video = videoRef.current;
    if (video) {
      video.volume = newVolume;
      setVolume(newVolume);
      if (newVolume > 0) setIsMuted(false);
    }
  };

  const changeSpeed = (speed) => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = speed;
      setPlaybackSpeed(speed);
      setShowSpeedMenu(false);
      setShowSettings(false);
    }
  };

  const toggleFullscreen = () => {
    const wrapper = videoWrapperRef.current;
    if (!wrapper) return;
    if (!document.fullscreenElement) {
      wrapper.requestFullscreen?.() || wrapper.webkitRequestFullscreen?.() || wrapper.msRequestFullscreen?.();
    } else {
      document.exitFullscreen?.() || document.webkitExitFullscreen?.() || document.msExitFullscreen?.();
    }
  };

  const requestPiP = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch (err) {
      console.log('PiP not supported:', err);
    }
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const video = videoRef.current;
      if (!video) return;

      switch(e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
        case 'j':
          e.preventDefault();
          skipBackward();
          break;
        case 'ArrowRight':
        case 'l':
          e.preventDefault();
          skipForward();
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleVolumeChange({ target: { value: Math.min(1, volume + 0.1) } });
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleVolumeChange({ target: { value: Math.max(0, volume - 0.1) } });
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          e.preventDefault();
          video.currentTime = (parseInt(e.key) / 10) * video.duration;
          break;
      }
      showControlsTemporarily();
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, volume]);

  const loadLocalFolder = async () => {
    try {
      if (!window.showDirectoryPicker) {
        alert('File System Access API not supported. Use Chrome or Edge.');
        return;
      }
      const dirHandle = await window.showDirectoryPicker();
      directoryHandleRef.current = dirHandle;
      const loadedCourses = await scanDirectory(dirHandle);
      setCourses(loadedCourses);
    } catch (err) {
      if (err.name !== 'AbortError') console.error('Error loading folder:', err);
    }
  };

  const scanDirectory = async (dirHandle, path = '') => {
    const courses = [];
    const lessons = [];

    for await (const entry of dirHandle.values()) {
      if (entry.kind === 'directory') {
        const subCourse = await scanDirectory(entry, `${path}/${entry.name}`);
        if (subCourse.length > 0) {
          courses.push({
            name: entry.name,
            path: `${path}/${entry.name}`,
            lessons: subCourse,
            handle: entry
          });
        }
      } else if (entry.kind === 'file') {
        const ext = entry.name.split('.').pop().toLowerCase();
        if (['mp4', 'mp3', 'pdf', 'webm', 'mkv', 'avi', 'mov', 'wav', 'ogg', 'm4a'].includes(ext)) {
          lessons.push({
            name: entry.name.replace(/\.[^/.]+$/, ""),
            type: getFileType(ext),
            file: entry,
            path: `${path}/${entry.name}`,
            extension: ext,
            source: 'local'
          });
        }
      }
    }
    return courses.length > 0 ? courses : lessons;
  };

  const getFileType = (ext) => {
    if (['mp4', 'webm', 'mkv', 'avi', 'mov'].includes(ext)) return 'video';
    if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext)) return 'audio';
    if (ext === 'pdf') return 'pdf';
    return 'unknown';
  };

  const loadLesson = async (lesson) => {
    setCurrentLesson(lesson);
    if (lesson.type === 'video' || lesson.type === 'audio') {
      const file = await lesson.file.getFile();
      const url = URL.createObjectURL(file);
      lesson.url = url;
    } else if (lesson.type === 'pdf') {
      const file = await lesson.file.getFile();
      const url = URL.createObjectURL(file);
      lesson.url = url;
    }
    setSidebarOpen(false);
  };

  const saveNote = () => {
    if (!noteInput.trim() || !currentLesson) return;
    const video = videoRef.current;
    let timestamp = null;
    let timestampSeconds = 0;
    
    if (video && !isNaN(video.currentTime)) {
      timestamp = formatTime(video.currentTime);
      timestampSeconds = video.currentTime;
    }

    const newNote = {
      text: noteInput,
      timestamp,
      timestampSeconds,
      date: new Date().toISOString()
    };

    setNotes(prev => ({
      ...prev,
      [currentLesson.path]: [...(prev[currentLesson.path] || []), newNote]
    }));
    setNoteInput('');
  };

  const deleteNote = (index) => {
    if (!currentLesson || !window.confirm('Delete this note?')) return;
    setNotes(prev => ({
      ...prev,
      [currentLesson.path]: prev[currentLesson.path].filter((_, i) => i !== index)
    }));
  };

  const jumpToTimestamp = (timestampSeconds) => {
    const video = videoRef.current;
    if (!video || !timestampSeconds) return;
    video.currentTime = timestampSeconds;
    video.play();
    setIsPlaying(true);
  };

  const toggleCourseExpand = (courseId) => {
    setExpandedCourses(prev => ({ ...prev, [courseId]: !prev[courseId] }));
  };

  const sortLessons = (lessons) => {
    let sorted = [...lessons];
    switch(sortBy) {
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'type':
        sorted.sort((a, b) => a.type.localeCompare(b.type));
        break;
      case 'progress':
        sorted.sort((a, b) => (progress[b.path] || 0) - (progress[a.path] || 0));
        break;
    }
    if (filterType !== 'all') {
      sorted = sorted.filter(lesson => lesson.type === filterType);
    }
    return sorted;
  };

  const renderLessons = (lessons) => {
    const sortedLessons = sortLessons(lessons);
    if (sortedLessons.length === 0) {
      return (
        <div className={`px-4 py-8 text-center text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          No lessons match the filter
        </div>
      );
    }
    
    return sortedLessons.map((lesson, idx) => {
      const isCompleted = progress[lesson.path] >= 90;
      const lessonProgress = progress[lesson.path] || 0;
      const Icon = isCompleted ? CheckCircle : lesson.type === 'video' ? PlayCircle : lesson.type === 'audio' ? Music : FileText;
      
      return (
        <div
          key={idx}
          className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-all ${
            currentLesson?.path === lesson.path 
              ? darkMode ? 'bg-white/10 text-white' : 'bg-black/5 text-black'
              : darkMode ? 'text-gray-400 hover:bg-white/5' : 'text-gray-600 hover:bg-black/[0.02]'
          }`}
          onClick={() => loadLesson(lesson)}
        >
          <Icon size={16} className={isCompleted ? 'text-green-500' : ''} />
          <span className="text-sm flex-1 truncate">{lesson.name}</span>
          {lessonProgress > 0 && lessonProgress < 90 && (
            <div className="w-16 h-1 bg-gray-700 dark:bg-gray-600 rounded-full overflow-hidden">
              <div className="h-full bg-red-600" style={{ width: `${lessonProgress}%` }} />
            </div>
          )}
        </div>
      );
    });
  };

  const renderCourses = () => {
    if (courses.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <Folder size={48} className="opacity-30 mb-4" />
          <p className={`mb-6 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No courses loaded</p>
          <button 
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-sm font-medium text-sm transition-colors"
            onClick={loadLocalFolder}
          >
            <Folder size={16} />
            LOAD FOLDER
          </button>
        </div>
      );
    }

    const filteredCourses = searchQuery
      ? courses.filter(course => course.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : courses;

    return filteredCourses.map((course, idx) => {
      const isExpanded = expandedCourses[course.path];
      const allLessons = Array.isArray(course.lessons[0]?.lessons)
        ? course.lessons.flatMap(m => m.lessons)
        : course.lessons;
      const totalLessons = allLessons.length;
      const completedLessons = allLessons.filter(l => progress[l.path] >= 90).length;

      return (
        <div key={idx} className={`border-b ${darkMode ? 'border-white/10' : 'border-black/10'}`}>
          <div 
            className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
              darkMode ? 'hover:bg-white/5' : 'hover:bg-black/[0.02]'
            }`}
            onClick={() => toggleCourseExpand(course.path)}
          >
            <Folder size={20} className={darkMode ? 'text-gray-300' : 'text-gray-700'} />
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-medium truncate ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {course.name}
              </div>
              <div className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {completedLessons}/{totalLessons} complete
              </div>
            </div>
            <ChevronRight 
              size={20} 
              className={`transition-transform ${isExpanded ? 'rotate-90' : ''} ${
                darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}
            />
          </div>
          {isExpanded && (
            <div className={darkMode ? 'bg-black/20' : 'bg-black/[0.01]'}>
              {renderLessons(allLessons)}
            </div>
          )}
        </div>
      );
    });
  };

  const currentNotes = currentLesson ? notes[currentLesson.path] || [] : [];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-[#f5f5f7] text-gray-900'}`}>
      <style>{`
        * { scrollbar-width: none; -ms-overflow-style: none; }
        *::-webkit-scrollbar { display: none; }
        *:focus { outline: none; }
        html { scroll-behavior: smooth; }
        * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
      `}</style>

      <div className={`fixed top-0 left-0 right-0 h-14 z-50 ${
        darkMode ? 'bg-black/80 border-white/10' : 'bg-white/80 border-black/10'
      } border-b backdrop-blur-2xl backdrop-saturate-150`}>
        <div className="flex items-center justify-between h-full px-5">
          <div className="flex items-center gap-5">
            <button 
              className={`p-2 rounded-full transition-all duration-200 ${darkMode ? 'hover:bg-white/10 active:scale-95' : 'hover:bg-black/5 active:scale-95'}`}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <div className="relative">
                <div className="w-9 h-7 bg-gradient-to-br from-red-700 via-red-700 to-rose-700 rounded-lg flex items-center justify-center shadow-xl shadow-red-500/40 group-hover:shadow-red-500/60 transition-all duration-300 group-hover:scale-105">
                  {/* <Play size={15} className="text-white fill-white ml-0.5" strokeWidth={0} /> */}
                  <img src="src/assets/logo_white.png" alt="Logo" className='h-7'/>
                </div>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[17px] font-semibold tracking-tight">Study</span>
                <span className="text-[9px] text-gray-500 uppercase tracking-[0.15em] font-medium">PRO</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className={`p-2 rounded-full transition-all duration-200 ${darkMode ? 'hover:bg-white/10 active:scale-95' : 'hover:bg-black/5 active:scale-95'} ${!darkMode ? 'text-amber-600' : ''}`}
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
            </button>
            <button 
              className={`p-2 rounded-full transition-all duration-200 ${darkMode ? 'hover:bg-white/10 active:scale-95' : 'hover:bg-black/5 active:scale-95'}`}
              onClick={loadLocalFolder}
              title="Load Courses"
            >
              <Folder size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      <aside className={`fixed left-0 top-14 bottom-0 w-64 z-40 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 ${darkMode ? 'bg-black/95' : 'bg-white/95'} border-r ${
        darkMode ? 'border-white/10' : 'border-black/10'
      } overflow-y-auto backdrop-blur-2xl backdrop-saturate-150`}>
        <div className="p-4 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full px-4 py-2.5 pr-10 rounded-xl text-[15px] font-normal ${
                darkMode 
                  ? 'bg-white/10 border-white/10 text-white placeholder-gray-500 focus:bg-white/15 focus:border-white/20' 
                  : 'bg-black/5 border-black/10 text-gray-900 placeholder-gray-400 focus:bg-black/10 focus:border-black/20'
              } border focus:outline-none transition-all duration-200`}
            />
            <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" strokeWidth={1.5} />
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <button
                className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                  darkMode ? 'bg-white/10 hover:bg-white/15 active:scale-98' : 'bg-black/5 hover:bg-black/10 active:scale-98'
                } border ${darkMode ? 'border-white/10' : 'border-black/10'}`}
                onClick={() => setShowSortMenu(!showSortMenu)}
              >
                <ArrowUpDown size={14} strokeWidth={2} />
                <span className="flex-1 text-left text-xs uppercase font-semibold tracking-wider">Sort</span>
                <ChevronRight size={14} strokeWidth={2} className={`transition-transform duration-200 ${showSortMenu ? 'rotate-90' : ''}`} />
              </button>
              {showSortMenu && (
                <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl shadow-2xl z-50 ${
                  darkMode ? 'bg-zinc-900/95 border-white/10' : 'bg-white/95 border-black/10'
                } border overflow-hidden backdrop-blur-2xl`}>
                  {['name', 'type', 'progress'].map(sort => (
                    <button
                      key={sort}
                      className={`w-full px-4 py-3 text-left text-[15px] flex items-center justify-between transition-all duration-150 ${
                        sortBy === sort ? 'text-red-600 font-semibold bg-red-600/10' : 'font-normal'
                      } ${darkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
                      onClick={() => { setSortBy(sort); setShowSortMenu(false); }}
                    >
                      {sort.charAt(0).toUpperCase() + sort.slice(1)}
                      {sortBy === sort && <Check size={16} strokeWidth={2.5} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={`px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                darkMode ? 'bg-white/10 border-white/10 hover:bg-white/15' : 'bg-black/5 border-black/10 hover:bg-black/10'
              } border focus:outline-none cursor-pointer`}
            >
              <option value="all">All</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="pdf">PDF</option>
            </select>
          </div>
        </div>
        <div className="pb-4">{renderCourses()}</div>
      </aside>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="lg:ml-64 pt-14 min-h-screen">
        {!currentLesson ? (
          <div className="max-w-3xl mx-auto text-center py-24 px-6">
            <div className={`w-44 h-44 mx-auto mb-10 rounded-[2.5rem] flex items-center justify-center relative ${
              darkMode ? 'bg-gradient-to-br from-white/5 to-white/10' : 'bg-gradient-to-br from-black/5 to-black/10'
            } shadow-2xl`}>
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-pink-600/10 rounded-[2.5rem] blur-2xl" />
              <BookOpen size={72} className={`${darkMode ? 'text-gray-600' : 'text-gray-400'} relative z-10`} strokeWidth={1.5} />
            </div>
            
            <h2 className="text-5xl font-semibold mb-5 tracking-tight leading-tight">
              Welcome to <span className="text-red-600">Study</span>
            </h2>
            
            <p className={`mb-10 text-[17px] leading-relaxed max-w-lg mx-auto font-normal ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Your personal learning companion. Load course folders to watch videos, listen to audio, read PDFs, and take timestamped notes — all in one beautiful interface.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button 
                className="flex items-center gap-3 px-7 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold text-[15px] transition-all duration-200 shadow-xl shadow-red-600/30 hover:shadow-red-600/50 hover:scale-105 active:scale-100"
                onClick={loadLocalFolder}
              >
                <Folder size={18} strokeWidth={2} />
                Load Courses
              </button>
              
              <div className={`text-xs px-5 py-3 rounded-full ${
                darkMode ? 'bg-white/5 text-gray-500' : 'bg-black/5 text-gray-600'
              }`}>
                <span className="font-semibold">Tip:</span> Organize folders by subject
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-16">
              <div className={`p-6 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-white'} shadow-xl backdrop-blur-xl transition-all duration-200 hover:scale-105`}>
                <PlayCircle size={32} className="mx-auto mb-3 text-red-600" strokeWidth={1.5} />
                <h3 className="font-semibold text-[15px] mb-2">Video Player</h3>
                <p className={`text-[13px] leading-relaxed ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  Custom controls with speed adjustment
                </p>
              </div>
              <div className={`p-6 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-white'} shadow-xl backdrop-blur-xl transition-all duration-200 hover:scale-105`}>
                <StickyNote size={32} className="mx-auto mb-3 text-red-600" strokeWidth={1.5} />
                <h3 className="font-semibold text-[15px] mb-2">Smart Notes</h3>
                <p className={`text-[13px] leading-relaxed ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  Timestamped notes for easy review
                </p>
              </div>
              <div className={`p-6 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-white'} shadow-xl backdrop-blur-xl transition-all duration-200 hover:scale-105`}>
                <CheckCircle size={32} className="mx-auto mb-3 text-red-600" strokeWidth={1.5} />
                <h3 className="font-semibold text-[15px] mb-2">Track Progress</h3>
                <p className={`text-[13px] leading-relaxed ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  Monitor your learning journey
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto p-6">
            {(currentLesson.type === 'video' || currentLesson.type === 'audio') && (
              <div 
                ref={videoWrapperRef}
                className="relative bg-black rounded-none overflow-hidden mb-3 group"
                style={{ aspectRatio: currentLesson.type === 'video' ? '16/9' : 'auto' }}
                onMouseMove={showControlsTemporarily}
                onMouseLeave={() => isPlaying && setShowControls(false)}
              >
                {currentLesson.type === 'video' ? (
                  <video 
                    ref={videoRef} 
                    src={currentLesson.url} 
                    className="w-full h-full object-contain"
                    onClick={togglePlay}
                  />
                ) : (
                  <audio ref={videoRef} src={currentLesson.url} className="w-full" />
                )}
                
                <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-3 pb-2 pt-16 transition-opacity duration-300 ${
                  showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
                }`}>
                  <div className="w-full h-1 bg-white/20 cursor-pointer mb-2 group/progress relative hover:h-1.5 transition-all" onClick={handleProgressClick}>
                    <div className="absolute inset-0 h-full bg-white/30 rounded-full" style={{ width: `${buffered}%` }} />
                    <div className="absolute inset-0 h-full bg-red-600 rounded-full" style={{ width: `${(currentTime / duration) * 100}%` }}>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-white">
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors" onClick={togglePlay}>
                      {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
                    </button>
                    <button className="p-1.5 hover:bg-white/10 rounded-full transition-colors" onClick={skipBackward}>
                      <SkipBack size={18} />
                    </button>
                    <button className="p-1.5 hover:bg-white/10 rounded-full transition-colors" onClick={skipForward}>
                      <SkipForward size={18} />
                    </button>
                    
                    <div className="flex items-center gap-2 group/volume">
                      <button className="p-1.5 hover:bg-white/10 rounded-full transition-colors" onClick={toggleMute}>
                        {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                      </button>
                      <input
                        type="range"
                        className="w-0 opacity-0 group-hover/volume:w-16 group-hover/volume:opacity-100 transition-all h-1 appearance-none bg-white/30 rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                      />
                    </div>

                    <span className="text-xs font-medium">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>

                    <div className="flex-1" />

                    <div className="relative">
                      <button 
                        className="p-1.5 hover:bg-white/10 rounded-full transition-colors" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowSettings(!showSettings);
                          if (!showSettings) {
                            setShowSpeedMenu(true);
                          } else {
                            setShowSpeedMenu(false);
                          }
                        }}
                      >
                        <Settings size={18} />
                      </button>
                      {showSettings && showSpeedMenu && (
                        <div className="absolute bottom-full right-0 mb-2 bg-[#282828]/98 backdrop-blur-lg rounded-lg shadow-2xl min-w-[160px] max-h-[400px] overflow-y-auto z-50">
                          {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 3.5, 4].map(speed => (
                            <div
                              key={speed}
                              className={`px-4 py-2.5 hover:bg-white/10 cursor-pointer text-sm transition-colors flex items-center justify-between ${
                                playbackSpeed === speed ? 'bg-white/10 text-white font-semibold' : 'text-gray-300'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                changeSpeed(speed);
                              }}
                            >
                              <span>{speed === 1 ? 'Normal' : speed + 'x'}</span>
                              {playbackSpeed === speed && (
                                <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {currentLesson.type === 'video' && (
                      <button className="p-1.5 hover:bg-white/10 rounded-full transition-colors" onClick={requestPiP} title="Picture in Picture">
                        <Tv size={18} />
                      </button>
                    )}

                    {currentLesson.type === 'video' && (
                      <button className="p-1.5 hover:bg-white/10 rounded-full transition-colors" onClick={toggleFullscreen}>
                        <Maximize size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentLesson.type === 'pdf' && (
              <div className={`rounded-sm overflow-hidden mb-3 ${darkMode ? 'bg-[#181818]' : 'bg-gray-100'}`}>
                <iframe
                  src={currentLesson.url}
                  className="w-full h-[800px] border-0"
                  title="PDF Viewer"
                />
              </div>
            )}

            <div className="mb-5">
              <h1 className="text-3xl font-semibold mb-4 leading-tight tracking-tight">{currentLesson.name}</h1>
              <div className={`flex flex-wrap items-center gap-3 text-[15px] mb-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/10 text-red-600 font-medium">
                  {currentLesson.type === 'video' ? <PlayCircle size={16} strokeWidth={2} /> : currentLesson.type === 'audio' ? <Music size={16} strokeWidth={2} /> : <FileText size={16} strokeWidth={2} />}
                  {currentLesson.type.charAt(0).toUpperCase() + currentLesson.type.slice(1)}
                </span>
                <span className="flex items-center gap-3">
                  <div className="relative">
                    <div className={`w-20 h-2 rounded-full ${darkMode ? 'bg-white/10' : 'bg-black/10'}`}>
                      <div 
                        className="h-full bg-red-600 rounded-full transition-all duration-300"
                        style={{ width: `${progress[currentLesson.path] || 0}%` }}
                      />
                    </div>
                  </div>
                  <span className="font-semibold text-[15px]">
                    {progress[currentLesson.path] ? `${Math.round(progress[currentLesson.path])}%` : '0%'}
                  </span>
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-full font-semibold text-[15px] transition-all duration-200 ${
                    progress[currentLesson.path] >= 90
                      ? 'bg-green-600 text-white shadow-xl shadow-green-600/30 hover:shadow-green-600/50 hover:bg-green-700'
                      : darkMode 
                        ? 'bg-white/10 text-white hover:bg-white/15' 
                        : 'bg-black/5 text-gray-900 hover:bg-black/10'
                  } hover:scale-105 active:scale-100`}
                  onClick={() => {
                    setProgress(prev => ({ ...prev, [currentLesson.path]: 100 }));
                  }}
                >
                  <CheckCircle size={18} strokeWidth={2} />
                  {progress[currentLesson.path] >= 90 ? 'Completed' : 'Mark Complete'}
                </button>
              </div>
            </div>

            <div className={`h-px my-6 ${darkMode ? 'bg-gradient-to-r from-transparent via-white/10 to-transparent' : 'bg-gradient-to-r from-transparent via-black/10 to-transparent'}`} />

            <div className="max-w-4xl">
              <div className="flex items-center gap-2.5 text-xl font-semibold mb-5">
                <StickyNote size={22} className="text-red-600" strokeWidth={1.5} />
                <span>Notes</span>
              </div>
              
              <div className={`rounded-2xl p-5 mb-6 border transition-all duration-200 ${
                darkMode ? 'bg-white/5 border-white/10 focus-within:border-red-600 focus-within:bg-white/10 focus-within:shadow-xl' : 'bg-white border-black/10 focus-within:border-red-600 focus-within:bg-white focus-within:shadow-2xl'
              }`}>
                <textarea
                  className={`w-full bg-transparent border-0 resize-y min-h-[100px] focus:outline-none text-[15px] leading-relaxed font-normal ${
                    darkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                  }`}
                  placeholder="Write your thoughts, key takeaways, or questions here..."
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                />
                <div className={`flex justify-between items-center mt-4 pt-4 border-t ${darkMode ? 'border-white/10' : 'border-black/10'}`}>
                  <span className={`text-xs font-medium ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {noteInput.length} characters
                  </span>
                  <div className="flex gap-3">
                    <button 
                      className={`px-5 py-2.5 rounded-full font-semibold text-[13px] transition-all duration-200 ${
                        darkMode ? 'text-gray-400 hover:bg-white/10' : 'text-gray-600 hover:bg-black/5'
                      } active:scale-95`}
                      onClick={() => setNoteInput('')}
                    >
                      Clear
                    </button>
                    <button 
                      className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold text-[13px] transition-all duration-200 shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:scale-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={saveNote}
                      disabled={!noteInput.trim()}
                    >
                      <Save size={14} strokeWidth={2} />
                      Save Note
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {currentNotes.length === 0 ? (
                  <div className={`text-center py-20 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-white shadow-xl'}`}>
                    <StickyNote size={56} className="mx-auto opacity-20 mb-5" strokeWidth={1.5} />
                    <p className={`text-[15px] font-semibold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      No notes yet
                    </p>
                    <p className={`text-[13px] ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      Start documenting your learning journey
                    </p>
                  </div>
                ) : (
                  currentNotes.map((note, index) => (
                    <div key={index} className={`rounded-2xl p-6 border transition-all duration-200 hover:scale-[1.01] ${
                      darkMode ? 'bg-white/5 border-white/10 hover:border-white/20 hover:shadow-2xl' : 'bg-white border-black/10 hover:border-black/20 hover:shadow-2xl'
                    }`}>
                      <div className="flex justify-between items-start mb-4">
                        {note.timestamp ? (
                          <button
                            className="flex items-center gap-2 text-xs font-semibold text-red-600 bg-red-600/10 px-4 py-2 rounded-full cursor-pointer hover:bg-red-600/20 transition-all duration-200 hover:scale-105"
                            onClick={() => jumpToTimestamp(note.timestampSeconds)}
                          >
                            <Clock size={14} strokeWidth={2} />
                            {note.timestamp}
                          </button>
                        ) : (
                          <span className={`text-xs font-semibold px-4 py-2 rounded-full ${
                            darkMode ? 'bg-white/10 text-gray-400' : 'bg-black/5 text-gray-600'
                          }`}>
                            General Note
                          </span>
                        )}
                        <button 
                          className={`p-2 rounded-full transition-all duration-200 ${
                            darkMode ? 'hover:bg-red-500/20 text-gray-400 hover:text-red-500' : 'hover:bg-red-100 text-gray-500 hover:text-red-600'
                          } active:scale-95`}
                          onClick={() => deleteNote(index)}
                          title="Delete note"
                        >
                          <Trash2 size={16} strokeWidth={2} />
                        </button>
                      </div>
                      <div className="text-[15px] leading-relaxed whitespace-pre-wrap font-normal">{note.text}</div>
                      <div className={`text-xs mt-4 pt-4 border-t font-medium ${darkMode ? 'border-white/10 text-gray-500' : 'border-black/10 text-gray-500'}`}>
                        {new Date(note.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudyApp;