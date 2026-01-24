"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useScroll } from "@/hooks/useScroll";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
import api from "@/utils/axios";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const pathname = usePathname();
  const profileRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { user, isLoading, mutate, isAuthenticated, isAdmin } = useCurrentUser();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    setLoading(true)
    try {
      const res = await api.post(`/auth/logout`);
      if (res.status == 200) {
        toast.success("Successfully logged out", {
          style: {
            background: '#09090b',
            color: '#f4f4f5',
            border: '1px solid #27272a',
            borderRadius: '12px',
            padding: '12px 20px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
            fontWeight: '500',
            fontSize: '14px',
          },
          iconTheme: {
            primary: '#22c55e',
            secondary: '#ffffff',
          },
        });

        await mutate(null, false);
      }
    } catch (error) {
      toast.error("Failed to logout");
    }
    setLoading(false)
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("")
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Wallpapers", href: "/wallpapers" },
    { name: "Collections", href: "/collections" },
    { name: "About", href: "/about" },
  ];

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />

      <nav
        className={`
          fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ease-in-out border-b border-white/0 px-4 md:px-11
          ${useScroll() || isMobileMenuOpen
            ? "bg-[#050505]/80 backdrop-blur-xl border-white/5 py-4 shadow-lg"
            : "bg-transparent backdrop-blur-xl py-4"
          }
        `}
      >
        <div className="relative max-w-[1800px] mx-auto flex items-center justify-between">

          <Link href="/" className="flex items-center gap-2 group z-[101]">
            <img
              src="/favicon.ico"
              alt="ShilyScape Logo"
              className="w-12 h-12 rounded-lg object-contain group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300"
            />
            <span className="text-lg md:text-xl font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
              ShilyScape
            </span>
          </Link>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-8 bg-white/5 px-6 py-2 rounded-full border border-white/5 backdrop-blur-sm z-[100]">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-all duration-300 relative ${isActive ? "text-white" : "text-gray-400 hover:text-white"}`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_10px_cyan]" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center min-[1130px]:gap-4 z-[101]">
            <form onSubmit={handleSearch}>
              <div className="hidden min-[1130px]:flex w-full max-w-sm relative">
                <input
                  type="text"
                  placeholder="Search wallpapers..."
                  onChange={(e) => setSearchQuery(e.target.value)}
                  value={searchQuery}
                  className="w-full bg-white/5 border border-white/10 rounded-full py-2 px-5 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50 transition-all"
                />
                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            {isLoading ? (
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 animate-pulse" />
            ) : isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1px] cursor-pointer hover:scale-105 transition-transform focus:outline-none"
                >
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                    {user.data.avatarUrl ? (
                      <img src={user.data.avatarUrl} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold text-white">
                        {user.data.displayName?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-4 w-72 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 origin-top-right z-50">
                    <div className="p-4 border-b border-white/5 bg-white/5">
                      <p className="text-sm font-semibold text-white truncate">{user.data.displayName} - ({user.data.role || "user"})</p>
                      {user.data.userName &&
                        <p className="text-xs text-gray-400 truncate mt-0.5">@{user.data.userName}</p>
                      }
                    </div>
                    <div className="p-1">
                      {isAdmin &&
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors group"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <svg
                            className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          </svg>
                          Admin Panel
                        </Link>
                      }
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors group"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </Link>

                      <button
                        onClick={handleLogout}
                        disabled={loading}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-left group"
                      >
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login">
                <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-1.5 px-4 md:py-2 md:px-6 rounded-xl text-sm md:text-sm transition-all">
                  Login
                </button>
              </Link>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white/80 hover:text-white z-[101]"
            >
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`
          fixed inset-0 z-[99] bg-black/95 backdrop-blur-3xl md:hidden transition-all duration-500 cubic-bezier(0.32, 0.72, 0, 1)
          ${isMobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"}
        `}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
          <div className="flex flex-col items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-2xl font-bold transition-all duration-300 ${pathname === link.href ? "text-cyan-400 scale-110" : "text-white/60 hover:text-white"}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="absolute bottom-10 text-center">
            <p className="text-white/20 text-xs">© 2026 ShilyScape</p>
          </div>
        </div>
      </div>
    </>
  );
}