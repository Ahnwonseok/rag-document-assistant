interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      className={`flex gap-3 animate-fade-in ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <div
        className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-zinc-700 text-zinc-300"
        }`}
      >
        {isUser ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M13.024 9.25c.47 0 .827-.433.637-.863a4 4 0 00-7.322 0c-.19.43.168.863.637.863h6.048zM7.5 11.5a.5.5 0 00-1 0v1a.5.5 0 001 0v-1zm5 0a.5.5 0 00-1 0v1a.5.5 0 001 0v-1zM10 2a8 8 0 100 16 8 8 0 000-16z" />
          </svg>
        )}
      </div>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-blue-600 text-white rounded-tr-sm"
            : "bg-zinc-800 text-zinc-200 rounded-tl-sm"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
