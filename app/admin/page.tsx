"use client";

import { useState, useEffect, useCallback } from 'react';
import { User, Image as ImageIcon, Edit3, Trash2, X, Plus, Loader2, Save } from 'lucide-react';

import { getWallpapers } from '@/action/action-wallpapers';
import { getCategories } from "@/action/get-categories";
import { UploadModal } from './upload';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import AdminGuard from '@/components/admin-guard';

interface RawWallpaper {
  id: string;
  name?: string;
  category?: string;
  tags?: string[];
  imgLink: string;
}

export default function AdminPanel() {
  const { user, isAuthenticated, isAdmin } = useCurrentUser();

  const [activeTab, setActiveTab] = useState('users');
  const [editingWallpaper, setEditingWallpaper] = useState<RawWallpaper | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [wallpapers, setWallpapers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoadingWallpapers, setIsLoadingWallpapers] = useState(false);


  const fetchWallpapers = useCallback(async () => {
    setIsLoadingWallpapers(true);
    try {
      const response = await getWallpapers();
      const cats = await getCategories();
      setCategories(cats);

      const rawWallpapers = response?.data?.wallpapers || [];
      console.log(rawWallpapers)
      const formattedWallpapers = rawWallpapers.map((wp: RawWallpaper) => ({
        id: wp.id,
        name: wp.name || "UnNamed",
        category: wp.category || "Uncategorized",
        tags: wp.tags || [],
        imgLink: wp.imgLink,
      }));
      setWallpapers(formattedWallpapers);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoadingWallpapers(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'wallpapers') fetchWallpapers();

  }, [activeTab, fetchWallpapers]);


  const handleEditSave = (e:any) => {
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


  // --- 3. LAYOUT COMPONENTS ---
  const Sidebar = () => (
    <div className="w-64 bg-slate-900 text-slate-100 h-screen flex flex-col fixed left-0 top-0 shadow-xl z-10">
      {isAuthenticated && <div className="p-6 flex flex-col items-center border-b border-slate-700">
        <img src={user.data.avatar} alt="Admin" className="w-16 h-16 rounded-full border-2 border-blue-500 mb-3" />
        <h3 className="font-bold text-lg">{user.data.displayName}</h3>
        <h3 className="font-bold text-xs">@{user.data.userName}</h3>
      </div>}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        <button onClick={() => { setActiveTab('users'); setEditingWallpaper(null); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>
          <User size={20} /> <span>Users</span>
        </button>
        <button onClick={() => { setActiveTab('wallpapers'); setEditingWallpaper(null); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'wallpapers' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>
          <ImageIcon size={20} /> <span>Wallpapers</span>
        </button>
      </nav>
    </div>
  );

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <Sidebar />

        {isUploadModalOpen && (
          <UploadModal
            onClose={() => setIsUploadModalOpen(false)}
            onUploadComplete={() => { setIsUploadModalOpen(false); fetchWallpapers(); }}
          />
        )}

        <main className="ml-64 p-8 min-h-screen">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{editingWallpaper ? 'Editor' : (activeTab === 'users' ? 'User Management' : 'Wallpaper Library')}</h1>
            </div>
            {activeTab === 'wallpapers' && !editingWallpaper && (
              <button onClick={() => setIsUploadModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md flex items-center gap-2 transition-transform hover:scale-105">
                <Plus size={20} /> <span>Upload Wallpaper</span>
              </button>
            )}
          </header>

          <div className="animate-fade-in">
            {editingWallpaper ? (
              /* --- EDIT SECTION --- */
              /* KEY FIX: key={editingWallpaper.id} forces React to re-render inputs when ID changes */
              <div key={editingWallpaper.name} className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h2 className="text-xl font-bold text-slate-800">Edit Wallpaper Details</h2>
                  <button onClick={() => setEditingWallpaper(null)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500"><X size={24} /></button>
                </div>

                <div className="flex flex-col md:flex-row">
                  {/* Left: Image Preview */}
                  <div className="w-full md:w-1/3 bg-slate-900 p-8 flex items-center justify-center">
                    <img src={editingWallpaper.imgLink} alt="Preview" className="rounded-lg shadow-2xl max-h-[400px] object-contain" />
                  </div>

                  {/* Right: Form */}
                  <div className="w-full md:w-2/3 p-8">
                    <form onSubmit={handleEditSave} className="space-y-6">

                      {/* Name Input */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Wallpaper Name</label>
                        <input
                          name="name"
                          defaultValue={editingWallpaper.name}
                          className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        {/* Category Dropdown */}
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                          <select
                            name="category"
                            defaultValue={editingWallpaper.category}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                          >
                            <option value={editingWallpaper.category}>{editingWallpaper.category}</option>
                            {categories.filter(c => c !== editingWallpaper.category).map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>

                        {/* Tags Input */}
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Tags (comma separated)</label>
                          <input
                            name="tags"
                            defaultValue={editingWallpaper.tags?.join(", ")}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="neon, dark, city"
                          />
                        </div>
                      </div>

                      {isAdmin &&
                        <>
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-1">IMAGE URL</label>
                            <div className="text-xs font-mono bg-slate-100 p-2 rounded text-slate-500">{editingWallpaper.imgLink}</div>
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-1">IMAGE ID</label>
                            <div className="text-xs font-mono bg-slate-100 p-2 rounded text-slate-500">{editingWallpaper.id}</div>
                          </div>
                        </>
                      }
                      <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                        <button type="button" className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                          <Trash2 size={18} /> <span>Delete</span>
                        </button>
                        <div className="flex gap-3">
                          <button type="button" onClick={() => setEditingWallpaper(null)} className="px-6 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium">Cancel</button>
                          <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-lg flex items-center gap-2">
                            <Save size={18} /> Save Changes
                          </button>
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
                    <div className="flex h-64 items-center justify-center text-slate-500"><Loader2 className="animate-spin mr-2" /> Loading...</div>
                  ) : (
                    /* --- MASONRY LAYOUT IMPLEMENTATION --- */
                    <div className="max-w-[1800px] mx-auto">
                      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                        {wallpapers.map((wallpaper: RawWallpaper, index) => {
                          const hasTags = wallpaper.tags && wallpaper.tags.length > 0;

                          return (
                            <div
                              key={`${wallpaper.id}-${index}`}
                              className="break-inside-avoid relative group rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300"
                            >
                              <img
                                src={wallpaper.imgLink}
                                alt={wallpaper.name}
                                loading="lazy"
                                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                              />

                              {/* Overlay with Edit Button & Tags */}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">

                                {/* Centered Edit Button */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <button
                                    onClick={() => setEditingWallpaper(wallpaper)}
                                    className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75 hover:scale-105 flex items-center gap-2"
                                  >
                                    <Edit3 size={18} /> Edit
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
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