"use client";

import { useMemo, useState } from "react";
import type { ChatMessage } from "@/lib/types";

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "system", content: "You are a helpful assistant." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const visibleMessages = useMemo(
    () => messages.filter((m) => m.role !== "system"),
    [messages]
  );

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
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${err?.message ?? "Unknown"}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="text-2xl font-bold mb-4">AI Chatbot</h1>

      <div className="h-[60vh] overflow-y-auto rounded-lg border p-4 bg-white/50">
        <div className="space-y-3">
          {visibleMessages.map((m, idx) => {
            const isUser = m.role === "user";
            return (
              <div
                key={idx}
                className={[
                  "p-3 rounded-lg max-w-[85%] whitespace-pre-wrap",
                  isUser
                    ? "ml-auto bg-blue-600 text-white"
                    : "mr-auto bg-gray-200 text-gray-900",
                ].join(" ")}
              >
                {m.content}
              </div>
            );
          })}

          {loading && (
            <div className="mr-auto bg-gray-200 text-gray-900 p-3 rounded-lg max-w-[85%]">
              Thinking...
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <input
          className="flex-1 border rounded-lg p-3"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button
          className="px-4 py-3 rounded-lg bg-black text-white disabled:opacity-50"
          onClick={sendMessage}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}