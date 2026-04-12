import React from 'react';

const ProcessingPage = () => {
    return (
        <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col selection:bg-primary selection:text-on-primary">
            {/* TopNavBar */}
            <nav className="fixed top-0 w-full z-50 bg-[#060e20]/80 backdrop-blur-xl border-b-[1.5px] border-[#40485d]/15 shadow-[0_20px_40px_rgba(0,0,0,0.3)] flex justify-between items-center px-8 py-4 max-w-full">
                <div className="flex items-center gap-8">
                    <span className="text-2xl font-bold bg-gradient-to-br from-[#ba9eff] to-[#8455ef] bg-clip-text text-transparent font-headline tracking-tight">Moments</span>
                    <div className="hidden md:flex items-center gap-6">
                        <a className="text-[#dee5ff]/60 hover:text-[#ba9eff] transition-colors duration-300 font-headline tracking-tight" href="#">Projects</a>
                        <a className="text-[#dee5ff]/60 hover:text-[#ba9eff] transition-colors duration-300 font-headline tracking-tight" href="#">Templates</a>
                        <a className="text-[#dee5ff]/60 hover:text-[#ba9eff] transition-colors duration-300 font-headline tracking-tight" href="#">Assets</a>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="material-symbols-outlined text-[#dee5ff]/60 hover:text-[#ba9eff] active:scale-95 transition-transform">account_circle</button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-6">
                {/* Background Ambient Light */}
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
                
                <div className="relative z-10 w-full max-w-2xl">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight mb-4 text-on-surface">
                            Processing your <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Moment</span>
                        </h1>
                        <p className="text-on-surface-variant font-body text-lg max-w-md mx-auto">
                            Sit back while our neural engine transforms your raw footage into viral gold.
                        </p>
                    </div>

                    {/* Timeline Card */}
                    <div className="glass-card rounded-xl p-8 md:p-12 border-t-[1.5px] border-l-[1.5px] border-[#40485d]/15 shadow-2xl">
                        <div className="space-y-10 relative">
                            {/* Connector Line */}
                            <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-outline-variant/30"></div>
                            
                            {/* Step 1: Completed */}
                            <div className="flex items-start gap-6 relative group">
                                <div className="relative z-10 w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center shrink-0 border border-secondary/20 shadow-[0_0_20px_rgba(83,221,252,0.15)]">
                                    <span className="material-symbols-outlined text-secondary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                </div>
                                <div className="pt-1">
                                    <h3 className="font-headline text-lg font-semibold text-on-surface">Downloading Video</h3>
                                    <p className="text-on-surface-variant text-sm mt-1">Source file retrieved from cloud storage (4.2GB)</p>
                                </div>
                            </div>
                            
                            {/* Step 2: Completed */}
                            <div className="flex items-start gap-6 relative group">
                                <div className="relative z-10 w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center shrink-0 border border-secondary/20 shadow-[0_0_20px_rgba(83,221,252,0.15)]">
                                    <span className="material-symbols-outlined text-secondary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                </div>
                                <div className="pt-1">
                                    <h3 className="font-headline text-lg font-semibold text-on-surface">Transcribing &amp; Identifying Speakers</h3>
                                    <p className="text-on-surface-variant text-sm mt-1">Whisper Large v3 active • 3 distinct voices detected</p>
                                </div>
                            </div>
                            
                            {/* Step 3: Current */}
                            <div className="flex items-start gap-6 relative group">
                                <div className="relative z-10 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/40 shadow-[0_0_30px_rgba(186,158,255,0.25)] pulse-glow">
                                    <span className="material-symbols-outlined text-primary text-xl animate-spin">auto_awesome</span>
                                </div>
                                <div className="pt-1">
                                    <h3 className="font-headline text-lg font-bold text-primary">AI Analyzing for Viral Moments</h3>
                                    <p className="text-on-surface text-sm mt-1 font-medium italic opacity-80">Evaluating narrative flow and peak engagement markers...</p>
                                    <div className="mt-4 w-full h-1.5 bg-surface-container-lowest rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-primary to-primary-dim w-[64%] rounded-full shadow-[0_0_10px_rgba(186,158,255,0.5)]"></div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Step 4: Pending */}
                            <div className="flex items-start gap-6 relative opacity-40 grayscale group">
                                <div className="relative z-10 w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0 border border-outline-variant/30">
                                    <span className="material-symbols-outlined text-on-surface-variant text-xl">video_settings</span>
                                </div>
                                <div className="pt-1">
                                    <h3 className="font-headline text-lg font-semibold text-on-surface">Generating Clip Previews</h3>
                                    <p className="text-on-surface-variant text-sm mt-1">Applying kinetic typography and layout templates</p>
                                </div>
                            </div>
                        </div>

                        {/* Insight Toast-style Info */}
                        <div className="mt-12 p-4 glass-card border-l-4 border-tertiary rounded-lg bg-surface-container-highest/30 flex items-start gap-4">
                            <span className="material-symbols-outlined text-tertiary">info</span>
                            <div>
                                <p className="font-label text-xs uppercase tracking-widest text-tertiary font-bold mb-1">AI Pulse Insight</p>
                                <p className="text-on-surface-variant text-sm leading-relaxed">High energy segment detected at <span className="text-on-surface font-semibold">12:44</span>. Our engine is prioritizing this for the main vertical clip.</p>
                            </div>
                        </div>
                    </div>

                    {/* Card Bottom Meta */}
                    <div className="flex items-center justify-between mt-8 px-4">
                        <div className="flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-secondary pulse-glow"></span>
                            <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">Live Pipeline: US-East-1</span>
                        </div>
                        <div className="text-on-surface-variant text-xs font-label uppercase tracking-widest">Est. Time Remaining: 2m 14s</div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full py-8 flex flex-col items-center gap-4 w-full mt-auto bg-transparent">
                <div className="flex items-center gap-6">
                    <a className="font-body text-xs uppercase tracking-widest text-[#dee5ff]/40 hover:text-[#53ddfc] transition-colors" href="#">Support</a>
                    <a className="font-body text-xs uppercase tracking-widest text-[#dee5ff]/40 hover:text-[#53ddfc] transition-colors" href="#">Privacy Policy</a>
                    <a className="font-body text-xs uppercase tracking-widest text-[#dee5ff]/40 hover:text-[#53ddfc] transition-colors" href="#">Terms of Service</a>
                </div>
                <p className="font-body text-xs uppercase tracking-widest text-[#dee5ff]/40">© 2024 Moments AI. Processing secured by Ethereal Engine.</p>
            </footer>

            {/* Decorative Background Image */}
            <div className="fixed inset-0 -z-10 opacity-30 pointer-events-none overflow-hidden">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-XTNE8snDUz8ouj9JrCCSO0Tyy8Fiug764hnoScz00e-Q1Ry5dE2_cISGjHhigpDLlEYAQ5JGoLaflvAm1KONrotptg-XqG0TVNe0p_zCFj2XNTh1_W0l2yzyXS1wUJHrev8WUF1xmqDnuf2IRy0nWT5ZOFEtBQpzdgvYvPxquNBb-H8coKB4tKx4YtslqfSUDcVuWPSBauVPxscPQwRhyObxe6BPJumwXshIhMCTL2vlDMpSzk8JhLXe447xrGW9KoOP02B4Xw4" alt="Abstract Background" />
            </div>
        </div>
    );
};

export default ProcessingPage;
