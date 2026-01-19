"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getCategories } from "@/action/get-categories";
import { postWallpapers } from "@/action/action-wallpapers";

export default function AdminUpload() {
  
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

    useEffect(() => {
        async function fetchCategories() {
            try {
                let categories = await getCategories()
                setCategories(categories);
            } catch (error) {
                console.error("Failed to load categories", error);
            }
        }
        fetchCategories();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !selectedCategory) return;

        setIsUploading(true);
        setStatus({ type: null, message: '' });

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");

            const cloudinaryRes = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                { method: "POST", body: formData }
            );

            const cloudinaryData = await cloudinaryRes.json();

            if (!cloudinaryRes.ok) throw new Error(cloudinaryData.error?.message || "Cloudinary Upload Failed");

            const imageUrl = cloudinaryData.secure_url;

            await postWallpapers(imageUrl, selectedCategory);
            setStatus({ type: 'success', message: 'Wallpaper uploaded & saved successfully!' });
            setFile(null);
            setPreview(null);
        } catch (error: any) {
            console.error(error);
            setStatus({ type: 'error', message: error.message || "Something went wrong" });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-neutral-900 border border-white/10 rounded-2xl p-8 shadow-2xl">

                <h1 className="text-2xl font-bold mb-6 text-center">Upload Wallpaper</h1>

                <form onSubmit={handleUpload} className="space-y-6">

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Select Image</label>
                        <div className={`relative border-2 border-dashed border-white/10 rounded-xl p-8 text-center transition-colors ${preview ? 'border-cyan-500/50' : 'hover:border-white/20'}`}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            {preview ? (
                                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                                    <Image src={preview} alt="Preview" fill className="object-cover" />
                                </div>
                            ) : (
                                <div className="text-gray-500">
                                    <span className="block text-2xl mb-2">+</span>
                                    <span className="text-sm">Click or Drag image here</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Category</label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                        >
                            <option value="" disabled>Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                            ))}
                        </select>
                    </div>

                    {status.message && (
                        <div className={`p-3 rounded-lg text-sm text-center ${status.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                            {status.message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={!file || isUploading}
                        className={`
                                    w-full py-3 rounded-lg font-bold text-black transition-all duration-200
                                    ${!file || isUploading
                                        ? "bg-gray-600 cursor-not-allowed opacity-50"
                                        : "bg-white hover:bg-cyan-400 hover:scale-[1.02]"
                                    }
                               `}>
                        {isUploading ? "Uploading..." : "Upload Wallpaper"}
                    </button>

                </form>
            </div>
        </main>
    );
}
