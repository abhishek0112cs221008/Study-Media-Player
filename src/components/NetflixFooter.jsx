import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full bg-black text-white/60 py-8 px-4 md:px-12 mt-20 border-t border-white/10 font-sans">
            <div className="max-w-5xl mx-auto text-center">
                {/* Simple Copyright */}
                <div className="text-sm">
                    © {new Date().getFullYear()} StudyFlix. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
