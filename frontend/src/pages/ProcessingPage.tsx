import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

const ProcessingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('pending');

    useEffect(() => {
        if (!id) return;

        const interval = setInterval(async () => {
            try {
                const data = await api.getVideoStatus(id);
                setStatus(data.status); // downloading, transcribing, analyzing, clips_ready, or error

                if (data.status === 'clips_ready') {
                    clearInterval(interval);
                    navigate(`/results/${id}`);
                }
                if (data.status === 'error') {
                    clearInterval(interval);
                }
            } catch (err) {
                console.error("Status polling failed:", err);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [id, navigate]);

    // UI State Resolvers
    const statuses = ['pending', 'downloading', 'transcribing', 'analyzing', 'clips_ready'];
    const currentIndex = statuses.indexOf(status) === -1 ? 0 : statuses.indexOf(status);

    const isCompleted = (step: number) => {
        if (status === 'error') return false;
        return currentIndex > step;
    };

    const isActive = (step: number) => {
        if (status === 'error') return false;
        return currentIndex === step;
    };

    return (
        <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col selection:bg-primary selection:text-on-primary">
            {/* TopNavBar */}
            <nav className="fixed top-0 w-full z-50 bg-[#060e20]/80 backdrop-blur-xl border-b-[1.5px] border-[#40485d]/15 shadow-[0_20px_40px_rgba(0,0,0,0.3)] flex justify-between items-center px-8 py-4 max-w-full">
                <div className="flex items-center gap-8">
                    <span className="text-2xl font-bold bg-gradient-to-br from-[#ba9eff] to-[#8455ef] bg-clip-text text-transparent font-headline tracking-tight">Moments</span>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-6">
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="relative z-10 w-full max-w-2xl">
                    <div className="text-center mb-12">
                        {status === 'error' ? (
                            <>
                                <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight mb-4 text-error">
                                    Analysis Failed
                                </h1>
                                <p className="text-on-surface-variant font-body text-lg max-w-md mx-auto">
                                    Our ethereal engine couldn't grab the video data. Verify the YouTube URL is public.
                                </p>
                            </>
                        ) : (
                            <>
                                <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight mb-4 text-on-surface">
                                    Processing your <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Moment</span>
                                </h1>
                                <p className="text-on-surface-variant font-body text-lg max-w-md mx-auto">
                                    Sit back while our neural engine transforms your raw footage into viral gold.
                                </p>
                            </>
                        )}
                    </div>

                    <div className="glass-card rounded-xl p-8 md:p-12 border-t-[1.5px] border-l-[1.5px] border-[#40485d]/15 shadow-2xl">
                        <div className="space-y-10 relative">
                            {/* Connector Line */}
                            <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-outline-variant/30"></div>

                            {/* Step 1: Downloading */}
                            <div className={`flex items-start gap-6 relative group ${!isCompleted(1) && !isActive(1) ? 'opacity-40 grayscale' : ''}`}>
                                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${isCompleted(1) ? 'bg-secondary-container border-secondary/20 shadow-[0_0_20px_rgba(83,221,252,0.15)]' :
                                    isActive(1) ? 'bg-primary/20 border-primary/40 shadow-[0_0_30px_rgba(186,158,255,0.25)] pulse-glow' :
                                        'bg-surface-container border-outline-variant/30'
                                    }`}>
                                    <span className={`material-symbols-outlined ${isCompleted(1) ? 'text-secondary' : isActive(1) ? 'text-primary animate-spin' : 'text-on-surface-variant'} text-xl`} style={{ fontVariationSettings: "'FILL' 1" }}>
                                        {isCompleted(1) ? 'check_circle' : isActive(1) ? 'sync' : 'cloud_download'}
                                    </span>
                                </div>
                                <div className="pt-1">
                                    <h3 className={`font-headline text-lg ${isActive(1) ? 'font-bold text-primary' : 'font-semibold text-on-surface'}`}>Downloading Video</h3>
                                    <p className="text-on-surface-variant text-sm mt-1">{isActive(1) ? 'Extracting high-quality raw source...' : 'Source file retrieved from cloud storage'}</p>
                                </div>
                            </div>

                            {/* Step 2: Transcribing */}
                            <div className={`flex items-start gap-6 relative group ${!isCompleted(2) && !isActive(2) ? 'opacity-40 grayscale' : ''}`}>
                                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${isCompleted(2) ? 'bg-secondary-container border-secondary/20 shadow-[0_0_20px_rgba(83,221,252,0.15)]' :
                                    isActive(2) ? 'bg-primary/20 border-primary/40 shadow-[0_0_30px_rgba(186,158,255,0.25)] pulse-glow' :
                                        'bg-surface-container border-outline-variant/30'
                                    }`}>
                                    <span className={`material-symbols-outlined ${isCompleted(2) ? 'text-secondary' : isActive(2) ? 'text-primary animate-pulse' : 'text-on-surface-variant'} text-xl`} style={{ fontVariationSettings: "'FILL' 1" }}>
                                        {isCompleted(2) ? 'check_circle' : isActive(2) ? 'graphic_eq' : 'record_voice_over'}
                                    </span>
                                </div>
                                <div className="pt-1">
                                    <h3 className={`font-headline text-lg ${isActive(2) ? 'font-bold text-primary' : 'font-semibold text-on-surface'}`}>Transcribing &amp; Diarization</h3>
                                    <p className="text-on-surface-variant text-sm mt-1">{isActive(2) ? 'Deep learning tracking speaker segments...' : 'AssemblyAI transcription and speaker labeling complete'}</p>
                                </div>
                            </div>

                            {/* Step 3: Analyzing */}
                            <div className={`flex items-start gap-6 relative group ${!isCompleted(3) && !isActive(3) ? 'opacity-40 grayscale' : ''}`}>
                                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${isCompleted(3) ? 'bg-secondary-container border-secondary/20 shadow-[0_0_20px_rgba(83,221,252,0.15)]' :
                                    isActive(3) ? 'bg-primary/20 border-primary/40 shadow-[0_0_30px_rgba(186,158,255,0.25)] pulse-glow' :
                                        'bg-surface-container border-outline-variant/30'
                                    }`}>
                                    <span className={`material-symbols-outlined ${isCompleted(3) ? 'text-secondary' : isActive(3) ? 'text-primary animate-spin' : 'text-on-surface-variant'} text-xl`} style={{ fontVariationSettings: "'FILL' 1" }}>
                                        {isCompleted(3) ? 'check_circle' : isActive(3) ? 'auto_awesome' : 'troubleshoot'}
                                    </span>
                                </div>
                                <div className="pt-1">
                                    <h3 className={`font-headline text-lg ${isActive(3) ? 'font-bold text-primary' : 'font-semibold text-on-surface'}`}>AI Analyzing for Viral Moments</h3>
                                    <p className="text-on-surface text-sm mt-1 font-medium italic opacity-80">{isActive(3) ? 'Evaluating narrative flow and peak engagement markers...' : 'Viral score arrays mapped'}</p>
                                </div>
                            </div>

                            {/* Step 4: Clips Ready (Redirect wait state) */}
                            <div className={`flex items-start gap-6 relative group ${status !== 'clips_ready' ? 'opacity-40 grayscale' : ''}`}>
                                <div className="relative z-10 w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0 border border-outline-variant/30">
                                    <span className="material-symbols-outlined text-on-surface-variant text-xl">video_settings</span>
                                </div>
                                <div className="pt-1">
                                    <h3 className="font-headline text-lg font-semibold text-on-surface">Generating Clip Previews</h3>
                                    <p className="text-on-surface-variant text-sm mt-1">Applying kinetic typography and layout templates</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-8 px-4">
                        <div className="flex items-center gap-2">
                            <span className={`inline-block w-2 h-2 rounded-full ${status === 'error' ? 'bg-error' : 'bg-secondary pulse-glow'}`}></span>
                            <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">Live Pipeline Status: {status}</span>
                        </div>
                        {status === 'error' && (
                            <button onClick={() => navigate("/")} className="text-primary text-xs uppercase tracking-widest hover:underline cursor-pointer">
                                Try Another Link
                            </button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProcessingPage;
