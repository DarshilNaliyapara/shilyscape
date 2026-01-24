import { postWallpapers } from "@/action/action-wallpapers";
import { getCategories } from "@/action/get-categories";
import { useEffect, useState } from "react";
import { X, Upload, CheckCircle, AlertCircle } from 'lucide-react';

type StatusType = 'success' | 'error' | null;
interface UploadModalProps {
  onClose: () => void;
  onUploadComplete: () => void;
}

export const UploadModal = ({ onClose, onUploadComplete }: UploadModalProps) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [name, setName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<{ type: StatusType, message: string }>({
    type: null,
    message: ''
  });

  useEffect(() => {
    async function fetchCats() {
      try {
        const cats = await getCategories();
        setCategories(cats || []);
      } catch (e) {
        console.error("Failed to load categories", e);
      }
    }
    fetchCats();
  }, []);

  const handleFileChange = (e: any) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      if (!name) {
        const cleanName = selected.name.replace(/\.[^/.]+$/, "");
        setName(cleanName);
      }
    }
  };

  const handleTagKeyDown = (e: any) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleUpload = async (e: any) => {
    e.preventDefault();
    if (!file || !selectedCategory || !name) return;

    setIsUploading(true);
    setStatus({ type: null, message: '' });

    try {
      await postWallpapers(file, selectedCategory, tags, name);

      setStatus({ type: 'success', message: 'Wallpaper uploaded successfully!' });

      setTimeout(() => {
        onUploadComplete();
      }, 1000);

    } catch (error: any) {
      setStatus({ type: 'error', message: error.message || "Upload failed." });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <h2 className="text-xl font-bold text-slate-800">Upload New Wallpaper</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><X size={20} /></button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleUpload} className="space-y-6">

            {/* Image Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Wallpaper Image</label>
              <div className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${preview ? 'border-blue-500 bg-blue-50/50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}`}>
                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg shadow-sm" />
                ) : (
                  <div className="text-slate-500"><Upload className="mx-auto mb-2" size={24} /><span>Click to upload</span></div>
                )}
              </div>
            </div>

            {/* ✅ 5. New Name Input Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sunset in Tokyo"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Category</label>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500">
                <option value="" disabled>Select a category...</option>
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Tags</label>
              <div className="p-2 border border-slate-300 rounded-lg flex flex-wrap gap-2 focus-within:ring-2 ring-blue-500">
                {tags.map((tag, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                    {tag} <button type="button" onClick={() => removeTag(tag)}><X size={12} /></button>
                  </span>
                ))}
                <input
                  type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown}
                  placeholder="Type & Enter..." className="flex-1 outline-none text-sm min-w-[80px]"
                />
              </div>
            </div>

            {/* Status & Button */}
            {status.message && (
              <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />} {status.message}
              </div>
            )}

            <button type="submit" disabled={!file || isUploading} className="w-full py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              {isUploading ? "Uploading..." : "Upload Wallpaper"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};