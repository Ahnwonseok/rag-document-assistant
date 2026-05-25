"use client";

import { useState } from "react";
import type { SourceInfo } from "@/lib/api";

interface SourceCardProps {
  sources: SourceInfo[];
}

function ScoreBadge({ score }: { score: number }) {
  const percentage = Math.round(score * 100);
  const color =
    percentage >= 80
      ? "bg-green-900/50 text-green-400 border-green-800"
      : percentage >= 60
        ? "bg-yellow-900/50 text-yellow-400 border-yellow-800"
        : "bg-zinc-800 text-zinc-400 border-zinc-700";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${color}`}
    >
      {percentage}%
    </span>
  );
}

export default function SourceCard({ sources }: SourceCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-2 ml-11 animate-fade-in">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-300 transition-colors"
      >
        <span>📎 출처 보기</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path
            fillRule="evenodd"
            d="M4.22 6.22a.75.75 0 011.06 0L8 8.94l2.72-2.72a.75.75 0 111.06 1.06l-3.25 3.25a.75.75 0 01-1.06 0L4.22 7.28a.75.75 0 010-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-2 space-y-2">
          {sources.map((source, index) => (
            <div
              key={index}
              className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-zinc-300">
                  {source.documentTitle}
                </span>
                <ScoreBadge score={source.score} />
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3">
                {source.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
