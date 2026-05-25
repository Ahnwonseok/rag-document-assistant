import ChatWindow from "@/components/ChatWindow";

export default function Home() {
  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center gap-3 px-6 py-4 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 text-white"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-semibold text-zinc-100">
            RAG Document Assistant
          </h1>
          <p className="text-xs text-zinc-500">
            AI-powered document Q&A system
          </p>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <ChatWindow />
      </main>

      <footer className="px-6 py-3 text-center text-xs text-zinc-600 border-t border-zinc-800">
        Powered by RAG + LLM
      </footer>
    </div>
  );
}
