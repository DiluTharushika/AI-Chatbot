import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import type { ChatMessage } from "@/lib/types";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  const { messages } = (await req.json()) as { messages: ChatMessage[] };

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: "Missing GROQ_API_KEY" }, { status: 500 });
  }

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages,
    temperature: 0.7,
  });

  const reply = completion.choices?.[0]?.message?.content ?? "";
  return NextResponse.json({ reply });
}