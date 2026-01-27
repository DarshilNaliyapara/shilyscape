"use client";

import { useState } from "react";

export default function Terminal() {
    const installCommand = `curl -sL https://raw.githubusercontent.com/DarshilNaliyapara/wallpaper-carousel-script/main/wallpaperfetch.py | python3`;

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(installCommand);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      } catch (err) {
        console.warn("Clipboard API failed, trying fallback...", err);
      }
    }

    try {
      const textarea = document.createElement("textarea");
      textarea.value = installCommand;

      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";

      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mt-8">
      <div className="flex items-center bg-[#0F0F0F] border border-white/10 rounded-xl shadow-2xl overflow-hidden group hover:border-white/20 transition-colors">
        <div className="flex-1 overflow-x-auto py-4 pl-5 pr-16 scrollbar-thin scrollbar-thumb-white/10 no-scrollbar">
          <code className="font-mono text-sm md:text-base text-cyan-400 whitespace-nowrap">
            <span className="text-purple-400 mr-3 select-none">$</span>
            {installCommand}
          </code>
        </div>

        <div className="absolute right-2 top-1/2 -translate-y-1/2 pl-2 bg-gradient-to-l from-[#0F0F0F] via-[#0F0F0F] to-transparent transition-opacity duration-200 opacity-100 md:opacity-0 md:group-hover:opacity-100">
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-white/10 transition-all duration-200 text-gray-400 hover:text-white"
            title="Copy to clipboard"
          >
            {copied ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400 scale-110">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
