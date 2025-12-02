"use client";
import { useState } from "react";
import { CheckSquareIcon, HeartIcon, SettingsIcon } from "./icons";
import Link from "next/link";
type Tab = "home" | "task" | "setting";

export default function Navigation() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
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
      </nav>
    </div>
  );
}
