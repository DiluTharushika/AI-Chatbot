"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import type { ChatMessage } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import BotAnimation from "@/components/BotAnimation";
import AppearanceCustomizer from "@/components/AppearanceCustomizer";

function TypingDots() {
  return (
    <div className="flex gap-1 items-center">
      <span className="h-2 w-2 rounded-full bg-[rgb(var(--muted))] animate-bounce [animation-delay:-0.2s]" />
      <span className="h-2 w-2 rounded-full bg-[rgb(var(--muted))] animate-bounce [animation-delay:-0.1s]" />
      <span className="h-2 w-2 rounded-full bg-[rgb(var(--muted))] animate-bounce" />
    </div>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "system", content: "You are an intelligent, professional AI assistant named MATCH AI." },
    { role: "assistant", content: "Hello! Welcome to MATCH AI. How can I assist you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
    const hasVisited = sessionStorage.getItem("hasVisitedMatchAI");
    if (hasVisited === "true") {
      setShowWelcome(false);
    } else {
      sessionStorage.setItem("hasVisitedMatchAI", "true");
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, []);

  const visibleMessages = useMemo(
    () => messages.filter((m) => m.role !== "system"),
    [messages]
  );

  useEffect(() => {
    // auto-scroll to bottom when messages change
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [visibleMessages.length, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: text },
    ];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${errorMessage}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) return null; // Prevent hydration UI mismatch

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--text))] overflow-hidden relative">
      
      {/* Welcome Screen Overlay */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            key="welcome-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[rgb(var(--bg))] backdrop-blur-2xl"
          >
            <motion.div 
               initial={{ scale: 0.5, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ duration: 1, ease: "easeOut" }}
            >
               <BotAnimation size="lg" />
            </motion.div>
            <motion.h1 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
               className="mt-12 text-5xl font-black tracking-tighter bg-gradient-to-r from-blue-500 to-cyan-300 bg-clip-text text-transparent drop-shadow-xl"
            >
              Welcome to MATCH AI
            </motion.h1>
            <motion.p 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
               className="mt-4 text-xl font-medium text-[rgb(var(--text))]/80"
            >
              Intelligence matched with precision
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Application */}
      {!showWelcome && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute inset-0 overflow-y-auto"
        >
          {/* subtle background glow */}
          <div className="pointer-events-none fixed inset-0 opacity-30">
            <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[rgb(var(--user))] blur-3xl" />
          </div>

          <div className="mx-auto max-w-3xl px-4 py-8">
            {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <BotAnimation isTyping={loading} size="md" />
            <div>
              <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                MATCH AI
              </h1>
              <p className="text-sm font-medium text-[rgb(var(--muted))]">
                Intelligence matched with precision
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AppearanceCustomizer />
            <ThemeSwitcher />
          </div>
        </motion.div>

        {/* Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="glass rounded-3xl p-6 shadow-2xl"
        >
          {/* Messages */}
          <div
            ref={listRef}
            className="h-[60vh] overflow-y-auto overflow-x-hidden rounded-2xl border border-white/10 bg-black/20 p-6 scrollbar-glass"
          >
            <AnimatePresence initial={false}>
              {visibleMessages.map((m, idx) => {
                const isUser = m.role === "user";
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className={[
                      "mb-4 flex gap-3",
                      isUser ? "justify-end" : "justify-start",
                    ].join(" ")}
                  >
                    {!isUser && (
                      <div className="mt-1 flex-shrink-0">
                        <BotAnimation size="sm" />
                      </div>
                    )}
                    <div
                      className={[
                        "max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-lg",
                        isUser
                          ? "bg-[rgb(var(--user))] text-white"
                          : "glass bg-white/5 text-[rgb(var(--botText))]",
                      ].join(" ")}
                    >
                      {m.content}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4 flex justify-start gap-3"
              >
                <div className="mt-1 flex-shrink-0">
                  <BotAnimation size="sm" isTyping />
                </div>
                <div className="glass max-w-[85%] rounded-2xl px-5 py-3 text-[rgb(var(--botText))]">
                  <TypingDots />
                </div>
              </motion.div>
            )}
          </div>

          {/* Input */}
          <div className="mt-6 flex gap-3">
            <input
              className="flex-1 rounded-xl border border-white/10 bg-black/30 px-5 py-4 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-[rgb(var(--user))]/50 transition-all backdrop-blur-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />
            <button
              className="glass-button disabled:opacity-50"
              onClick={sendMessage}
              disabled={loading}
            >
              Send
            </button>
          </div>

              <p className="mt-3 text-xs text-[rgb(var(--muted))]">
                Tip: press Enter to send • Change theme from the top right.
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}