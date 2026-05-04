"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AppearanceCustomizer() {
  const [isOpen, setIsOpen] = useState(false);
  const [userColor, setUserColor] = useState("#3b82f6");
  const [blur, setBlur] = useState(12);

  const [mounted, setMounted] = useState(false);

  const applyStyles = (color: string, blurVal: string) => {
    if (typeof document === "undefined") return;
    // Robust hex to rgb conversion
    const hex = color.replace("#", "");
    let r, g, b;
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    }
    
    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
      document.documentElement.style.setProperty("--user", `${r} ${g} ${b}`);
    }
    document.documentElement.style.setProperty("--blur", `${blurVal}px`);
  };

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
      const savedColor = localStorage.getItem("custom-user-color") || "#3b82f6";
      const savedBlur = localStorage.getItem("custom-blur") || "12";
      setUserColor(savedColor);
      setBlur(parseInt(savedBlur));
      applyStyles(savedColor, savedBlur);
    }, 0);
  }, []);

  if (!mounted) return null;

  function handleColorChange(color: string) {
    setUserColor(color);
    localStorage.setItem("custom-user-color", color);
    applyStyles(color, blur.toString());
  }

  function handleBlurChange(val: number) {
    setBlur(val);
    localStorage.setItem("custom-blur", val.toString());
    applyStyles(userColor, val.toString());
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-button !p-2 rounded-full hover:rotate-90 transition-transform"
        title="Appearance Settings"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-12 z-50 w-64 rounded-2xl glass p-4 shadow-2xl space-y-4"
          >
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--muted))]">
                User bubble Color
              </label>
              <div className="mt-2 flex gap-2">
                {["#3b82f6", "#10b981", "#ef4444", "#f59e0b", "#8b5cf6"].map((c) => (
                  <button
                    key={c}
                    onClick={() => handleColorChange(c)}
                    className={`h-8 w-8 rounded-full border-2 transition-all ${userColor === c ? "border-white scale-110 shadow-lg" : "border-transparent"}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <input 
                type="color" 
                value={userColor} 
                onChange={(e) => handleColorChange(e.target.value)}
                className="mt-2 h-8 w-full cursor-pointer bg-transparent"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--muted))]">
                Blur Intensity ({blur}px)
              </label>
              <input
                type="range"
                min="0"
                max="40"
                value={blur}
                onChange={(e) => handleBlurChange(parseInt(e.target.value))}
                className="mt-2 w-full accent-blue-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
