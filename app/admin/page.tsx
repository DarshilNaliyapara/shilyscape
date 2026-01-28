"use client";

import { useState } from 'react';
import {
  User,
  Image as ImageIcon,
  Upload,
  ArrowLeftIcon,
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

  const Sidebar = () => (
    <div className="w-64 bg-neutral-900/50 backdrop-blur-xl border-r border-neutral-800 text-neutral-400 h-screen flex flex-col fixed left-0 top-0 z-20">
      <div className="p-6 flex items-center gap-3 text-white mb-2">
        <div className="p-2 bg-cyan-600 rounded-lg">
          <LayoutDashboard size={20} className="text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight">Admin<span className="text-cyan-500">Panel</span></span>
      </div>

      {isAuthenticated && (
        <div className="px-6 py-6 mx-4 mb-4 bg-neutral-800/50 rounded-xl border border-neutral-800 flex flex-col items-center">
          <div className="relative">
            <img
              src={user.data.avatar}
              alt="Admin"
              className="w-14 h-14 rounded-full border-2 border-cyan-500 mb-3 object-cover shadow-lg shadow-cyan-500/20"
            />
            <div className="absolute bottom-3 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-neutral-900"></div>
          </div>
          <h3 className="font-semibold text-neutral-200 text-sm">{user.data.displayName}</h3>
          <p className="text-xs text-neutral-500 mt-0.5">@{user.data.userName}</p>
        </div>
      )}

      <nav className="flex-1 px-4 space-y-2">
        {isAdmin &&
          <button
            onClick={() => { setActiveTab('users'); setEditingWallpaper(null); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${activeTab === 'users'
              ? 'bg-gradient-to-r from-cyan-600 text-white shadow-lg '
              : 'hover:bg-neutral-800/50 text-neutral-400 hover:text-neutral-200'
              }`}
          >
            <User size={18} /> <span>Users</span>
          </button>
        }
        <button
          onClick={() => { setActiveTab('wallpapers'); setEditingWallpaper(null); }}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${activeTab === 'wallpapers'
            ? 'bg-gradient-to-r from-cyan-600 text-white shadow-lg'
            : 'hover:bg-neutral-800/50 text-neutral-400 hover:text-neutral-200'
            }`}
        >
          <ImageIcon size={18} /> <span>Wallpapers</span>
        </button>
      </nav>

      <Link href="/" className="p-4 border-t border-neutral-800 flex items-center gap-2 font-medium text-neutral-500 transition-colors hover:text-white">
        <ArrowLeftIcon size={14} /> Back to Site
      </Link>
    </div>
  );

  return (
    <AdminGuard>
      <div className="min-h-screen bg-neutral-950 font-sans text-neutral-200 selection:bg-cyan-500/30">
        <Sidebar />

        {isUploadModalOpen && (
          <UploadModal
            onClose={() => setIsUploadModalOpen(false)}
            onUploadComplete={() => { setIsUploadModalOpen(false); }}
          />
        )}

        <main className="ml-64 px-8 min-h-screen relative">
          <header className={`sticky top-0 z-40 -mx-8 px-8 pb-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 transition-all
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