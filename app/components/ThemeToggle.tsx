"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  // Load theme on mount
  useEffect(() => {
    setMounted(true);

    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  // Update document when theme changes
  useEffect(() => {
    if (!mounted) return;

    console.log("Theme changed to:", theme); // Debug log

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    console.log("Toggle clicked!"); // Debug log
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  if (!mounted) {
    return (
      <div className="fixed top-4 right-4 z-50 p-3 rounded-full bg-gray-200 w-11 h-11" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="
        fixed top-4 right-4 z-50
        p-3 rounded-full
        bg-gray-200 dark:bg-gray-800
        text-gray-800 dark:text-gray-200
        hover:bg-gray-300 dark:hover:bg-gray-700
        transition-all duration-300
        shadow-lg hover:shadow-xl
        focus:outline-none focus:ring-2 focus:ring-purple-500
      "
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
