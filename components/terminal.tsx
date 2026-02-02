"use client";

import { useState, useEffect } from "react";

export default function Terminal() {
  const [activeTab, setActiveTab] = useState("windows"); // 'linux' | 'windows'
  const [winShell, setWinShell] = useState("cmd"); // 'powershell' | 'cmd'
  const [copied, setCopied] = useState(false);
  const [command, setCommand] = useState("");

  const commands = {
    linux: `curl -sL https://raw.githubusercontent.com/DarshilNaliyapara/wallpaper-carousel-script/main/wallpaperfetch.py | python3`,
    windows: {
      powershell: `iwr https://raw.githubusercontent.com/DarshilNaliyapara/wallpaper-carousel-script/main/wallpaperfetch.py | python`,
      cmd: `curl -sL https://raw.githubusercontent.com/DarshilNaliyapara/wallpaper-carousel-script/main/wallpaperfetch.py | python`
    }
  };

  useEffect(() => {
    if (activeTab === "linux") {
      setCommand(commands.linux);
    } else {
      setCommand(commands.windows[winShell as keyof typeof commands.windows]);
    }
  }, [activeTab, winShell]);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(command);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = command;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6">
      {/* Header Section */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-cyan-500 text-2xl font-bold">›</span>
        <h2 className="text-2xl font-bold text-white tracking-tight">Quick Start</h2>
      </div>

      {/* Terminal Card */}
      <div className="bg-[#10141d] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">

        {/* Controls Bar (Responsive: Stack on mobile, Row on desktop) */}
        <div className="flex flex-col md:flex-row items-center justify-between p-4 border-b border-white/5 gap-4 md:gap-0 bg-[#161b25]">

          {/* OS Switcher */}
          <div className="bg-[#0b0d12] p-1 rounded-lg border border-white/5 flex w-full md:w-auto">
            <button
              onClick={() => setActiveTab("linux")}
              className={`flex-1 md:flex-none px-6 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === "linux"
                ? "bg-teal-400 text-black shadow-[0_0_10px_rgba(45,212,191,0.3)]"
                : "text-gray-500 hover:text-gray-300"
                }`}
            >
              Linux
            </button>
            <button
              onClick={() => setActiveTab("windows")}
              className={`flex-1 md:flex-none px-6 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === "windows"
                ? "bg-[#3b82f6] text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                : "text-gray-500 hover:text-gray-300"
                }`}
            >
              Windows
            </button>
          </div>

          {/* Windows Specific Controls (Only visible when Windows is active) */}
          {activeTab === "windows" && (
            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 w-full md:w-auto justify-center md:justify-end">
              <div className="flex items-center bg-[#0b0d12] rounded-lg p-1 border border-white/5">
                <button
                  onClick={() => setWinShell("powershell")}
                  className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${winShell === "powershell"
                    ? "bg-white/15 text-white"
                    : "text-gray-500 hover:text-gray-300"
                    }`}
                >
                  PowerShell
                </button>
                <button
                  onClick={() => setWinShell("cmd")}
                  className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${winShell === "cmd"
                    ? "bg-white/15 text-white"
                    : "text-gray-500 hover:text-gray-300"
                    }`}
                >
                  CMD
                </button>
              </div>
              <div className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] font-bold text-gray-400 tracking-wider">
                BETA
              </div>
            </div>
          )}
        </div>

        {/* Code Area */}
        <div className="p-5 md:pb-1 bg-[#0d1117] font-mono text-sm relative group">

          {/* Comment */}
          <div className="text-gray-500 mb-4 select-none italic text-xs md:text-sm">
            # {activeTab === "linux" ? "Runs everywhere." : "Run as Administrator."} Downloads Wallpaper & setup. 🚀
          </div>

          {/* Code Block: Scrollbar hidden by default, visible on hover */}
          <div className="flex items-start gap-3 overflow-x-auto
            
            /* Webkit (Chrome, Edge, Safari) */
            [&::-webkit-scrollbar]:h-1
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-transparent   /* Hidden by default */
            [&::-webkit-scrollbar-thumb]:rounded-full
            hover:[&::-webkit-scrollbar-thumb]:bg-white/10 /* Visible on hover */
            
            /* Firefox */
            [scrollbar-color:transparent_transparent]     /* Hidden by default */
            hover:[scrollbar-color:rgba(255,255,255,0.1)_transparent] /* Visible on hover */
          ">
            <span className="text-pink-500 select-none shrink-0">$</span>
            <code className="text-cyan-300 whitespace-pre">
              {command}
            </code>
          </div>

          {/* Floating Copy Button */}
          {/* Copy Button: Hidden (invisible) by default, Visible + Fade in on hover */}
          <div className="absolute bottom-4 right-4 md:top-1/2 md:-translate-y-1/2 md:right-6 
            md:opacity-0 md:invisible 
            group-hover:opacity-100 group-hover:visible 
            transition-all duration-200"
          >
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-[#1e232e] hover:bg-[#282e3a] border border-white/5 text-gray-400 hover:text-white shadow-lg active:scale-95"
              title="Copy command"
            >
              {copied ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Footer Text */}
      <p className="text-center text-gray-500 text-xs md:text-sm mt-6 px-4">
        Works on {activeTab === "linux" ? "Arch, Debian, Ubuntu & Fedora" : "Windows 10/11"}. The one-liner installs Python & dependencies.
      </p>
    </div>
  );
}