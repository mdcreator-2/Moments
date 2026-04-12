import React from 'react';

const ResultsPage = () => {
    return (
        <div className="bg-background text-on-background font-body selection:bg-primary/30 selection:text-primary min-h-screen flex flex-col">
            {/* TopNavBar */}
            <header className="w-full sticky top-0 z-50 bg-[#060e20]/60 backdrop-blur-xl border-b border-[#40485d]/15 shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
                <div className="flex justify-between items-center px-8 py-4 max-w-full">
                    <div className="flex items-center gap-8">
                        <span className="text-2xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-[#ba9eff] to-[#8455ef] font-headline">Moments</span>
                    </div>
                </div>
            </header>

            <div className="flex flex-1">
                {/* Main Content */}
                <main className="flex-1 p-8 bg-surface-dim">
                    <div className="max-w-7xl mx-auto">
                        {/* Header Section */}
                        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                                    <span className="text-secondary text-xs font-bold uppercase tracking-[0.2em] font-label">Analysis Complete</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tighter text-on-surface">
                                    Found <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">4 Viral Moments</span>
                                </h1>
                                <p className="text-on-surface-variant mt-4 max-w-xl text-lg leading-relaxed">
                                    Our AI engine has identified key segments with high engagement potential. Ready for vertical export.
                                </p>
                            </div>
                        </div>

                        {/* Bento Grid for Clip Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {/* Card 1: Default State */}
                            <div className="glass-card ghost-border-top-left rounded-xl overflow-hidden flex flex-col group hover:translate-y-[-4px] transition-all duration-500">
                                <div className="aspect-[9/16] relative bg-surface-container-lowest overflow-hidden">
                                    <img className="w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-80 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeuWtgq7OC7tiM__SLKi3yMc5IdVTejbwEv99cltY4XG6EJip_UQhzs9EBb683dBGOniwpm5k5Bv5HFfEJRX-gWA6ndUDItHuNQPJ6qYpCivWzH8IeLhTP17zWv_D8Ag-CzWb5xvq1vB4YV-Ngb-pejU1xIHCcgoyDOWqT52Wim4Sh573JpBQ4MRD69_RnCWjlaoI5r6wBDe0qn_WUcCl8SthbM5JNWp9Cx1k04BF28VgePiqMgyQMLVwmRbCSrZJTaPzcTzTc1XA" alt="AI visual" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent"></div>
                                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                                        <div className="px-3 py-1 rounded-full bg-surface-container-lowest/80 backdrop-blur-md border border-white/10 text-[10px] font-bold text-on-surface uppercase tracking-wider">
                                            01:24 - 02:15
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-surface-container-lowest/80 backdrop-blur-md border border-secondary/30 flex items-center justify-center shadow-[0_0_15px_rgba(83,221,252,0.3)]">
                                            <div className="text-center">
                                                <div className="text-[14px] font-headline font-bold text-secondary leading-none">92</div>
                                                <div className="text-[6px] text-secondary/70 font-bold uppercase">Virality</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <h3 className="text-xl font-headline font-bold text-on-surface mb-2">The Future of AI Design</h3>
                                    <p className="text-sm text-on-surface-variant/80 mb-6 flex-1 italic leading-relaxed">
                                        <span className="text-primary font-bold not-italic">Why it works:</span> High energy intro with controversial hook that leads into a visual reveal.
                                    </p>
                                    <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-dim text-on-primary font-bold text-sm tracking-wide shadow-lg shadow-primary/10 hover:shadow-primary/30 transition-all active:scale-95">
                                        Render Vertical Short
                                    </button>
                                </div>
                            </div>

                            {/* Card 2: Rendering State */}
                           <div className="glass-card ghost-border-top-left rounded-xl overflow-hidden flex flex-col group opacity-90">
                                <div className="aspect-[9/16] relative bg-surface-container-lowest overflow-hidden">
                                    <img className="w-full h-full object-cover opacity-40 grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBVxA_kpk_egFjudWXnFfjRikpwcgQ6EOvmg3am3GfOLvxs23CYM5f1Phf43YQ7kjdZFPKNHiOcyYLR6d1wQgP3Dw7T-PSIWVxGna2UexZyBOiHVhrkoN-ahb-5xgXJL-1PLQ7AvvZVN2JseeIZi6kt5kdy3P5JQA5yG0awOkzkRJBKhR84jrea_g3MpxJsB7RuToYxY7D_4ocnHw3L9xMuWCdodgnOiqWpMcJCAQPfsiBTR0fzWyiNNjE11xm_yEHC84bTnGdFtE" alt="Digital architecture" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent"></div>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-dim/40 backdrop-blur-sm">
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                                        </div>
                                        <span className="text-primary text-xs font-bold uppercase tracking-widest mt-4">Processing...</span>
                                    </div>
                                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start opacity-40">
                                        <div className="px-3 py-1 rounded-full bg-surface-container-lowest/80 border border-white/10 text-[10px] font-bold text-on-surface uppercase tracking-wider">
                                            05:40 - 06:12
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-surface-container-lowest/80 border border-secondary/30 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="text-[14px] font-headline font-bold text-secondary leading-none">88</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <h3 className="text-xl font-headline font-bold text-on-surface/50 mb-2">Sustainable Tech Growth</h3>
                                    <p className="text-sm text-on-surface-variant/40 mb-6 flex-1 italic leading-relaxed">
                                        <span className="text-primary/50 font-bold not-italic">Why it works:</span> Fast-paced transition sequence that syncs perfectly with trending audio beats.
                                    </p>
                                    <button disabled className="w-full py-3.5 rounded-xl bg-surface-container-high text-on-surface-variant/30 font-bold text-sm tracking-wide flex items-center justify-center gap-2 cursor-not-allowed">
                                        <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                                        Rendering...
                                    </button>
                                </div>
                            </div>

                            {/* Card 3: Download State */}
                            <div className="glass-card ghost-border-top-left rounded-xl overflow-hidden flex flex-col group border-secondary/20 bg-secondary/5 transition-all">
                                <div className="aspect-[9/16] relative bg-surface-container-lowest overflow-hidden">
                                     <img className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzMlYyZzY4bQ96wsVrgi7q4HsQlxXswOWCel0JxUROa_NicoHcL1O30KryhUpS3WhIdxlF1H78HgfPpT39WNOb8IYKlXmvU_h8lzslTPFM84_yteRKyqva5Q4PbVD0XckXE--WXxA1UtJamEvS58xUwNVCgg5lWMQMbxcp8ebPkVdu8bU7fJTmZ94ILi62l7y1QFhI9GVHHjNeEx2s9Kvo3G6ze27ftBJhBCByPlavyAxHBwojZxVQCAawp-tOAcnckahJlHiSm3A" alt="Tech glow" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-14 h-14 rounded-full bg-secondary/20 backdrop-blur-xl border border-secondary/40 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-secondary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                        </div>
                                    </div>
                                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                                        <div className="px-3 py-1 rounded-full bg-secondary/80 text-on-secondary text-[10px] font-bold uppercase tracking-wider">
                                            12:10 - 13:02
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-surface-container-lowest/80 border border-secondary/30 flex items-center justify-center shadow-[0_0_15px_rgba(83,221,252,0.3)]">
                                            <div className="text-center">
                                                <div className="text-[14px] font-headline font-bold text-secondary leading-none">95</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <h3 className="text-xl font-headline font-bold text-on-surface mb-2">Coding in the Clouds</h3>
                                    <p className="text-sm text-on-surface-variant/80 mb-6 flex-1 italic leading-relaxed">
                                        <span className="text-primary font-bold not-italic">Why it works:</span> Exceptional audience retention during the technical explanation segment.
                                    </p>
                                    <button className="w-full py-3.5 rounded-xl bg-secondary text-on-secondary-fixed font-bold text-sm tracking-wide shadow-lg shadow-secondary/20 hover:bg-secondary-dim transition-all flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined text-lg">download</span>
                                        Download MP4
                                    </button>
                                </div>
                            </div>

                            {/* Card 4: Default State */}
                            <div className="glass-card ghost-border-top-left rounded-xl overflow-hidden flex flex-col group hover:translate-y-[-4px] transition-all duration-500">
                                <div className="aspect-[9/16] relative bg-surface-container-lowest overflow-hidden">
                                     <img className="w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-80 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtyIpRGc5cQvDUoE7Z8irYdyA5H7a5QovneLNo3lVuPtfNtXnQViZCGm9kRR6EHAEJVRJ8Jb0XnPdUgMvTw98N43Tc9QT4KpKTC_MkPrm6zwzbpALsNngNIJ7dGIhLz5ZFWDTKdqrxloBD0LrtIqyeZkqanf-COoL_QvKp-acvL9e2KpyCTWHcw8vh9i_C3zVs1dUAH2bSlctH4UY72HQAyAdHATiHg-ZmGkhzcw4okeiWyjW_D-xjbCtFWArn4CRZ_xkzbn4h3ZY" alt="Creative coding" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent"></div>
                                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                                        <div className="px-3 py-1 rounded-full bg-surface-container-lowest/80 backdrop-blur-md border border-white/10 text-[10px] font-bold text-on-surface uppercase tracking-wider">
                                            08:32 - 09:10
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-surface-container-lowest/80 backdrop-blur-md border border-secondary/30 flex items-center justify-center shadow-[0_0_15px_rgba(83,221,252,0.3)]">
                                            <div className="text-center">
                                                <div className="text-[14px] font-headline font-bold text-secondary leading-none">81</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <h3 className="text-xl font-headline font-bold text-on-surface mb-2">The Designer's Workflow</h3>
                                    <p className="text-sm text-on-surface-variant/80 mb-6 flex-1 italic leading-relaxed">
                                        <span className="text-primary font-bold not-italic">Why it works:</span> Strong educational value with clear call-to-action towards the end.
                                    </p>
                                    <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-dim text-on-primary font-bold text-sm tracking-wide shadow-lg shadow-primary/10 hover:shadow-primary/30 transition-all active:scale-95">
                                        Render Vertical Short
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Footer Stats/Insight Toast */}
                        <div className="mt-16 glass-card rounded-2xl p-8 border-l-4 border-tertiary shadow-2xl">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-full bg-tertiary/10 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-tertiary text-4xl">insights</span>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-headline font-bold text-on-surface">AI Predicted Growth: +420%</h4>
                                        <p className="text-on-surface-variant text-sm">Based on current TikTok and Reels trending audio patterns.</p>
                                    </div>
                                </div>
                                <div className="flex gap-12">
                                    <div className="text-center">
                                        <div className="text-2xl font-headline font-bold text-on-surface">1.2M</div>
                                        <div className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Est. Reach</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-headline font-bold text-on-surface">14.2k</div>
                                        <div className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Est. Shares</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-headline font-bold text-on-surface">High</div>
                                        <div className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Confidence</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ResultsPage;
