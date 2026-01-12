import Link from "next/link";
import Navbar from "../components/navbar";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30">
            <Navbar />
            {/* Background Glow Effects */}
            <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

            <div className="max-w-[1200px] mx-auto px-6 pt-32 pb-20 relative z-10">

                {/* 1. HERO SECTION */}
                <div className="text-center max-w-3xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Est. 2025</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
                        Redefining Your <br />
                        Digital Canvas.
                    </h1>

                    <p className="text-lg text-gray-400 leading-relaxed">
                        ShilyScape isn't just a wallpaper repository. It's a curated gallery of high-fidelity digital art, designed to transform the screens you look at every day.
                    </p>
                </div>

                {/* 2. STATS GRID (Bento Style) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
                    {[
                        { label: "Wallpapers", value: "5k+", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
                        { label: "Downloads", value: "1M+", icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" },
                        { label: "Artists", value: "120", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
                        { label: "Uptime", value: "99.9%", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors group">
                            <svg className="w-6 h-6 text-gray-500 mb-4 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                            </svg>
                            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                            <p className="text-sm text-gray-500 font-mono uppercase tracking-wider">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* 3. MISSION SECTION */}
                <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-white">The Philosophy</h2>
                        <div className="w-12 h-1 bg-cyan-500 rounded-full" />
                        <p className="text-gray-400 leading-relaxed">
                            We believe that your desktop environment sets the tone for your productivity and mood. A cluttered, boring screen leads to a cluttered mind.
                        </p>
                        <p className="text-gray-400 leading-relaxed">
                            ShilyScape was built to solve the problem of finding high-quality, non-pixelated wallpapers without navigating through spammy websites. We serve pure aesthetics, directly to your device.
                        </p>
                    </div>

                    {/* Visual Grid Representation */}
                    <div className="grid grid-cols-2 gap-4 opacity-80">
                        <div className="space-y-4 translate-y-8">
                            <div className="h-40 bg-neutral-800 rounded-2xl border border-white/5 animate-pulse" />
                            <div className="h-56 bg-gradient-to-br from-cyan-900/20 to-neutral-900 rounded-2xl border border-white/10" />
                        </div>
                        <div className="space-y-4">
                            <div className="h-56 bg-neutral-900 rounded-2xl border border-white/5" />
                            <div className="h-40 bg-neutral-800 rounded-2xl border border-white/5" />
                        </div>
                    </div>
                </div>

                {/* 4. TECH STACK (Optional - Makes it look 'Geeky') */}
                <div className="border-t border-white/10 pt-16">
                    <h2 className="text-center text-sm font-mono text-gray-500 uppercase tracking-widest mb-12">
                        Powered by Modern Tech
                    </h2>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Tech names as text for simplicity, or use logos */}
                        {["Next.js 14", "React", "Tailwind CSS", "Cloudinary", "Framer Motion"].map((tech) => (
                            <span key={tech} className="text-lg font-bold text-white hover:text-cyan-400 cursor-default transition-colors">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                {/* 5. CTA */}
                <div className="mt-10 flex justify-center">
                    <Link
                        href="/wallpapers"
                        className="group relative px-8 py-4 bg-[#111] border border-white/20 rounded-full overflow-hidden hover:border-cyan-500 transition-colors"
                    >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative flex items-center gap-3 font-bold text-gray-300 group-hover:text-white">
                            Explore Collection
                            <svg
                                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                            </svg>
                        </span>
                    </Link>
                </div>
            </div>
        </main>
    );
}
