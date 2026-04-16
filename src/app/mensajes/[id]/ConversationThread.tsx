"use client";

import { useState, useRef, useEffect } from "react";
import { Send, AlertCircle } from "lucide-react";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  sender: { id: string; name: string | null; image: string | null };
}

interface Props {
  conversationId: string;
  currentUserId: string;
  initialMessages: Message[];
}

export default function ConversationThread({ conversationId, currentUserId, initialMessages }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Polling cada 5 segundos
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/conversations/${conversationId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages.map((m: any) => ({
          ...m,
          createdAt: m.createdAt,
        })));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [conversationId]);

  async function send() {
    if (!input.trim() || sending) return;
    setError(null);
    setSending(true);

    const res = await fetch(`/api/conversations/${conversationId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: input.trim() }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Error al enviar");
    } else {
      setMessages(prev => [...prev, data.message]);
      setInput("");
    }

    setSending(false);
  }

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "long" });
  }

  // Agrupar mensajes por fecha
  const grouped: { date: string; messages: Message[] }[] = [];
  for (const msg of messages) {
    const date = formatDate(msg.createdAt);
    const last = grouped[grouped.length - 1];
    if (last?.date === date) last.messages.push(msg);
    else grouped.push({ date, messages: [msg] });
  }

  return (
    <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4">
      {/* Mensajes */}
      <div className="flex-1 py-6 space-y-4 overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-center text-sm text-[#9CA3AF] mt-10">
            Sé el primero en escribir. Recuerda no compartir datos de contacto.
          </p>
        )}

        {grouped.map(({ date, messages: dayMsgs }) => (
          <div key={date}>
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-[#E5E7EB]" />
              <span className="text-xs text-[#9CA3AF]">{date}</span>
              <div className="flex-1 h-px bg-[#E5E7EB]" />
            </div>

            {dayMsgs.map((msg) => {
              const isMe = msg.senderId === currentUserId;
              return (
                <div key={msg.id} className={`flex gap-2 mb-3 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                  {!isMe && (
                    msg.sender.image
                      ? <img src={msg.sender.image} alt="" className="w-7 h-7 rounded-full object-cover shrink-0 mt-1" />
                      : <div className="w-7 h-7 rounded-full bg-[#3B82F6] flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1">{msg.sender.name?.[0]}</div>
                  )}
                  <div className={`max-w-[75%] ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isMe
                        ? "bg-[#111827] text-white rounded-tr-sm"
                        : "bg-white border border-[#E5E7EB] text-[#111827] rounded-tl-sm"
                    }`}>
                      {msg.content}
                    </div>
                    <span className="text-xs text-[#9CA3AF] mt-1 px-1">{formatTime(msg.createdAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-2.5 rounded-xl mb-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Input */}
      <div className="py-4 border-t border-[#E5E7EB] bg-[#FAFAF8]">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(null); }}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Escribe un mensaje..."
            maxLength={1000}
            className="flex-1 px-4 py-3 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] transition-colors"
          />
          <button
            onClick={send}
            disabled={!input.trim() || sending}
            className="px-4 py-3 bg-[#111827] hover:bg-[#374151] disabled:opacity-40 text-white rounded-xl transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-[#9CA3AF] mt-2 text-center">
          No compartas teléfonos, correos ni redes sociales.
        </p>
      </div>
    </div>
  );
}
