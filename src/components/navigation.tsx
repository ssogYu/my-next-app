"use client";
import { useState } from "react";
import { CheckSquareIcon, HeartIcon, SettingsIcon } from "./icons";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
type Tab = "home" | "task" | "setting";

export default function Navigation() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const { user, logout, loading } = useAuth();
  return (
    <div className="absolute bottom-6 left-0 right-0 flex justify-center z-40 pointer-events-none">
      <nav className="glass-panel pointer-events-auto rounded-full px-6 py-3 flex items-center gap-8 shadow-lg shadow-rose-900/5">
        <Link
          className={`relative p-2 transition-all duration-300 ${
            activeTab === "home"
              ? "-translate-y-2"
              : "hover:-translate-y-1"
          }`}
          onClick={() => setActiveTab("home")}
          href={'/'}
        >
          <div
            className={`absolute -inset-2 bg-rose-100/50 rounded-full blur-md transition-opacity duration-300 ${
              activeTab === "home" ? "opacity-100" : "opacity-0"
            }`}
          />
          <HeartIcon
            className={`w-6 h-6 relative z-10 transition-colors ${
              activeTab === "home"
                ? "text-rose-500 fill-rose-500"
                : "text-stone-400"
            }`}
          />
        </Link>

        <Link
          onClick={() => setActiveTab("task")}
          className={`relative p-2 transition-all duration-300 ${
            activeTab === "task" ? "-translate-y-2" : "hover:-translate-y-1"
          }`}
          href={'task'}
        >
          <div
            className={`absolute -inset-2 bg-rose-100/50 rounded-full blur-md transition-opacity duration-300 ${
              activeTab === "task" ? "opacity-100" : "opacity-0"
            }`}
          />
          <CheckSquareIcon
            className={`w-6 h-6 relative z-10 transition-colors ${
              activeTab === "task" ? "text-rose-500" : "text-stone-400"
            }`}
          />
        </Link>

        <Link
          onClick={() => setActiveTab("setting")}
          className={`relative p-2 transition-all duration-300 ${
            activeTab === "setting" ? "-translate-y-2" : "hover:-translate-y-1"
          }`}
          href={'/setting'}
        >
          <div
            className={`absolute -inset-2 bg-rose-100/50 rounded-full blur-md transition-opacity duration-300 ${
              activeTab === "setting" ? "opacity-100" : "opacity-0"
            }`}
          />
          <SettingsIcon
            className={`w-6 h-6 relative z-10 transition-colors ${
              activeTab === "setting" ? "text-rose-500" : "text-stone-400"
            }`}
          />
        </Link>

        {user && (
          <button
            onClick={logout}
            className="relative p-2 transition-all duration-300 hover:-translate-y-1"
            title="退出登录"
          >
            <div className="absolute -inset-2 bg-red-100/50 rounded-full blur-md transition-opacity duration-300 opacity-0 hover:opacity-100" />
            <svg className="w-6 h-6 relative z-10 transition-colors text-stone-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        )}
      </nav>

      {user && (
        <div className="absolute top-6 right-6 z-40 pointer-events-auto">
          <div className="glass-panel px-4 py-2 rounded-full shadow-lg shadow-rose-900/5">
            <span className="text-sm text-stone-600">
              欢迎，{user.username}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
