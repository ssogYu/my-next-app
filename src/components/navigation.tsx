"use client";
import { useState } from "react";
import { CheckSquareIcon, HeartIcon, SettingsIcon } from "./icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = "home" | "task" | "setting";

export default function Navigation() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  // 根据当前路径计算活跃标签
  const getActiveTab = (): Tab => {
    if (pathname === "/home") return "home";
    if (pathname === "/task") return "task";
    if (pathname === "/setting") return "setting";
    return "home";
  };

  const activeTab = getActiveTab();

  const toggleNavigation = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      {/* 悬浮按钮 */}
      <button
        onClick={toggleNavigation}
        className="fixed bottom-6 right-6 z-50 w-10 h-10 bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
      >
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${isVisible ? "rotate-45" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>

      {/* 导航栏 */}
      <div
        className={`fixed bottom-20 right-6 z-40 transition-all duration-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <nav className="glass-panel rounded-full px-4 py-2 flex flex-col items-center gap-3 shadow-lg">
          <Link
            className={`relative p-3 rounded-full transition-all duration-300 ${
              activeTab === "home"
                ? "bg-rose-100"
                : "hover:bg-gray-100"
            }`}
            onClick={() => setIsVisible(false)}
            href={"/home"}
          >
            <HeartIcon
              className={`w-5 h-5 transition-colors ${
                activeTab === "home"
                  ? "text-rose-500 fill-rose-500"
                  : "text-stone-400"
              }`}
            />
          </Link>

          <Link
            onClick={() => setIsVisible(false)}
            className={`relative p-3 rounded-full transition-all duration-300 ${
              activeTab === "task"
                ? "bg-rose-100"
                : "hover:bg-gray-100"
            }`}
            href={"/task"}
          >
            <CheckSquareIcon
              className={`w-5 h-5 transition-colors ${
                activeTab === "task"
                  ? "text-rose-500"
                  : "text-stone-400"
              }`}
            />
          </Link>

          <Link
            onClick={() => setIsVisible(false)}
            className={`relative p-3 rounded-full transition-all duration-300 ${
              activeTab === "setting"
                ? "bg-rose-100"
                : "hover:bg-gray-100"
            }`}
            href={"/setting"}
          >
            <SettingsIcon
              className={`w-5 h-5 transition-colors ${
                activeTab === "setting"
                  ? "text-rose-500"
                  : "text-stone-400"
              }`}
            />
          </Link>

          </nav>
      </div>
    </>
  );
}