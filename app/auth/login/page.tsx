"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const response = await res.json();

      if (!res.ok) {
        const errorMessage = response.message || "Login failed";
        setError(errorMessage);
        
        return;
      }

      toast.success(`Welcome back, ${response.data.user.displayName}`, {
        style: {
          background: '#09090b',
          color: '#f4f4f5',
          border: '1px solid #27272a',
          borderRadius: '12px',
          padding: '12px 20px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
          fontWeight: '500',
          fontSize: '14px',
        },
        iconTheme: {
          primary: '#22c55e',
          secondary: '#ffffff',
        },
      });
      
      router.push("/");

    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center p-4 selection:bg-cyan-500/30 relative overflow-hidden">

      {/* Background Decor (Glow effects) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative z-10">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-gray-400 text-sm">Sign in to continue to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300 ml-1">Email</label>
            <div className="relative group">
              <input
                name="email"
                type="email"
                required
                placeholder="name@example.com"
                className="w-full bg-[#0A0A0A] border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-gray-600"
              />
              <div className="absolute right-4 top-3.5 text-gray-500 pointer-events-none group-focus-within:text-cyan-400 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
              </div>
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-medium text-gray-300">Password</label>
              <Link href="/forgot-password" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative group">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                className="w-full bg-[#0A0A0A] border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-gray-600 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-gray-500 hover:text-white transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0e0e0e] px-2 text-gray-500">Or continue with</span></div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-2.5 transition-all text-white text-sm font-medium">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
            Google
          </button>
          <button className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-2.5 transition-all text-white text-sm font-medium">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
            GitHub
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors hover:underline underline-offset-4">
              Create Account
            </Link>
          </p>
        </div>

      </div>
    </main>
  );
}