import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import NetflixNavbar from './components/NetflixNavbar';
import NetflixHero from './components/NetflixHero';
import NetflixRow from './components/NetflixRow';
import VideoPlayer from './components/VideoPlayer';
import PDFViewer from './components/PDFViewer';
import RightPanel from './components/RightPanel';
import NotesSection from './components/NotesSection';
import ThemeSelector from './components/ThemeSelector';
import VideoMetadata from './components/VideoMetadata';
import { scanDirectory } from './utils/fileSystem';
import { applyTheme } from './utils/themeConfig';
import { Play, ChevronDown, BookOpen, ArrowLeft, ArrowRight, Monitor, Laptop, Smartphone } from 'lucide-react';

// --- Utility: Format Title ---
const formatTitle = (name) => {
  if (!name) return '';
  let clean = name.replace(/\.(mp4|mkv|webm|avi|mov|mp3|wav|pdf)$/i, '');
  clean = clean.replace(/@\w+/g, '');
  clean = clean.replace(/[-_]/g, ' ');
  return clean.trim();
};

const StudyApp = () => {
  // --- State ---
  const [courses, setCourses] = useState([]);
  const [allLessons, setAllLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [featuredItem, setFeaturedItem] = useState(null); // Explicit state for Hero content
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'courses' | 'list'

  const [progress, setProgress] = useState({});
  const [playbackTimes, setPlaybackTimes] = useState({});
  const [notes, setNotes] = useState({});
  const [myList, setMyList] = useState([]);
  const [volume, setVolume] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [viewMode, setViewMode] = useState('browse');
  const [theme, setTheme] = useState('black');
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // Toggle for Video Lessons grid

  const directoryHandleRef = useRef(null);
  const videoTimeRef = useRef(() => 0);

  // --- Watch Mode Controls Visibility ---
  const [showWatchControls, setShowWatchControls] = useState(true);
  const controlsTimeoutRef = useRef(null);

  const handleWatchMouseMove = () => {
    setShowWatchControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowWatchControls(false), 3000);
  };

  useEffect(() => {
    if (viewMode === 'watch') {
      handleWatchMouseMove(); // Show initially
      return () => {
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      };
    }
  }, [viewMode]);

  // --- Effects ---
  useEffect(() => {
    document.documentElement.classList.add('dark');

    const saved = localStorage.getItem('studyAppState');
    if (saved) {
      const data = JSON.parse(saved);
      setProgress(data.progress || {});
      setPlaybackTimes(data.playbackTimes || {});
      setNotes(data.notes || {});
      setMyList(data.myList || []);
      setVolume(data.volume !== undefined ? data.volume : 1);
      setPlaybackSpeed(data.playbackSpeed || 1);
      setTheme(data.theme || 'black');
      applyTheme(data.theme || 'black');
    } else {
      applyTheme('black');
    }

    return () => {
      document.body.style.background = '';
    };
  }, []);

  // Apply theme when it changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const data = { progress, playbackTimes, notes, myList, volume, playbackSpeed, darkMode: true, theme };
    localStorage.setItem('studyAppState', JSON.stringify(data));
  }, [progress, playbackTimes, notes, myList, volume, playbackSpeed, theme]);

  // --- Helpers ---
  const getSiblings = (lesson) => {
    if (!lesson || !lesson.path || allLessons.length === 0) return [];
    const parts = lesson.path.split('/');
    parts.pop();
    const parentPath = parts.join('/');
    const siblings = allLessons.filter(l => {
      if (!l.path) return false;
      const lParts = l.path.split('/');
      lParts.pop();
      return lParts.join('/') === parentPath;
    });
    // Sort siblings numerically/alphabetically by name
    return siblings.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
  };

  const getNextCourse = (lesson) => {
    if (!lesson || !lesson.path || courses.length === 0) return null;
    const containsLesson = (course, targetPath) => {
      if (!course || !course.path) return false;
      if (course.path === targetPath) return true;
      if (Array.isArray(course.lessons)) {
        return course.lessons.some(l => l.path === targetPath || containsLesson(l, targetPath));
      }
      return false;
    };
    const courseIdx = courses.findIndex(c => containsLesson(c, lesson.path));
    if (courseIdx !== -1 && courseIdx < courses.length - 1) {
      return courses[courseIdx + 1];
    }
    return null;
  };

  const handleToggleList = (item) => {
    if (!item || !item.path) return;
    setMyList(prev => {
      if (prev.includes(item.path)) return prev.filter(p => p !== item.path);
      return [...prev, item.path];
    });
  };

  // --- Handlers ---
  const handleAddFolder = async () => {
    try {
      if (!window.showDirectoryPicker) {
        alert('File System Access API not supported. Use Chrome or Edge.');
        return;
      }
      const dirHandle = await window.showDirectoryPicker();

      // We process the directory assuming it's a self-contained series/course
      const loadedFiles = await scanDirectory(dirHandle);



      // Helper to flatten lessons from a course
      // CORRECTED: Recursively extract all playable files (video/audio/pdf)
      // This ensures we see the ACTUAL FILES (e.g. "18.12 Deleting...") inside the folders
      const flatten = (items) => {
        let results = [];
        if (!items) return results;
        items.forEach(item => {
          if (['video', 'audio', 'pdf'].includes(item.type)) {
            results.push(item);
          } else if (item.type === 'folder' && item.lessons) {
            // Recursively get files from subfolders
            results = results.concat(flatten(item.lessons));
          }
        });
        return results;
      };

      // Check if there are any subfolders to treat as separate courses
      const subFolders = loadedFiles.filter(item => item.type === 'folder');
      const rootFiles = loadedFiles.filter(item => ['video', 'audio', 'pdf'].includes(item.type));

      const newCourses = [];

      // If we have subfolders, treat each as a course
      if (subFolders.length > 0) {
        subFolders.forEach(folder => {
          newCourses.push({
            name: folder.name,
            path: folder.path,
            // IMPORTANT: Flatten the lessons so all videos show up in the row
            lessons: flatten(folder.lessons || []),
            type: 'folder'
          });
        });
      }

      // If we have files in the root, add them as a course (using parent name)
      if (rootFiles.length > 0) {
        newCourses.push({
          name: subFolders.length > 0 ? `${dirHandle.name} (Files)` : dirHandle.name,
          path: dirHandle.name,
          lessons: rootFiles,
          type: 'folder'
        });
      }

      // If absolutely nothing (empty folder?), or just fall back mechanism
      if (newCourses.length === 0 && loadedFiles.length > 0) {
        newCourses.push({
          name: dirHandle.name,
          path: dirHandle.name,
          lessons: flatten(loadedFiles),
          type: 'folder'
        });
      }

      setCourses(prev => [...prev, ...newCourses]);

      // Flatten all new courses to add to allLessons
      let newFlatLessons = [];
      newCourses.forEach(c => {
        newFlatLessons = newFlatLessons.concat(c.lessons); // c.lessons is already flattened now
      });

      setAllLessons(prev => {
        const updated = [...prev, ...newFlatLessons];

        // AUTOMATICALLY FEATURE THE FIRST VIDEO
        // This ensures the Hero section is never "empty" or showing the Welcome screen
        // fulfilling the user's request to removing the default hero section while keeping features.
        if (updated.length > 0 && !featuredItem) {
          const firstVideo = updated.find(l => l.type === 'video');
          if (firstVideo) {
            setFeaturedItem(firstVideo);
          }
        }
        return updated;
      });
      setActiveTab('courses');

    } catch (err) {
      if (err.name !== 'AbortError') console.error('Error loading folder:', err);
    }
  };

  const handlePlay = async (lesson) => {
    // SAFEGUARD: Check if it's a valid object or event
    // If it's an event (has type 'click', etc) or null/undefined, treat as "Open Folder"
    if (!lesson || lesson.nativeEvent || (typeof lesson === 'object' && !lesson.path && !lesson.lessons && !lesson.type)) {
      handleAddFolder();
      return;
    }

    if ((!lesson.type || lesson.type === 'folder') && lesson.lessons) {
      const flattenFirst = (items) => {
        for (let item of items) {
          if (['video', 'audio', 'pdf'].includes(item.type)) return item;
          if (item.lessons) {
            const f = flattenFirst(item.lessons);
            if (f) return f;
          }
        }
        return null;
      };
      const first = flattenFirst(lesson.lessons);
      if (first) lesson = first;
      else return;
    }

    if (lesson.type === 'video' || lesson.type === 'audio' || lesson.type === 'pdf') {
      if (!lesson.url) {
        try {
          const file = await lesson.file.getFile();
          const url = URL.createObjectURL(file);
          lesson.url = url;
        } catch (e) {
          console.error("Error loading file", e);
          return;
        }
      }
    }

    setCurrentLesson({ ...lesson });
    setViewMode('watch');
  };

  const handleLessonUpdate = (time, dur) => {
    if (currentLesson && dur > 0) {
      const prog = (time / dur) * 100;
      setProgress(prev => ({ ...prev, [currentLesson.path]: prog }));
      setPlaybackTimes(prev => ({ ...prev, [currentLesson.path]: time }));
      videoTimeRef.current = () => time;
    }
  };

  const handleAddNote = (text, timestampSeconds) => {
    if (!currentLesson) return;
    let timestamp = null;
    if (timestampSeconds != null) {
      const h = Math.floor(timestampSeconds / 3600);
      const m = Math.floor((timestampSeconds % 3600) / 60);
      const s = Math.floor(timestampSeconds % 60);
      timestamp = h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
    }
    const newNote = { text, timestamp, timestampSeconds, date: new Date().toISOString() };
    setNotes(prev => ({ ...prev, [currentLesson.path]: [...(prev[currentLesson.path] || []), newNote] }));
  };

  const handleDeleteNote = (index) => {
    if (!window.confirm('Delete note?')) return;
    setNotes(prev => ({ ...prev, [currentLesson.path]: prev[currentLesson.path].filter((_, i) => i !== index) }));
  };

  const renderContent = () => {
    const enhance = (list) => list.map(l => ({
      ...l,
      name: formatTitle(l.name),
      originalName: l.name,
      progress: l.path ? (progress[l.path] || 0) : 0,
      inList: myList.includes(l.path)
    }));

    // --- Search Logic ---
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const searchResults = allLessons.filter(l => l.name && l.name.toLowerCase().includes(query));
      return (
        <div className="pt-32 px-4 md:px-12 pb-20 min-h-screen">
          <h2 className="text-2xl font-bold text-white mb-8">Search Results for "{searchQuery}"</h2>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {enhance(searchResults).map((item, idx) => (
                <div
                  key={idx}
                  className="group relative bg-[#181818] rounded-xl overflow-hidden cursor-pointer aspect-video ring-1 ring-white/10 hover:ring-white/30 gpu-accelerated"
                  style={{
                    transition: 'transform var(--duration-small) var(--ease-out), box-shadow var(--duration-small) var(--ease-out)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05) translateY(-4px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-strong)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1) translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onClick={() => handlePlay(item)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br from-gray-800 to-black opacity-50`}></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10">
                    <span className="text-white font-semibold text-sm line-clamp-2 drop-shadow-md">{item.name}</span>
                    <span className="absolute bottom-2 right-2 text-[10px] bg-black/60 px-1.5 py-0.5 rounded text-gray-300 uppercase tracking-widest backdrop-blur-md">{item.type}</span>
                  </div>
                  {(item.progress > 0) && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                      <div
                        className="h-full bg-[#E50914]"
                        style={{
                          width: `${item.progress}%`,
                          transition: 'width var(--duration-medium) var(--ease-out)'
                        }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-lg flex items-center justify-center h-64"><p>No matches found.</p></div>
          )
          }
        </div >
      );
    }

    // --- MY LIST TAB ---
    if (activeTab === 'list') {
      const listItems = [...courses, ...allLessons].filter(item => myList.includes(item.path));
      return (
        <div className="pt-32 px-4 md:px-12 pb-20 min-h-screen animate-fade-in relative overflow-hidden">
          {/* Background 3D Elements */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent h-full z-0"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent h-full z-0"></div>
          <div className="absolute inset-0 brightness-110 contrast-125 saturate-0 z-0">
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-10 border-l-4 border-[#E50914] pl-4">My List</h2>
            {listItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400">
                <p className="text-xl mb-4">Your list is empty.</p>
                <p className="text-sm">Add courses or lessons to your list to see them here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {enhance(listItems).map((item, idx) => (
                  <div key={idx} onClick={() => handlePlay(item)} className="group bg-[#181818] rounded-lg overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-red-900/10 transition-all duration-300 ring-1 ring-white/5 hover:ring-white/20 relative">
                    <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 group-hover:from-gray-700 group-hover:to-gray-800 transition-colors relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen size={48} className="text-gray-600 group-hover:text-white/20 transition-colors" />
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 animate-slide-up">
                        <h3 className="text-xl font-bold text-white line-clamp-2 leading-tight drop-shadow-md group-hover:text-[#E50914] transition-colors">{item.name}</h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    // --- COURSES TAB ---
    if (activeTab === 'courses') {
      return (
        <div className="pt-32 px-4 md:px-12 pb-20 min-h-screen animate-fade-in relative overflow-hidden">
          {/* Background 3D Elements */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent h-full z-0"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent h-full z-0"></div>
          <div className="absolute inset-0 brightness-110 contrast-125 saturate-0 z-0">
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-10 border-l-4 border-[#E50914] pl-4">All Courses</h2>
            {courses.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400">
                <p className="text-xl mb-4">No content loaded yet.</p>
                <button onClick={handleAddFolder} className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200 transition-colors">Add Folder by Series</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {courses.map((course, idx) => (
                  <div key={idx} onClick={() => handlePlay(course)} className="group bg-[#181818] rounded-lg overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-red-900/10 transition-all duration-300 ring-1 ring-white/5 hover:ring-white/20 relative">
                    <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 group-hover:from-gray-700 group-hover:to-gray-800 transition-colors relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen size={48} className="text-gray-600 group-hover:text-white/20 transition-colors" />
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 animate-slide-up">
                        <h3 className="text-xl font-bold text-white line-clamp-2 leading-tight drop-shadow-md group-hover:text-[#E50914] transition-colors">{formatTitle(course.name)}</h3>
                        <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">{course.lessons ? `${course.lessons.length} Items` : 'Course Folder'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    // --- HOME TAB ---
    const inProgress = allLessons.filter(l => (l.path && progress[l.path] > 0 && progress[l.path] < 90));
    const videos = allLessons.filter(l => l.type === 'video');
    const audios = allLessons.filter(l => l.type === 'audio');

    let featuredRaw = null;
    if (inProgress.length > 0) {
      featuredRaw = inProgress[Math.floor(Math.random() * inProgress.length)];
    } else if (allLessons.length > 0) {
      featuredRaw = allLessons[Math.floor(Math.random() * allLessons.length)];
    }

    const featuredItem = featuredRaw ? {
      ...featuredRaw,
      name: formatTitle(featuredRaw.name),
      progress: featuredRaw.path ? (progress[featuredRaw.path] || 0) : 0,
      inList: myList.includes(featuredRaw.path)
    } : null;

    return (
      <div className="pb-20 overflow-x-hidden">
        <NetflixHero
          featuredItem={featuredItem}
          onPlay={handlePlay}
          onToggleList={handleToggleList}
        />

        <div className="-mt-20 relative z-20 pl-4 md:pl-12 space-y-8">
          {inProgress.length > 0 && <NetflixRow title="Continue Learning" items={enhance(inProgress)} onPlay={handlePlay} />}

          {/* Decorative Curved Divider (Apple Style) */}
          {inProgress.length > 0 && (
            <div className="relative w-full h-24 -mt-12 mb-8 z-10 pointer-events-none">
              {/* Clean Glassy Gradient Fade */}
              <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-b from-transparent via-[#1c1c1e]/50 to-[#000000]"></div>

              <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
                {/* Subtle White Curve */}
                <path
                  d="M0,320 C400,300 1000,200 1440,260"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="1.5"
                  fill="none"
                  className="drop-shadow-[0_0_15px_rgba(255,255,200,0.1)]"
                />
                {/* Second Parallel Hairline for elegance */}
                <path
                  d="M0,325 C400,305 1000,205 1440,265"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="1"
                  fill="none"
                />
              </svg>
            </div>
          )}


          {videos.length > 0 && (
            <div className={`relative transition-all duration-500 ${isExpanded ? 'mb-20' : 'mb-8'}`}>
              <div className="flex items-center justify-between pr-8 mb-4">
                {/* Title & Toggle Button */}
                <div onClick={() => setIsExpanded(!isExpanded)} className="group cursor-pointer flex items-center gap-4">
                  <h2 className="text-xl md:text-2xl font-bold text-[#e5e5e5] group-hover:text-white transition-colors">
                    Video Lessons
                  </h2>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all">
                    <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                      {isExpanded ? 'Show Less' : 'View All'}
                    </span>
                    <ChevronDown size={16} className={`text-white transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`} />
                  </div>
                </div>

                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider border border-white/5 px-2 py-1 rounded bg-black/20">
                  {videos.length} Episodes
                </span>
              </div>

              {/* Conditional Rendering: Row vs Grid */}
              <div className="relative min-h-[200px]">
                {!isExpanded ? (
                  /* Collapsed: Slider View */
                  <div className="animate-fade-in">
                    <NetflixRow title="" items={enhance(videos)} onPlay={handlePlay} hideTitle={true} />
                  </div>
                ) : (
                  /* Expanded: Grid View */
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-12 gap-x-6 pr-8 animate-fade-in-up">
                    {enhance(videos).map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => handlePlay(item)}
                        className="group relative cursor-pointer"
                      >
                        <div className="relative aspect-video rounded-xl bg-[#181818] ring-1 ring-white/10 group-hover:ring-white/40 shadow-premium group-hover:shadow-premium-lg transition-all duration-300 overflow-hidden transform group-hover:scale-105 group-hover:z-50">
                          {/* Background & Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-[#121212] to-black">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80"></div>
                          </div>

                          {/* Icons */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-10 transition-opacity">
                            <BookOpen size={40} className="text-gray-500" />
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <div className="w-12 h-12 rounded-full bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center backdrop-blur-sm scale-90 group-hover:scale-100">
                              <Play fill="black" className="text-black w-5 h-5 ml-1" />
                            </div>
                          </div>

                          {/* Text Info */}
                          <div className="absolute inset-0 flex flex-col justify-end p-4 transition-all duration-300">
                            <h3 className="text-gray-100 font-bold text-sm leading-tight line-clamp-2 drop-shadow-md group-hover:text-white transition-colors translate-y-2 group-hover:translate-y-0 duration-300">
                              {item.name}
                            </h3>
                            <div className="mt-4 flex flex-col gap-2">
                              <div className="flex items-center gap-2 text-xs text-gray-300 font-medium">
                                <span className="text-[var(--theme-success)] font-bold">98% Match</span>
                                <span className="border border-white/20 px-1 py-0.5 text-[10px] uppercase">HD</span>
                              </div>
                            </div>
                          </div>

                          {/* Progress */}
                          {item.progress > 0 && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700/50">
                              <div className="h-full bg-[var(--theme-primary)] shadow-[0_0_5px_var(--theme-glow)]" style={{ width: `${item.progress}%` }}></div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {audios.length > 0 && <NetflixRow title="Audio Material" items={enhance(audios)} onPlay={handlePlay} />}

          {/* Show all courses on home */}
          {courses.map(course => {
            // Lessons are already flattened when the course was created
            if (!course.lessons || course.lessons.length === 0) return null;
            return <NetflixRow key={course.path} title={formatTitle(course.name)} items={enhance(course.lessons)} onPlay={handlePlay} />;
          })}
        </div>
      </div>
    );
  };

  const siblings = currentLesson ? getSiblings(currentLesson) : [];
  const nextCourse = currentLesson ? getNextCourse(currentLesson) : null;

  return (
    <div className="min-h-screen font-sans relative bg-grid-pattern" style={{ backgroundColor: 'var(--theme-background)', color: 'var(--theme-text-primary)' }}>
      {/* Global Study Background */}

      {/* Theme Selector Modal */}
      <ThemeSelector
        currentTheme={theme}
        onThemeChange={setTheme}
        isOpen={showThemeSelector}
        onClose={() => setShowThemeSelector(false)}
      />

      {viewMode === 'browse' && (
        <>
          <NetflixNavbar
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            onLoadFolder={handleAddFolder}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            stats={{ courses: courses.length, lessons: allLessons.length }}
            onOpenThemeSelector={() => setShowThemeSelector(true)}
          />
          {renderContent()}
        </>
      )}



      {viewMode === 'watch' && currentLesson && (
        <div
          className="h-screen flex flex-col overflow-hidden relative"
          onMouseMove={handleWatchMouseMove}
          onClick={handleWatchMouseMove}
          style={{ background: 'var(--theme-background)' }}
        >
          {/* Layout Container */}
          <div className="flex-1 flex w-full h-screen overflow-hidden p-6 gap-6" style={{ background: 'var(--theater-bg)' }}>
            {/* Main Content Area (Left) - Video Area */}
            <div className="flex-[3] flex flex-col min-h-0 overflow-y-auto custom-scrollbar pr-2">
              <div className="theater-container flex flex-col relative shrink-0">
                {/* Video Player Container */}
                <div className="flex-1 flex items-center justify-center min-h-0 bg-black/20">
                  <div className="w-full h-full max-h-full max-w-full flex items-center justify-center overflow-hidden">
                    <div className="w-full aspect-video shadow-2xl relative">
                      {['video', 'audio'].includes(currentLesson.type) ? (
                        <VideoPlayer
                          lesson={currentLesson}
                          savedVolume={volume}
                          savedSpeed={playbackSpeed}
                          initialTime={playbackTimes[currentLesson.path] || 0}
                          onTimeUpdate={handleLessonUpdate}
                          onVolumeChange={setVolume}
                          onSpeedChange={setPlaybackSpeed}
                          onEnded={() => setProgress(prev => ({ ...prev, [currentLesson.path]: 100 }))}
                          autoPlay={true}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <PDFViewer url={currentLesson.url} darkMode={theme === 'black'} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Status Bar for Video - Now with COMPLETE Metadata */}
                <div className="theater-status-bar">
                  <div className="flex items-center gap-4 w-full">
                    <div className="px-3 py-1 border border-[var(--theater-accent)]/40 rounded-full text-[var(--theater-accent)] text-[10px] font-bold uppercase tracking-widest font-nasa">
                      Now Playing
                    </div>
                    <div className="text-white text-xs font-bold truncate flex-1 flex items-center gap-2">
                      <span>{formatTitle(currentLesson.name)}</span>
                      <span className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-gray-500 uppercase tracking-widest font-mono">
                        {currentLesson.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 text-[10px] font-bold tracking-widest text-[var(--theater-text-muted)]">
                      <div className="flex items-center gap-2 text-white bg-[var(--theater-accent)] px-2 py-1 rounded">
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        98% MATCH
                      </div>
                      <div className="bg-white/5 border border-white/10 px-2 py-1 rounded">4K ULTRA HD</div>
                      <div className="uppercase bg-white/5 border border-white/10 px-2 py-1 rounded">{currentLesson.name.split('.').pop()}</div>
                      <div className="text-[var(--theater-accent)] font-nasa text-sm">
                        {Math.floor(progress[currentLesson.path] || 0)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Area (Right) */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-hidden">
                <RightPanel
                  notes={notes[currentLesson.path] || []}
                  onAddNote={handleAddNote}
                  onDeleteNote={handleDeleteNote}
                  getCurrentTime={() => videoTimeRef.current()}
                  onJumpToTimestamp={(ts) => {
                    const v = document.querySelector('video') || document.querySelector('audio');
                    if (v) { v.currentTime = ts; v.play(); }
                  }}
                  playlist={siblings.map(s => ({ ...s, name: formatTitle(s.name) }))}
                  currentLesson={currentLesson}
                  onPlayLesson={handlePlay}
                  progress={progress}
                  nextCourse={nextCourse ? { ...nextCourse, name: formatTitle(nextCourse.name) } : null}
                  onPlayCourse={handlePlay}
                  onGoHome={() => setViewMode('browse')}
                />
              </div>

              {/* Bottom Status Bar for Sidebar - Now JUMPS TO NEXT FOLDER */}
              {(() => {
                return (
                  <div
                    className="theater-status-bar cursor-pointer hover:brightness-125 transition-all group/upnext shadow-none border-t border-white/5"
                    style={{ background: 'var(--theater-surface)', marginTop: '0.5rem' }}
                    onClick={() => {
                      if (nextCourse) {
                        handlePlay(nextCourse);
                      } else {
                        setViewMode('browse'); // Go home if no more courses
                      }
                    }}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="px-4 py-1.5 border border-[var(--theater-accent)]/30 rounded-[5px] text-[var(--theater-accent)] text-[10px] font-black uppercase tracking-widest font-nasa group-hover/upnext:bg-[var(--theater-accent)] group-hover/upnext:text-black transition-all duration-300 shadow-lg shadow-red-900/20">
                        {nextCourse ? 'Next Folder' : 'No More Folders'}
                      </div>
                      <div className="text-white/90 text-xs font-bold truncate flex-1 leading-none uppercase tracking-tighter">
                        {nextCourse ? `Jump to: ${formatTitle(nextCourse.name)}` : "Back to Home"}
                      </div>
                      <ArrowRight size={14} className="text-[var(--theater-accent)] opacity-0 group-hover/upnext:opacity-100 transition-opacity" />
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyApp;
