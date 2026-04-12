import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

const LandingPage = () => {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleGenerate = async () => {
        if (!url.trim()) return;
        setIsLoading(true);
        try {
            // Shoots the POST request through Vite's local CORS-free proxy proxy -> FastAPI
            const response = await api.submitVideo(url);
            if (response.video_id) {
                // Kick the user into the tracker page
                navigate(`/processing/${response.video_id}`);
            }
        } catch (err) {
            console.error("Failed to submit video:", err);
            alert("Backend unreachable or error in request!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-background text-on-surface font-body selection:bg-primary/30 min-h-screen flex flex-col">
            {/* TopNavBar */}
            <header className="fixed top-0 w-full z-50 bg-[#060e20]/60 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
                <nav className="flex justify-between items-center max-w-7xl mx-auto px-8 h-20">
                    <div className="text-2xl font-bold bg-gradient-to-br from-[#ba9eff] to-[#8455ef] bg-clip-text text-transparent font-headline tracking-tight">
                        Moments
                    </div>
                    {/* Removed unneeded links and login buttons for Hackathon MVP */}
                </nav>
            </header>

            <main className="relative pt-20 flex-grow">
                {/* Ambient Light Sources */}
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -z-10"></div>
                <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-secondary/10 blur-[120px] rounded-full -z-10"></div>

                {/* Hero Section */}
                <section className="relative px-6 pt-24 pb-32 overflow-hidden">
                    <div className="max-w-5xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/30 border border-secondary/20 mb-8 active:scale-95 transition-transform cursor-pointer">
                            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                            <span className="text-xs font-label font-bold tracking-wider text-secondary uppercase">New: AI Auto-Cropping 2.0</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-headline font-bold tracking-tighter mb-8 leading-[1.1]">
                            Turn Long Videos into <br />
                            <span className="hero-gradient-text">Viral Shorts</span>
                        </h1>
                        <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-12 leading-relaxed">
                            AI finds the best moments and automatically crops and adds subtitles. Scale your content reach with zero manual editing.
                        </p>

                        {/* URL Input Glass Card */}
                        <div className="max-w-3xl mx-auto">
                            <div className="glass-card p-2 md:p-3 rounded-2xl md:rounded-full flex flex-col md:flex-row items-center gap-3 shadow-2xl relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                                <div className="flex-1 w-full px-6 flex items-center gap-3 relative">
                                    <span className="material-symbols-outlined text-on-surface-variant">link</span>
                                    <input 
                                        className="bg-transparent border-none focus:ring-0 text-on-surface outline-none placeholder:text-on-surface-variant/50 w-full font-body text-lg py-3" 
                                        placeholder="Paste YouTube URL here..." 
                                        type="text"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                <button 
                                    onClick={handleGenerate}
                                    disabled={isLoading || !url.trim()}
                                    className={`w-full md:w-auto primary-gradient text-on-primary-fixed px-8 py-4 rounded-xl md:rounded-full font-label font-extrabold text-base flex items-center justify-center gap-2 transition-transform shadow-xl relative ${isLoading ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
                                >
                                    <span className={`material-symbols-outlined ${isLoading ? 'animate-spin' : ''}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                                        {isLoading ? 'sync' : 'auto_awesome'}
                                    </span>
                                    {isLoading ? 'Connecting...' : 'Generate Clips'}
                                </button>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Bento Grid Showcase */}
                <section className="px-6 py-24 bg-surface-container-low/50">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                            {/* Feature 1: Intelligent Cropping */}
                            <div className="md:col-span-8 glass-card rounded-3xl p-8 relative overflow-hidden group">
                                <div className="relative z-10">
                                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6">
                                        <span className="material-symbols-outlined text-primary">crop_free</span>
                                    </div>
                                    <h3 className="text-2xl font-headline font-bold mb-4">Intelligent Face-Tracking</h3>
                                    <p className="text-on-surface-variant max-w-md">Our AI automatically detects speakers and crops videos to 9:16, keeping the action centered perfectly for TikTok and Reels.</p>
                                </div>
                                <img className="absolute -right-20 -bottom-20 w-2/3 rounded-tl-3xl border-t border-l border-outline-variant/30 transform group-hover:-translate-x-4 group-hover:-translate-y-4 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvlhQ44aoRMO4HGgRo6XmxxKIIulO_M_TWKkt_lXuBT6Rw1tTL55BaLttkKB-7ZHhOhfBSzu2uje5YppUApxP0d7dtRYLv9bpiJDmYV1iWZ2OVYETPBU-Nb_dfrHs-1F0W4UefXTw_Ad8hu82LrHOjAjAMXZ8RgvsysESs75N_D_MHQRYx6nndOSVR30ju2gcfuF2aNPWYuv5gbC9x1nPbK9HeZAEH2C3xa-1_toK0MM25IOmuZO4skdgTe2G3cIWfE3L-_OhonaQ" alt="Face Tracking AI Graphic" />
                            </div>

                            {/* Feature 2: Magic Subtitles */}
                            <div className="md:col-span-4 glass-card rounded-3xl p-8 flex flex-col justify-between group">
                                <div>
                                    <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center mb-6">
                                        <span className="material-symbols-outlined text-secondary">closed_caption</span>
                                    </div>
                                    <h3 className="text-2xl font-headline font-bold mb-4">Dynamic Captions</h3>
                                    <p className="text-on-surface-variant">Generate viral-style animated captions with 99.2% accuracy in over 40 languages.</p>
                                </div>
                                <div className="mt-8 pt-8 border-t border-outline-variant/10">
                                    <div className="flex gap-2 flex-wrap">
                                        <span className="px-3 py-1 rounded-md bg-surface-variant text-xs text-on-surface-variant">Alex Hormozi Style</span>
                                        <span className="px-3 py-1 rounded-md bg-surface-variant text-xs text-on-surface-variant">Clean Minimal</span>
                                        <span className="px-3 py-1 rounded-md bg-surface-variant text-xs text-on-surface-variant">Neon Pulse</span>
                                    </div>
                                </div>
                            </div>

                            {/* Feature 3: Viral Score */}
                            {/* Expanded to completely encapsulate the bottom of the grid since Platform Sync was removed */}
                            <div className="md:col-span-12 glass-card rounded-3xl p-8 border-t-2 border-t-tertiary/20 flex flex-col md:flex-row items-center gap-8">
                                <div className="flex-1">
                                    <div className="w-12 h-12 rounded-xl bg-tertiary/20 flex items-center justify-center mb-6">
                                        <span className="material-symbols-outlined text-tertiary">trending_up</span>
                                    </div>
                                    <h3 className="text-2xl font-headline font-bold mb-4">Viral AI Score</h3>
                                    <p className="text-on-surface-variant mb-6">AI analyzes retention hooks and predicts which segments have the highest chance of going viral.</p>
                                </div>
                                <div className="bg-surface-container-lowest p-6 rounded-2xl w-full md:w-1/3 shadow-2xl">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-xs font-label font-bold text-on-surface-variant">PREDICTED REACH</span>
                                        <span className="text-2xl font-headline font-bold text-tertiary">94/100</span>
                                    </div>
                                    <div className="w-full bg-surface-variant h-3 rounded-full overflow-hidden mt-4">
                                        <div className="bg-tertiary h-full w-[94%]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Social Proof and CTA have been stripped out for hackathon MVP! */}

            </main>

            {/* Footer */}
            <footer className="bg-[#060e20] w-full py-12 border-t border-[#40485d]/15 mt-auto">
                <div className="flex flex-col justify-center items-center max-w-7xl mx-auto px-8 gap-6">
                    <div className="flex flex-col gap-2 items-center text-center">
                        <span className="font-headline font-bold text-[#dee5ff] text-xl">Moments</span>
                        <p className="font-body text-sm tracking-wide text-[#dee5ff]/50">© 2024 Moments AI. Processing secured by Ethereal Engine.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
