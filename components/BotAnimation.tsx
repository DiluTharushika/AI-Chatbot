"use client";

import { motion } from "framer-motion";

interface BotAnimationProps {
  isTyping?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function BotAnimation({ isTyping = false, size = "md" }: BotAnimationProps) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  const scale = size === "sm" ? "scale-75" : size === "lg" ? "scale-150" : "scale-100";


  return (
    <div className={`relative flex items-center justify-center ${sizes[size]} ${scale}`}>
      
      {/* Outer Ambient Glow */}
      <motion.div
        animate={{
          scale: isTyping ? [1, 1.3, 1] : [0.9, 1.1, 0.9],
          opacity: isTyping ? [0.4, 0.7, 0.4] : [0.2, 0.4, 0.2],
        }}
        transition={{ duration: isTyping ? 1.5 : 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 blur-xl mix-blend-screen"
      />

      {/* Main Core Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        
        {/* Core Base (Dark center) */}
        <div className="absolute w-[75%] h-[75%] rounded-full bg-slate-900 border border-white/10 shadow-inner z-10" />

        {/* Inner Glowing Orb */}
        <motion.div
          animate={{
            scale: isTyping ? [0.8, 1.1, 0.8] : [0.9, 1, 0.9],
            opacity: isTyping ? [0.8, 1, 0.8] : [0.5, 0.8, 0.5],
          }}
          transition={{ duration: isTyping ? 0.8 : 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[45%] h-[45%] rounded-full bg-gradient-to-br from-cyan-300 to-blue-500 shadow-[0_0_15px_rgba(56,189,248,0.8)] z-20"
        />

        {/* Pulse Ring 1 (Typing Indicator) */}
        {isTyping && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0.8 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
            className="absolute w-[50%] h-[50%] rounded-full border border-cyan-400 z-10"
          />
        )}

        {/* Orbital Ring 1 */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute w-[90%] h-[90%] rounded-full border border-white/5 border-t-cyan-400/50 border-r-blue-500/50 z-30"
        />

        {/* Orbital Ring 2 (Counter-rotating) */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute w-full h-full rounded-full border border-white/5 border-b-blue-400/50 border-l-cyan-300/50 z-30 scale-105"
        />

        {/* Abstract Data Nodes (Dots on the rings) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute w-[90%] h-[90%] z-30"
        >
          <div className="absolute top-0 left-1/2 w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_5px_rgba(103,232,249,1)]" />
        </motion.div>

        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute w-full h-full z-30 scale-105"
        >
          <div className="absolute bottom-0 right-1/4 w-1 h-1 rounded-full bg-blue-400 shadow-[0_0_5px_rgba(96,165,250,1)]" />
        </motion.div>

      </div>
    </div>
  );


}
