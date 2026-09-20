import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Send,
  Trash2,
  AlertCircle,
  ShieldAlert,
  Bot,
  User,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { ChatMessage } from "../types";
import {
  getChatMessages,
  saveChatMessage,
  clearChatMessages,
} from "../services/firebase";

interface AIAssistantPageProps {
  onOpenSafetyAlert: () => void;
  onNavigate: (route: string, state?: any) => void;
}

const QUICK_PROMPTS = [
  "I'm feeling overwhelmed with work and exams",
  "Can you guide me through a quick breathing technique?",
  "How can I unwind and improve my sleep tonight?",
  "I'm feeling nervous about an upcoming conversation",
];

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({
  onOpenSafetyAlert,
  onNavigate,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sessionId = "default_session";
  const userId = user ? user.uid : "guest_user";

  useEffect(() => {
    getChatMessages(userId, sessionId).then(setMessages).catch(console.error);
  }, [userId, sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isTyping) return;

    setInputText("");

    const userMsg: ChatMessage = {
      id: "msg_" + Date.now(),
      sessionId,
      userId,
      sender: "user",
      text: query,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    saveChatMessage(userId, sessionId, userMsg);
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: messages.map((m) => ({
            role: m.sender === "assistant" ? "model" : "user",
            parts: [{ text: m.text }],
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: "msg_" + (Date.now() + 1),
        sessionId,
        userId,
        sender: "assistant",
        text: data.text,
        createdAt: new Date().toISOString(),
        isEmergency: data.isEmergency,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      saveChatMessage(userId, sessionId, assistantMsg);

      if (data.isEmergency) {
        onOpenSafetyAlert();
      }
    } catch (err) {
      console.error(err);
      // Compassionate offline fallback response
      const fallbackMsg: ChatMessage = {
        id: "msg_" + (Date.now() + 1),
        sessionId,
        userId,
        sender: "assistant",
        text:
          "Thank you for sharing with me. Remember to breathe gently into your belly and give yourself credit for how much you are carrying. If you need a moment of grounding, try our 4-4 breathing circle.",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      saveChatMessage(userId, sessionId, fallbackMsg);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm("Are you sure you want to clear your conversation history?")) {
      await clearChatMessages(userId, sessionId);
      const refreshed = await getChatMessages(userId, sessionId);
      setMessages(refreshed);
      showToast("Chat history cleared.", "info");
    }
  };

  return (
    <div
      id="ai-assistant-page"
      className="max-w-4xl mx-auto px-4 sm:px-6 py-6 h-[calc(100vh-5rem)] flex flex-col"
    >
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm mb-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-800 dark:text-slate-100">
                MindCare AI Wellness Assistant
              </h1>
              <span className="text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                Safe AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Compassionate, non-diagnostic wellness reflection & coping suggestions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="clear-chat-btn"
            onClick={handleClearHistory}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 rounded-xl px-3.5 py-2 mb-3 text-xs text-amber-800 dark:text-amber-300/90 flex items-center justify-between gap-2 shrink-0">
        <span className="leading-tight">
          <strong>Notice:</strong> MindCare AI provides general wellness support. It cannot diagnose conditions or replace licensed therapy.
        </span>
        <button
          onClick={onOpenSafetyAlert}
          className="text-rose-600 dark:text-rose-400 font-bold hover:underline shrink-0 flex items-center gap-1"
        >
          <ShieldAlert className="w-3.5 h-3.5" /> Crisis Helplines
        </button>
      </div>

      {/* Chat Messages Container */}
      <div
        id="chat-messages-container"
        className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 overflow-y-auto space-y-4 shadow-sm"
      >
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? "bg-indigo-600 text-white"
                    : "bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 sm:p-4 text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? "bg-indigo-600 text-white rounded-tr-sm"
                    : msg.isEmergency
                    ? "bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 text-rose-900 dark:text-rose-200 rounded-tl-sm"
                    : "bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-sm"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div
                  className={`text-[10px] mt-2 flex items-center gap-1.5 ${
                    isUser
                      ? "text-indigo-200 justify-end"
                      : "text-slate-400 justify-start"
                  }`}
                >
                  <span>
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {msg.isEmergency && (
                    <span className="font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-0.5">
                      • Crisis Safety Alert
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-slate-400 ml-1.5">Thinking gently...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
        {QUICK_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            id={`quick-prompt-${i}`}
            onClick={() => handleSendMessage(prompt)}
            className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap transition-colors border border-slate-200 dark:border-slate-700"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-sm shrink-0"
      >
        <input
          id="chat-user-input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Share your thoughts or ask for a calming exercise..."
          className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
        />
        <button
          type="submit"
          id="send-chat-btn"
          disabled={!inputText.trim() || isTyping}
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md disabled:opacity-40 transition-all"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
