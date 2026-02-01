import { getCategories } from "@/action/get-categories";
import { useEffect, useState, ChangeEvent, KeyboardEvent, FormEvent } from "react";
import { X, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import CustomSelect from "@/components/custom-select";
import api from "@/utils/axios";


type StatusType = 'success' | 'error' | null;

interface UploadModalProps {
  onClose: () => void;
  onUploadComplete: () => void;
}

export const UploadModal = ({ onClose, onUploadComplete }: UploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
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
        // Ensure cats is an array of strings
        setCategories(cats || []);
      } catch (e) {
        console.error("Failed to load categories", e);
      }
    }
    fetchCats();
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      // Auto-fill name if empty
      if (!name) {
        const cleanName = selected.name.replace(/\.[^/.]+$/, "");
        setName(cleanName);
      }
    }
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const newTag = tagInput.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleUpload = async (e: FormEvent) => {
  e.preventDefault();

  // 1. Validate inputs
  if (!file || !selectedCategory || !name) {
    setStatus({ type: 'error', message: "Please select a file, name, and category." });
    return;
  }

  setIsUploading(true);
  setStatus({ type: null, message: '' });

  try {
    // 2. Prepare FormData
    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', selectedCategory); // Ensure this matches your state variable
    formData.append('tags', JSON.stringify(tags)); // Ensure tags state exists
    formData.append('file', file);

    // 3. Make the Request
    // Note: No manual 'Content-Type' header needed; Axios sets it automatically.
    await api.post('/wallpapers', formData);

    // 4. Handle Success
    setStatus({ type: 'success', message: 'Wallpaper uploaded successfully!' });

    setTimeout(() => {
      if (onUploadComplete) onUploadComplete();
      if (onClose) onClose();
      
      // Optional: Clear form
      setName("");
      setFile(null);
      setTags([]);
    }, 1000);

  } catch (error: any) {
    // 5. Handle Error
    const serverMessage = 
      error.response?.data?.message || 
      error.message || 
      "Failed to upload wallpaper";
      
    setStatus({ type: 'error', message: serverMessage });
    
  } finally {
    setIsUploading(false);
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

        <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Upload New Wallpaper</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-800 rounded-full text-neutral-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto no-scrollbar">
          <form onSubmit={handleUpload} className="space-y-6">

            <div className="space-y-2">
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider">
                Wallpaper Image
              </label>
              <div className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all group ${preview
                ? 'border-cyan-500/50 bg-cyan-500/5'
                : 'border-neutral-700 bg-neutral-800/50 hover:border-cyan-500/50 hover:bg-neutral-800'
                }`}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                {preview ? (
                  <div className="relative group-hover:opacity-75 transition-opacity">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg shadow-lg border border-neutral-700"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">Change Image</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-neutral-400 group-hover:text-cyan-400 transition-colors">
                    <Upload className="mx-auto mb-3" size={32} />
                    <span className="text-sm font-medium">Click to upload image</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sunset in Tokyo"
                className="w-full px-4 py-3.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider">
                Category
              </label>
              <CustomSelect
                options={categories}
                value={selectedCategory}
                onChange={(category) => setSelectedCategory(category)}
                placeholder="Select Category..."
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider">
                Tags
              </label>
              <div className="p-2 bg-neutral-800 border border-neutral-700 rounded-xl flex flex-wrap gap-2 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500 transition-all">
                {tags.map((tag, idx) => (
                  <span key={idx} className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 animate-in fade-in zoom-in duration-200">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-white"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  onBlur={addTag} // Add tag on blur as well
                  placeholder={tags.length === 0 ? "Type tags & press Enter..." : ""}
                  className="flex-1 bg-transparent outline-none text-sm text-white placeholder-neutral-500 min-w-[120px] py-1 px-1"
                />
              </div>
            </div>

            {status.message && (
              <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-3 border ${status.type === 'success'
                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                : 'bg-red-500/10 text-red-400 border-red-500/20'
                }`}>
                {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                {status.message}
              </div>
            )}

            <button
              type="submit"
              disabled={!file || isUploading}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-900/20"
            >
              {isUploading ? "Uploading..." : "Upload Wallpaper"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};