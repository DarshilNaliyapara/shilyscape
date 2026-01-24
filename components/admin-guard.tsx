"use client"; // If using App Router

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";


export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      const isAdmin = user?.data?.role === "admin";
      if (!user || !isAdmin) {
        router.push("/");
      }
    }
  }, [user, isLoading, router]);

  if (!user || user.data.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}