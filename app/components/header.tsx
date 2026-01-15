"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "./navbar";
import { useScroll } from "@/utils/useScroll";

interface HeaderProps {
  categories: string[];
}

export default function Header({ categories }: HeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const paramCategory = searchParams.get("category") || "all";
  const [activeCategory, setActiveCategory] = useState(paramCategory);

  useEffect(() => {
    setActiveCategory(paramCategory);
  }, [paramCategory]);

  const handleSelect = (category: string) => {
    setActiveCategory(category);
    const params = new URLSearchParams(searchParams);
    
    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category.toLowerCase());
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <header className="fixed bottom-0 md:top-0 left-0 right-0 z-40 pointer-events-none">
      <div className="max-w-[1800px] mx-auto">
        <div className="md:h-14 pointer-events-auto">
          <Navbar/>
        </div>

        <div className={`flex items-center gap-3 py-3 mt-6 overflow-x-auto no-scrollbar mask-gradient px-5 md:px-12 transition-all duration-300 ease-in-out
          ${useScroll()
            ? "md:bg-[#050505]/80 md:backdrop-blur-xl md:shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
            : "bg-transparent md:backdrop-blur-xl"
          }
          `}>
          
          {categories.map((cat) => {
            const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => handleSelect(cat)}
                className={`
                  px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 backdrop-blur-xl pointer-events-auto cursor-pointer
                  ${isActive
                    ? "bg-white text-black scale-105"
                    : "bg-white/40 text-black md:bg-white/5 md:text-gray-400 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                {cat.charAt(0).toUpperCase()+ cat.slice(1)}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
