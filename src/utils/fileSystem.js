export const getFileType = (ext) => {
    if (['mp4', 'webm', 'mkv', 'avi', 'mov', 'm4v', 'ts', '3gp', 'wmv', 'flv', 'mpeg', 'mpg'].includes(ext)) return 'video';
    if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext)) return 'audio';
    if (ext === 'pdf') return 'pdf';
    return 'unknown';
};

export const scanDirectory = async (dirHandle, path = '') => {
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
                    handle: entry,
                    type: 'folder'
                });
            }
        } else if (entry.kind === 'file') {
            const ext = entry.name.split('.').pop().toLowerCase();
            if (['mp4', 'mp3', 'pdf', 'webm', 'mkv', 'avi', 'mov', 'wav', 'ogg', 'm4a', 'm4v', 'ts', '3gp', 'wmv', 'flv', 'mpeg', 'mpg'].includes(ext)) {
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
    // Return combined result to support mixed content (folders + files)
    return [...courses, ...lessons];
};
