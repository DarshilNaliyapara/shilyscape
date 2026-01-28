import { getCategories } from "@/action/get-categories";
import CustomSelect from "@/components/custom-select";
import { Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";


interface RawWallpaper {
    id: string;
    name?: string;
    category?: string;
    tags?: string[];
    imgLink: string;
}

interface AdminWallpaperProps {
    wallpaperData: RawWallpaper;
    isAdmin: boolean;
    onEdit: (wallpaper: RawWallpaper | null) => void;
}

export const EditWallpaper = ({ wallpaperData, isAdmin, onEdit }: AdminWallpaperProps) => {
    const [categories, setCategories] = useState<string[]>([]);
    const fetchCategories = async () => {
        try {
            const response = await getCategories();
            setCategories(response || []);
        } catch (error) {
            console.error("Failed to load categories", error);
        }
    }

    const handleEditSave = (e: any) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedData = {
            name: formData.get("name"),
            category: formData.get("category"),
            tags: (formData.get("tags")?.toString() || "").split(",").map(t => t.trim()),
        };
        console.log("Saving Update:", updatedData);
        onEdit(null);
    };


    useEffect(() => {
        fetchCategories();
    }, []);


    return (
        <div key={wallpaperData.name} className="w-auto bg-neutral-900 rounded-3xl border border-neutral-800 overflow-hidden shadow-2xl shadow-black/50">

            <div className="flex flex-col lg:flex-row">
                <div className="w-full lg:w-2/5 bg-black/40 p-10 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-neutral-800 relative group">
                    <img src={wallpaperData.imgLink} alt="Preview" className="rounded-xl shadow-2xl max-h-[500px] w-auto object-contain z-10 border border-neutral-800" />
                </div>
                <div className="w-full lg:w-3/5 p-8 lg:p-5 bg-neutral-900">
                    <form onSubmit={handleEditSave} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Wallpaper Name :</label>
                            <input name="name" defaultValue={wallpaperData.name} className="w-full px-4 py-3.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:border-cyan-500 focus:ring focus:ring-cyan-500 outline-none" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                                    Category :
                                </label>
                                <CustomSelect
                                    options={categories}
                                    value={wallpaperData.category}
                                    onChange={(newValue) => {
                                        onEdit({ ...wallpaperData, category: newValue });
                                    }}
                                    placeholder="Select Category..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Tags :</label>
                                <input name="tags" defaultValue={wallpaperData.tags?.join(", ")} className="w-full px-4 py-3.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:border-cyan-500 focus:ring focus:ring-cyan-500 outline-none" />
                            </div>
                        </div>

                        <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Source URL :</label>
                        <div className="bg-neutral-950/50 rounded-xl p-4 space-y-3">
                            <div>
                                <a href={wallpaperData.imgLink} target="_blank" rel="noreferrer" className="block text-xs font-mono text-neutral-500 break-all hover:text-cyan-400 transition-colors">{wallpaperData.imgLink}</a>
                            </div>
                        </div>
                        {isAdmin && (
                            <>
                                <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">IMAGE ID :</label>
                                <div className="bg-neutral-950/50 rounded-xl p-4 space-y-3">
                                    <div>
                                        <div className="text-xs font-mono text-neutral-500 select-all">{wallpaperData.id}</div>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                            <button type="button" className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium">
                                <Trash2 size={16} /> <span>Delete Asset</span>
                            </button>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => onEdit(null)} className="px-6 py-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 font-medium">Cancel</button>
                                <button type="submit" className="px-8 py-2.5 rounded-xl bg-cyan-600 text-white hover:bg-cyan-500 font-medium shadow-lg shadow-cyan-900/20 flex items-center gap-2">
                                    <Save size={18} /> Save Changes
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}