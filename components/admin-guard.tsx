"use client"; // If using App Router

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";


export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useCurrentUser();
  const router = useRouter();
  const isAdmin = user?.data?.role === "admin" || "moderator";
  useEffect(() => {
    if (!isLoading) {
      if (!user || !isAdmin) {
        router.push("/");
      }
    }
  }, [user, isLoading, router]);

  if (!user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}