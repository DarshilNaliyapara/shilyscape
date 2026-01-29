"use client";

import { useState } from 'react';
import {
  User,
  Image as ImageIcon,
  Upload,
  Menu,
  ArrowRight,
  ArrowLeft,
  LayoutDashboard,
} from 'lucide-react';

import { UploadModal } from './upload';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import AdminGuard from '@/components/admin-guard';
import Link from "next/link";
import { AdminWallpaper } from './admin-wallpapers';
import { AdminUsers } from './admin-users';
import { EditWallpaper } from './editwallpaper';
import { useScroll } from '@/hooks/useScroll';

interface RawWallpaper {
  id: string;
  name?: string;
  category?: string;
  tags?: string[];
  imgLink: string;
}

export default function AdminPanel() {
  const { user, isAuthenticated, isAdmin } = useCurrentUser();

  const [activeTab, setActiveTab] = useState('wallpapers');
  const [editingWallpaper, setEditingWallpaper] = useState<RawWallpaper | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-neutral-950 font-sans text-neutral-200 selection:bg-cyan-500/30">
        
        {/* --- SIDEBAR START --- */}
        <div
          className={`${
            isCollapsed ? 'w-20' : 'w-64'
          } bg-neutral-900/50 backdrop-blur-xl border-r border-neutral-800 text-neutral-400 h-screen flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 ease-in-out`}
        >
          {/* Sidebar Header */}
          <div className={`
            flex transition-all duration-300 relative
            ${isCollapsed
              ? 'flex-col items-center justify-center pt-6 gap-4 mb-2'
              : 'flex-row items-center p-6 gap-3'
            } 
            text-white
          `}>
            {/* Toggle Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`
                hover:bg-neutral-800 rounded-md transition-colors z-50 text-neutral-400
                ${isCollapsed
                  ? 'p-2 order-1'
                  : 'absolute right-4 top-8 hover:text-white'
                }
              `}
            >
              {isCollapsed ? <ArrowRight size={20} /> : <Menu size={20} />}
            </button>

            {/* Logo Icon */}
            <div className={`
               p-2 bg-cyan-600 rounded-lg transition-all duration-300
               ${isCollapsed ? 'hidden' : ''} 
            `}>
              <LayoutDashboard size={20} className="text-white" />
            </div>

            {!isCollapsed && (
              <span className="font-bold text-lg tracking-tight whitespace-nowrap overflow-hidden">
                Admin<span className="text-cyan-500">Panel</span>
              </span>
            )}
          </div>

          {/* User Profile */}
          {isAuthenticated && (
            <div className={`
              mx-4 mb-2 flex flex-col items-center transition-all duration-300
              ${isCollapsed ? 'bg-transparent border-none py-2' : 'px-6 py-6 bg-neutral-800/50 rounded-xl border border-neutral-800'}
            `}>
              <div className="relative">
                <img
                  src={user.data.avatar}
                  alt="Admin"
                  className={`
                    rounded-full border-2 border-cyan-500 object-cover shadow-lg shadow-cyan-500/20 transition-all duration-300
                    ${isCollapsed ? 'w-10 h-10 mb-0' : 'w-14 h-14 mb-3'}
                  `}
                />
                <div className={`absolute bottom-0 right-0 bg-green-500 rounded-full border-2 border-neutral-900 ${isCollapsed ? 'w-2.5 h-2.5' : 'w-3 h-3 bottom-3'}`}></div>
              </div>

              {!isCollapsed && (
                <div className="text-center animate-in fade-in duration-300">
                  <h3 className="font-semibold text-neutral-200 text-sm whitespace-nowrap">{user.data.displayName}</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">@{user.data.userName}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 px-4 space-y-2">
            {isAdmin && (
              <button
                onClick={() => { setActiveTab('users'); setEditingWallpaper(null); }}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-xl transition-all duration-200 font-medium ${activeTab === 'users'
                  ? 'bg-gradient-to-r from-cyan-600 text-white shadow-lg '
                  : 'hover:bg-neutral-800/50 text-neutral-400 hover:text-neutral-200'
                  }`}
                title={isCollapsed ? "Users" : ""}
              >
                <User size={18} />
                {!isCollapsed && <span className="whitespace-nowrap">Users</span>}
              </button>
            )}

            <button
              onClick={() => { setActiveTab('wallpapers'); setEditingWallpaper(null); }}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-xl transition-all duration-200 font-medium ${activeTab === 'wallpapers'
                ? 'bg-gradient-to-r from-cyan-600 text-white shadow-lg'
                : 'hover:bg-neutral-800/50 text-neutral-400 hover:text-neutral-200'
                }`}
              title={isCollapsed ? "Wallpapers" : ""}
            >
              <ImageIcon size={18} />
              {!isCollapsed && <span className="whitespace-nowrap">Wallpapers</span>}
            </button>
          </nav>

          {/* Sidebar Footer */}
          <Link
            href="/"
            className={`p-4 border-t border-neutral-800 flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'} font-medium text-neutral-500 transition-colors hover:text-white`}
            title={isCollapsed ? "Back to Site" : ""}
          >
            <ArrowLeft size={18} />
            {!isCollapsed && <span className="whitespace-nowrap">Back to Site</span>}
          </Link>
        </div>
        {/* --- SIDEBAR END --- */}


        {isUploadModalOpen && (
          <UploadModal
            onClose={() => setIsUploadModalOpen(false)}
            onUploadComplete={() => { setIsUploadModalOpen(false); }}
          />
        )}

        {/* --- MAIN CONTENT --- */}
        {/* Added dynamic margin (ml-20 vs ml-64) and transition to match sidebar */}
        <main 
          className={`
            px-8 min-h-screen relative transition-all duration-300 ease-in-out
            ${isCollapsed ? 'ml-20' : 'ml-64'}
          `}
        >
          <header className={`sticky top-0 z-40 -mx-8 px-8 pb-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 transition-all relative
          ${useScroll()
              ? "bg-[#050505]/80 backdrop-blur-xl py-4 shadow-lg"
              : "bg-transparent backdrop-blur-xl py-4"
            }`}>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                {editingWallpaper ? 'Edit Wallpaper' : (activeTab === 'users' ? 'User Management' : 'Wallpaper Library')}
              </h1>
            </div>
            <div className="flex gap-4">
              {activeTab === 'wallpapers' && !editingWallpaper && (
                <>
                  <div>
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
                  </div>
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="group bg-white text-black hover:bg-neutral-200 px-3 py-2 rounded-xl font-semibold shadow-[0_0_15px_rgba(255,255,255,0.1)] flex items-center gap-2 transition-all active:scale-95"
                  >
                    <Upload size={18} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
                    <span>Upload New</span>
                  </button>
                </>
              )}
            </div>
          </header>

          <div className="animate-fade-in">
            {editingWallpaper ? (
              <EditWallpaper wallpaperData={editingWallpaper} isAdmin={isAdmin} onEdit={setEditingWallpaper} />
            ) : (
              <>
                {activeTab === 'wallpapers' && (
                  <AdminWallpaper onEdit={setEditingWallpaper} query={searchQuery} />
                )}

                {activeTab === 'users' && (
                  <AdminUsers />
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}