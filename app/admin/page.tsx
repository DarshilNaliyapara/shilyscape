"use client";

import { useState, useEffect, useCallback } from 'react';
import {
  User,
  Image as ImageIcon,
  Edit3,
  Trash2,
  X,
  Loader2,
  Save,
  Upload,
  ArrowLeftIcon,
  LayoutDashboard,
  Mail,
  Calendar,
  Shield,
  ChevronDown
} from 'lucide-react';

import { getWallpapers } from '@/action/action-wallpapers';
import { getCategories } from "@/action/get-categories";
import { UploadModal } from './upload';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import AdminGuard from '@/components/admin-guard';
import api from '@/utils/axios';
import Link from "next/link";
import CustomSelect from '@/components/custom-select';

// --- Interfaces ---
interface RawWallpaper {
  id: string;
  name?: string;
  category?: string;
  tags?: string[];
  imgLink: string;
}

interface UserData {
  _id: string;
  displayName?: string;
  userName: string;
  email?: string;
  image?: string;
  role?: string;
  createdAt?: string;
  emailVerified?: Date | null;
}

export default function AdminPanel() {
  const { user, isAuthenticated, isAdmin } = useCurrentUser();

  const [activeTab, setActiveTab] = useState('users');

  // Wallpaper State
  const [editingWallpaper, setEditingWallpaper] = useState<RawWallpaper | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [wallpapers, setWallpapers] = useState<RawWallpaper[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoadingWallpapers, setIsLoadingWallpapers] = useState(false);

  // User State
  const [usersList, setUsersList] = useState<UserData[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // --- Fetchers ---

  const fetchWallpapers = useCallback(async () => {
    setIsLoadingWallpapers(true);
    try {
      const response = await getWallpapers();
      const cats = await getCategories();
      setCategories(cats);

      const rawWallpapers = response?.data?.wallpapers || [];
      const formattedWallpapers = rawWallpapers.map((wp: RawWallpaper) => ({
        id: wp.id,
        name: wp.name || "UnNamed",
        category: wp.category || "Uncategorized",
        tags: wp.tags || [],
        imgLink: wp.imgLink,
      }));
      setWallpapers(formattedWallpapers);
    } catch (error) {
      console.error("Failed to fetch wallpapers", error);
    } finally {
      setIsLoadingWallpapers(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    try {
      const res = await api.get('/auth/users')
      console.log(res)
      setUsersList(Array.isArray(res.data.data) ? res.data.data : res.data.data.users || []);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  // --- Effects ---

  useEffect(() => {
    if (activeTab === 'wallpapers') fetchWallpapers();
    if (activeTab === 'users') fetchUsers();
  }, [activeTab, fetchWallpapers, fetchUsers]);

  // --- Handlers ---

  const handleEditSave = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = {
      name: formData.get("name"),
      category: formData.get("category"),
      tags: (formData.get("tags")?.toString() || "").split(",").map(t => t.trim()),
    };
    console.log("Saving Update:", updatedData);
    setEditingWallpaper(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // --- Components ---

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
            onUploadComplete={() => { setIsUploadModalOpen(false); fetchWallpapers(); }}
          />
        )}

        <main className="ml-64 px-8 pt-6 min-h-screen relative">
          {/* Top Bar */}
          <header className="mb-6 flex justify-between items-end pb-4 border-b border-neutral-800">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                {editingWallpaper ? 'Edit Wallpaper' : (activeTab === 'users' ? 'User Management' : 'Wallpaper Library')}
              </h1>
            </div>
            {activeTab === 'wallpapers' && !editingWallpaper && (
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="group bg-white text-black hover:bg-neutral-200 px-3 py-2 rounded-xl font-semibold shadow-[0_0_15px_rgba(255,255,255,0.1)] flex items-center gap-2 transition-all active:scale-95"
              >
                <Upload size={18} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
                <span>Upload New</span>
              </button>
            )}
          </header>

          <div className="animate-fade-in">
            {editingWallpaper ? (
              <div key={editingWallpaper.name} className="w-auto bg-neutral-900 rounded-3xl border border-neutral-800 overflow-hidden shadow-2xl shadow-black/50">

                <div className="flex flex-col lg:flex-row">
                  <div className="w-full lg:w-2/5 bg-black/40 p-10 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-neutral-800 relative group">
                    <img src={editingWallpaper.imgLink} alt="Preview" className="rounded-xl shadow-2xl max-h-[500px] w-auto object-contain z-10 border border-neutral-800" />
                  </div>
                  <div className="w-full lg:w-3/5 p-8 lg:p-5 bg-neutral-900">
                    <form onSubmit={handleEditSave} className="space-y-5">
                      <div>
                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Wallpaper Name :</label>
                        <input name="name" defaultValue={editingWallpaper.name} className="w-full px-4 py-3.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:border-cyan-500 focus:ring focus:ring-cyan-500 outline-none" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                            Category :
                          </label>
                          <CustomSelect
                            options={categories}
                            value={editingWallpaper.category}
                            onChange={(newValue) => {
                              setEditingWallpaper({ ...editingWallpaper, category: newValue });
                            }}
                            placeholder="Select Category..."
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Tags :</label>
                          <input name="tags" defaultValue={editingWallpaper.tags?.join(", ")} className="w-full px-4 py-3.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:border-cyan-500 focus:ring focus:ring-cyan-500 outline-none" />
                        </div>
                      </div>

                      <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Source URL :</label>
                      <div className="bg-neutral-950/50 rounded-xl p-4 space-y-3">
                        <div>
                          <a href={editingWallpaper.imgLink} target="_blank" rel="noreferrer" className="block text-xs font-mono text-neutral-500 break-all hover:text-cyan-400 transition-colors">{editingWallpaper.imgLink}</a>
                        </div>
                      </div>
                      {isAdmin && (
                        <>
                          <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">IMAGE ID :</label>
                          <div className="bg-neutral-950/50 rounded-xl p-4 space-y-3">
                            <div>
                              <div className="text-xs font-mono text-neutral-500 select-all">{editingWallpaper.id}</div>
                            </div>
                          </div>
                        </>
                      )}

                      <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                        <button type="button" className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium"><Trash2 size={16} /> <span>Delete Asset</span></button>
                        <div className="flex gap-3">
                          <button type="button" onClick={() => setEditingWallpaper(null)} className="px-6 py-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 font-medium">Cancel</button>
                          <button type="submit" className="px-8 py-2.5 rounded-xl bg-cyan-600 text-white hover:bg-cyan-500 font-medium shadow-lg shadow-cyan-900/20 flex items-center gap-2"><Save size={18} /> Save Changes</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {activeTab === 'wallpapers' && (
                  isLoadingWallpapers ? (
                    <div className="flex h-96 items-center justify-center text-neutral-500 flex-col gap-3">
                      <Loader2 className="animate-spin text-cyan-500" size={40} />
                      <p className="text-sm font-medium">Fetching visuals...</p>
                    </div>
                  ) : (
                    <div className="max-w-[1800px] mx-auto">
                      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                        {wallpapers.map((wallpaper: RawWallpaper) => {
                          return (
                            <div key={wallpaper.id} className="break-inside-avoid relative group rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-sm hover:shadow-2xl hover:shadow-cyan-900/10 hover:border-neutral-700 transition-all duration-300">
                              <img src={wallpaper.imgLink} alt={wallpaper.name} loading="lazy" className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                  <h3 className="text-white font-bold truncate">{wallpaper.name}</h3>
                                  <p className="text-neutral-300 text-xs mb-4">{wallpaper.category}</p>
                                  <button onClick={() => setEditingWallpaper(wallpaper)} className="w-full bg-white/10 backdrop-blur-xl hover:bg-white text-white hover:text-black border border-white/20 py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200"><Edit3 size={16} /> Edit Details</button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )
                )}

                {activeTab === 'users' && (
                  isLoadingUsers ? (
                    <div className="flex h-96 items-center justify-center text-neutral-500 flex-col gap-3 ">
                      <Loader2 className="animate-spin text-cyan-500" size={40} />
                      <p className="text-sm font-medium">Loading users...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                      {usersList.length === 0 ? (
                        <div className="col-span-full text-center py-20 text-neutral-500">
                          <User size={48} className="mx-auto mb-4 opacity-20" />
                          <p>No users found in the database.</p>
                        </div>
                      ) : (
                        usersList.map((userData) => (
                          <div
                            key={userData._id}
                            className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 transition-all duration-300"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-4">
                                {/* Avatar with Fallback */}
                                {userData.image ? (
                                  <img
                                    src={userData.image}
                                    alt={userData.displayName || "User"}
                                    className="w-12 h-12 rounded-full border-2 border-neutral-800 object-cover shrink-0"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-full bg-cyan-900/30 border-2 border-neutral-800 flex items-center justify-center text-cyan-400 font-bold text-lg shrink-0">
                                    {(userData.displayName || "U").charAt(0).toUpperCase()}
                                  </div>
                                )}

                                <div className="flex-1 items-center">
                                  <h3 className="text-white font-bold text-xl leading-tight truncate">
                                    {userData.displayName || "Unknown"}
                                  </h3>
                                  <p className="text-xs text-neutral-400 truncate mt-0.5">
                                    @{userData.userName || "user"}
                                  </p>
                                </div>
                              </div>
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${userData.role === 'ADMIN'
                                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                                }`}>
                                {userData.role || 'USER'}
                              </span>

                              {userData.emailVerified && (
                                <Shield size={10} className="text-green-500 shrink-0" />
                              )}
                            </div>

                            <div className="space-y-3 mt-4 pt-4 border-t border-neutral-800">
                              <div className="flex items-center gap-3 text-neutral-400 text-sm group-hover:text-neutral-300 transition-colors">
                                <Mail size={16} className="text-neutral-600 group-hover:text-cyan-500 transition-colors shrink-0" />
                                <span className="truncate">{userData.email || "No email provided"}</span>
                              </div>
                              <div className="flex items-center gap-3 text-neutral-400 text-sm group-hover:text-neutral-300 transition-colors">
                                <Calendar size={16} className="text-neutral-600 group-hover:text-cyan-500 transition-colors shrink-0" />
                                <span>Joined {formatDate(userData.createdAt)}</span>
                              </div>
                            </div>

                            <div className="mt-4 text-xs font-mono text-neutral-600 truncate bg-neutral-950/50 p-2 rounded">
                              ID: {userData._id}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}