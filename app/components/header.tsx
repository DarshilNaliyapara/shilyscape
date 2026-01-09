"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "./navbar";

const CATEGORIES = ["All", "Anime", "Nature", "Cyberpunk", "Minimal", "Cars", "Abstract", "Space", "City", "Fantasy", "Dark"];

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const paramCategory = searchParams.get("category") || "All";
  const [activeCategory, setActiveCategory] = useState(paramCategory);

  useEffect(() => {
    setActiveCategory(paramCategory);
  }, [paramCategory]);

  const handleSelect = (category: string) => {
    setActiveCategory(category);

    const params = new URLSearchParams(searchParams);
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category.toLowerCase());
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <header className="fixed bottom-0 md:top-0 left-0 right-0 z-50 ">
      <div className="max-w-[1800px] mx-auto">
        <div className="h-14">
         <Navbar/>
        </div>

        <div className="flex items-center gap-3 py-9 overflow-x-auto no-scrollbar mask-gradient px-5 md:px-12">
          {CATEGORIES.map((cat) => {
      
            const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
            
            return (
              <button
                key={cat}
                onClick={() => handleSelect(cat)}
                className={`
                  px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200  backdrop-blur-xl
                  ${isActive 
                    ? "bg-white text-black scale-105" 
                    : "bg-white/40 text-black md:bg-white/5 md:text-gray-400 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}