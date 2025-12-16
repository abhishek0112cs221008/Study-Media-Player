import React from 'react';

const PDFViewer = ({ url, darkMode }) => {
    return (
        <div className={`w-full h-[85vh] rounded-xl overflow-hidden shadow-2xl border ${darkMode ? 'border-white/10 bg-[#1e1e1e]' : 'border-black/5 bg-white'}`}>
            <iframe
                src={url}
                className="w-full h-full border-0"
                title="PDF Viewer"
            />
        </div>
    );
};

export default PDFViewer;
