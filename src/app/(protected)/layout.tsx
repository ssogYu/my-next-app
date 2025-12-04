"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navigation from "@/components/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname() || "/home";

  useEffect(() => {
    if (!loading && !user) {
      const cb = encodeURIComponent(pathname);
      router.replace(`/login?callbackUrl=${cb}`);
    }
  }, [loading, user, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="p-4">加载中...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      {children}
    </div>
  );
}
