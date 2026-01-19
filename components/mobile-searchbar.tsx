"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function MobileSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathname = usePathname();
    const isWallpaperPage = pathname?.includes("/wallpapers");

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
            setIsOpen(false);
            inputRef.current?.blur();
        }
    };

    return (
        <div
            ref={containerRef}
            className={`
            fixed right-5 z-[100]
            hidden max-[550px]:flex items-center
            rounded-full
            transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) overflow-hidden
            ${isWallpaperPage ? "bottom-15" : "bottom-5"}
            ${isOpen
                    ? "w-[calc(100vw-40px)] h-14 pl-4 pr-2 justify-start bg-white/20 backdrop-blur-xl"
                    : "w-14 h-14  justify-center p-0 bg-gradient-to-r from-cyan-500 to-blue-600"
                }
        `}
            onClick={() => !isOpen && setIsOpen(true)}
        >
            <form
                onSubmit={handleSearch}
                className={`
            flex items-center h-full transition-all duration-200
            ${isOpen ? "w-full" : "w-6"} 
          `}
            >

                <button
                    type="submit"
                    className={`
                    text-white shrink-0 p-0 m-0 flex items-center justify-center
                    transition-transform duration-200 
                    ${isOpen ? "scale-100" : "scale-110"}
                `}
                    onClick={(e) => !isOpen && e.preventDefault()}
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>

                {/* INPUT FIELD */}
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search..."
                    className={`
                    bg-transparent border-none outline-none text-white placeholder-white/70
                    h-full text-base
                    transition-all duration-200 ease-in-out
                    ${isOpen
                            ? "w-full ml-3 opacity-100"
                            : "w-0 ml-0 opacity-0 p-0 border-0" // Explicitly remove all spacing
                        }
                `}
                />

                {isOpen && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(false);
                            setQuery("");
                        }}
                        className="p-2 text-white/70 hover:text-white transition-colors min-w-[40px] shrink-0"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </form>
        </div>
    );
}