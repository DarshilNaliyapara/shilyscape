"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useScroll } from "@/utils/useScroll";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Wallpapers", href: "/wallpapers" },
    { name: "Collections", href: "/collections" },
    { name: "About", href: "/about" },
  ];

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 right-0 z-[100] md:px-6 transition-all duration-300 ease-in-out border-b border-white/0
          ${useScroll() 
            ? "bg-[#050505]/80 backdrop-blur-xl border-white/5 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]" 
            : "bg-transparent backdrop-blur-xl py-4"
          }
        `}
      >
        <div className="max-w-[1800px] mx-auto px-4 md:px-6 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-2 group">
            <img
              src="/favicon.ico"
              alt="ShilyScape Logo"
              className="w-12 h-12 rounded-lg object-contain group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300"
            />
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
              ShilyScape
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 bg-white/5 px-6 py-2 rounded-full border-b border-white/5 backdrop-blur-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`
                    text-sm font-medium transition-all duration-300 relative
                    ${isActive ? "text-white" : "text-gray-400 hover:text-white"}
                  `}
                >
                  {link.name}
                  <span 
                    className={`
                      absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_10px_cyan] transition-all duration-300
                      ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"}
                    `} 
                  />
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-neutral-900/50 hover:bg-neutral-800 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all group">
              <svg className="w-4 h-4 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-xs">Search art...</span>
              <kbd className="hidden lg:inline-block ml-2 px-1.5 py-0.5 text-[10px] font-mono bg-white/10 rounded text-gray-400">⌘K</kbd>
            </button>

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white/80 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen 
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
            
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1px] cursor-pointer hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                 <span className="text-xs font-bold text-white">DB</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div 
        className={`
          fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl md:hidden transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1)
          ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-3xl font-bold text-white/50 hover:text-white hover:scale-110 transition-all duration-300"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}