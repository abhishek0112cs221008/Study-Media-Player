import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Folder, ChevronRight, PlayCircle, Music, FileText, CheckCircle, ArrowUpDown, Check, X } from 'lucide-react';
import clsx from 'clsx';

const Sidebar = ({
    courses,
    onLoadFolder,
    currentLesson,
    onSelectLesson,
    progress,
    isOpen,
    onClose,
    darkMode,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    sortBy,
    setSortBy
}) => {
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [expandedCourses, setExpandedCourses] = useState({});

    const toggleCourseExpand = (courseId) => {
        setExpandedCourses(prev => ({ ...prev, [courseId]: !prev[courseId] }));
    };

    const sortLessons = (lessons) => {
        let sorted = [...lessons];
        switch (sortBy) {
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
                <div className={clsx("px-4 py-6 text-center text-xs italic", darkMode ? "text-gray-600" : "text-gray-400")}>
                    No lessons found
                </div>
            );
        }

        return (
            <div className="flex flex-col">
                {sortedLessons.map((lesson, idx) => {
                    const isCompleted = progress[lesson.path] >= 90;
                    const lessonProgress = progress[lesson.path] || 0;
                    const Icon = isCompleted ? CheckCircle : lesson.type === 'video' ? PlayCircle : lesson.type === 'audio' ? Music : FileText;
                    const isSelected = currentLesson?.path === lesson.path;

                    return (
                        <motion.div
                            key={lesson.path}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.02 }}
                            className={clsx(
                                "relative group flex items-center gap-3 px-4 py-3 cursor-pointer transition-all border-l-2",
                                isSelected
                                    ? "border-red-500 bg-red-500/10"
                                    : "border-transparent hover:bg-black/5 dark:hover:bg-white/5",
                                darkMode && !isSelected ? "text-gray-400" : isSelected ? "text-red-500" : "text-gray-600"
                            )}
                            onClick={() => onSelectLesson(lesson)}
                        >
                            {/* Progress Background for item */}
                            {lessonProgress > 0 && lessonProgress < 90 && !isSelected && (
                                <div
                                    className="absolute bottom-0 left-0 h-[2px] bg-red-500/30"
                                    style={{ width: `${lessonProgress}%` }}
                                />
                            )}

                            <Icon size={16} className={clsx("shrink-0", isCompleted ? "text-green-500" : isSelected ? "text-red-500" : "opacity-70")} />
                            <span className={clsx("text-sm flex-1 truncate font-medium", isSelected && "font-semibold")}>{lesson.name}</span>

                            {isCompleted && <span className="w-1.5 h-1.5 rounded-full bg-green-500" />}
                        </motion.div>
                    );
                })}
            </div>
        );
    };

    const renderCourses = () => {
        if (courses.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-64 px-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/10 to-orange-500/10 flex items-center justify-center mb-4">
                        <Folder size={32} className="text-red-500 opacity-50" />
                    </div>
                    <p className={clsx("mb-4 text-sm font-medium", darkMode ? "text-gray-400" : "text-gray-600")}>
                        No courses loaded yet
                    </p>
                    <button
                        onClick={onLoadFolder}
                        className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-full font-medium transition-all shadow-lg shadow-red-500/20 hover:scale-105 active:scale-95"
                    >
                        Load Folder
                    </button>
                </div>
            );
        }

        const filteredCourses = searchQuery
            ? courses.filter(course => course.name.toLowerCase().includes(searchQuery.toLowerCase()))
            : courses;

        return (
            <div className="pb-20">
                {filteredCourses.map((course) => {
                    const isExpanded = expandedCourses[course.path];
                    const allLessons = Array.isArray(course.lessons[0]?.lessons)
                        ? course.lessons.flatMap(m => m.lessons)
                        : course.lessons;
                    const total = allLessons.length;
                    const completed = allLessons.filter(l => progress[l.path] >= 90).length;
                    const progressPercent = total > 0 ? (completed / total) * 100 : 0;

                    return (
                        <div key={course.path} className={clsx("border-b", darkMode ? "border-white/5" : "border-black/5")}>
                            <div
                                className={clsx(
                                    "flex items-center gap-3 p-4 cursor-pointer transition-colors sticky top-0 z-10 backdrop-blur-md",
                                    isExpanded ? (darkMode ? "bg-white/5" : "bg-black/5") : "hover:bg-black/5 dark:hover:bg-white/5"
                                )}
                                onClick={() => toggleCourseExpand(course.path)}
                            >
                                <div className="relative">
                                    <Folder size={20} className={clsx(isExpanded ? "text-red-500" : darkMode ? "text-gray-400" : "text-gray-500")} />
                                    {progressPercent >= 100 && (
                                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 border-2 border-[#121212] rounded-full"></div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className={clsx("text-sm font-semibold truncate", darkMode ? "text-gray-200" : "text-gray-800")}>
                                        {course.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-red-500" style={{ width: `${progressPercent}%` }} />
                                        </div>
                                        <span className="text-[10px] text-gray-400">{completed}/{total}</span>
                                    </div>
                                </div>
                                <ChevronRight
                                    size={16}
                                    className={clsx("transition-transform duration-300", isExpanded && "rotate-90", darkMode ? "text-gray-500" : "text-gray-400")}
                                />
                            </div>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden bg-black/5 dark:bg-black/20"
                                    >
                                        {renderLessons(allLessons)}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40 bg-black/60 lg:hidden backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            <aside
                className={clsx(
                    "fixed left-0 top-0 bottom-0 z-50 w-72 backdrop-blur-3xl transition-transform duration-300 border-r shadow-2xl flex flex-col",
                    isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                    darkMode ? "bg-[#0A0A0A]/95 border-white/5" : "bg-white/95 border-gray-100"
                )}
            >
                {/* Header */}
                <div className="h-16 flex items-center px-5 border-b border-white/5 shrink-0">
                    <span className="text-lg font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                        Library
                    </span>
                    <div className="ml-auto lg:hidden">
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
                            <X size={20} className={darkMode ? "text-gray-400" : "text-gray-600"} />
                        </button>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="p-4 space-y-3 shrink-0">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={clsx(
                                "w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all outline-none border",
                                darkMode
                                    ? "bg-white/5 border-white/5 text-white focus:bg-white/10 focus:border-red-500/50"
                                    : "bg-gray-100 border-transparent text-gray-900 focus:bg-white focus:border-red-500/30 focus:shadow-sm"
                            )}
                        />
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                    </div>

                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <button
                                className={clsx(
                                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition-all",
                                    darkMode
                                        ? "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10"
                                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                                )}
                                onClick={() => setShowSortMenu(!showSortMenu)}
                            >
                                <div className="flex items-center gap-2">
                                    <ArrowUpDown size={14} />
                                    <span>{sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}</span>
                                </div>
                            </button>

                            <AnimatePresence>
                                {showSortMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className={clsx(
                                            "absolute top-full left-0 right-0 mt-2 rounded-xl shadow-2xl z-50 border overflow-hidden backdrop-blur-xl",
                                            darkMode ? "bg-[#1A1A1A]/95 border-white/10" : "bg-white/95 border-gray-200"
                                        )}>
                                        {['name', 'type', 'progress'].map(sort => (
                                            <button
                                                key={sort}
                                                className={clsx(
                                                    "w-full px-4 py-3 text-left text-sm flex items-center justify-between transition-colors",
                                                    sortBy === sort ? "text-red-500 bg-red-500/10" : darkMode ? "text-gray-300 hover:bg-white/5" : "text-gray-700 hover:bg-gray-50"
                                                )}
                                                onClick={() => { setSortBy(sort); setShowSortMenu(false); }}
                                            >
                                                {sort.charAt(0).toUpperCase() + sort.slice(1)}
                                                {sortBy === sort && <Check size={14} />}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className={clsx(
                                "px-3 py-2 rounded-lg text-xs font-medium border outline-none cursor-pointer appearance-none",
                                darkMode
                                    ? "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10"
                                    : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                            )}
                        >
                            <option value="all">All Types</option>
                            <option value="video">Videos</option>
                            <option value="audio">Audio</option>
                            <option value="pdf">PDFs</option>
                        </select>
                    </div>
                </div>

                {/* Course List */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                    {renderCourses()}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
