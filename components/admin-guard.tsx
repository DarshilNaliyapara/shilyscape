"use client"; // If using App Router

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";


export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useCurrentUser();
  const router = useRouter();
  const isAdmin = user?.data?.role === "admin" || user?.data?.role === "moderator";
  useEffect(() => {
    if (!isLoading) {
      if (!user || !isAdmin) {
        router.push("/");
      }
    }
  }, [user, isLoading, router]);
  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col bg-black">

        <div className="flex flex-1 flex-col items-center justify-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-800 border-t-white" />
          <p className="text-sm font-medium text-gray-400 animate-pulse">
            Checking Authorization...
          </p>
        </div>

        <footer className="py-6 text-center text-xs text-gray-600">
          <p>&copy; {new Date().getFullYear()} ShilyScape. All rights reserved.</p>
        </footer>

      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}