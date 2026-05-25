"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import MessageBubble from "./MessageBubble";
import SourceCard from "./SourceCard";
import ChatInput from "./ChatInput";
import { sendMessage, type ChatMessage } from "@/lib/api";

function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-zinc-700 text-zinc-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path d="M13.024 9.25c.47 0 .827-.433.637-.863a4 4 0 00-7.322 0c-.19.43.168.863.637.863h6.048zM7.5 11.5a.5.5 0 00-1 0v1a.5.5 0 001 0v-1zm5 0a.5.5 0 00-1 0v1a.5.5 0 001 0v-1zM10 2a8 8 0 100 16 8 8 0 000-16z" />
        </svg>
      </div>
      <div className="bg-zinc-800 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
        <span className="typing-dot w-2 h-2 bg-zinc-400 rounded-full" />
        <span className="typing-dot w-2 h-2 bg-zinc-400 rounded-full" />
        <span className="typing-dot w-2 h-2 bg-zinc-400 rounded-full" />
      </div>
    </div>
  );
}

function WelcomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/20 mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-8 h-8 text-blue-500"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-zinc-100 mb-2">
        무엇이든 물어보세요
      </h2>
      <p className="text-sm text-zinc-500 max-w-md">
        업로드된 문서를 기반으로 질문에 답변합니다. 관련 출처도 함께 제공됩니다.
      </p>
    </div>
  );
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSessionId(crypto.randomUUID());
  }, []);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  const handleSend = useCallback(
    async (content: string) => {
      const userMessage: ChatMessage = { role: "user", content };
      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);

      try {
        const response = await sendMessage(content, sessionId);
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: response.answer,
          sources: response.sources,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch {
        const errorMessage: ChatMessage = {
          role: "assistant",
          content:
            "죄송합니다. 요청을 처리하는 중 오류가 발생했습니다. 다시 시도해 주세요.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setLoading(false);
      }
    },
    [sessionId]
  );

  return (
    <div className="flex flex-col h-full">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto chat-scrollbar px-4 py-6"
      >
        {messages.length === 0 && !loading ? (
          <WelcomeScreen />
        ) : (
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((msg, i) => (
              <div key={i}>
                <MessageBubble role={msg.role} content={msg.content} />
                {msg.role === "assistant" && msg.sources && (
                  <SourceCard sources={msg.sources} />
                )}
              </div>
            ))}
            {loading && <TypingIndicator />}
          </div>
        )}
      </div>
      <div className="max-w-3xl mx-auto w-full">
        <ChatInput onSend={handleSend} disabled={loading} />
      </div>
    </div>
  );
}
