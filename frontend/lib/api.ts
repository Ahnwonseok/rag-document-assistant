const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface SourceInfo {
  content: string;
  documentTitle: string;
  score: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  sources?: SourceInfo[];
}

export interface ChatResponse {
  answer: string;
  sources: SourceInfo[];
  sessionId: string;
}

export async function sendMessage(
  question: string,
  sessionId: string
): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE}/api/chat/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, sessionId }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export async function getChatHistory(
  sessionId: string
): Promise<ChatMessage[]> {
  const response = await fetch(
    `${API_BASE}/api/chat/history?sessionId=${encodeURIComponent(sessionId)}`
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}
