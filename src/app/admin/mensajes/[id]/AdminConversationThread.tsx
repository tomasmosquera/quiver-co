"use client";

import { useState, useRef, useEffect } from "react";
import { Send, AlertCircle, Trash2 } from "lucide-react";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  sender: { id: string; name: string | null; image: string | null };
}

interface Props {
  conversationId: string;
  ghostUserId: string;
  initialMessages: Message[];
}

const STORAGE_KEY = "adminHiddenMessages";

function getHidden(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveHidden(hidden: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...hidden]));
}

export default function AdminConversationThread({ conversationId, ghostUserId, initialMessages }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Cargar IDs ocultos desde localStorage (solo en cliente)
  useEffect(() => {
    setHidden(getHidden());
  }, []);

  // Polling cada 30 segundos — se pausa cuando la pestaña no es visible
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    async function poll() {
      const res = await fetch(`/api/admin/ghost-contact/${conversationId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
      }
    }

    function start() {
      if (interval) return;
      interval = setInterval(poll, 30_000);
    }

    function stop() {
      if (interval) { clearInterval(interval); interval = null; }
    }

    function onVisibility() {
      if (document.visibilityState === "visible") { poll(); start(); }
      else stop();
    }

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => { stop(); document.removeEventListener("visibilitychange", onVisibility); };
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function hideMessage(id: string) {
    setHidden((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveHidden(next);
      return next;
    });
  }

  async function send() {
    if (!input.trim() || sending) return;
    setError(null);
    setSending(true);
    try {
      const res = await fetch(`/api/admin/ghost-contact/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error al enviar");
      } else {
        setMessages((prev) => [...prev, data.message]);
        setInput("");
      }
    } finally {
      setSending(false);
    }
  }

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "long" });
  }

  const visible = messages.filter((m) => !hidden.has(m.id));

  const grouped: { date: string; messages: Message[] }[] = [];
  for (const msg of visible) {
    const date = formatDate(msg.createdAt);
    const last = grouped[grouped.length - 1];
    if (last?.date === date) last.messages.push(msg);
    else grouped.push({ date, messages: [msg] });
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto py-6 space-y-1 px-4">
        {visible.length === 0 && (
          <p className="text-center text-sm text-[#9CA3AF] mt-10">Sin mensajes visibles.</p>
        )}

        {grouped.map(({ date, messages: dayMsgs }) => (
          <div key={date}>
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-[#E5E7EB]" />
              <span className="text-xs text-[#9CA3AF]">{date}</span>
              <div className="flex-1 h-px bg-[#E5E7EB]" />
            </div>

            {dayMsgs.map((msg) => {
              const isGhost = msg.senderId === ghostUserId;
              return (
                <div key={msg.id} className={`group flex gap-2 mb-3 ${isGhost ? "flex-row-reverse" : "flex-row"}`}>
                  {!isGhost && (
                    msg.sender.image
                      ? <img src={msg.sender.image} alt="" className="w-7 h-7 rounded-full object-cover shrink-0 mt-1" />
                      : <div className="w-7 h-7 rounded-full bg-[#10B981] flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1">
                          {msg.sender.name?.[0] ?? "V"}
                        </div>
                  )}
                  <div className={`max-w-[75%] flex flex-col ${isGhost ? "items-end" : "items-start"}`}>
                    {!isGhost && (
                      <span className="text-xs text-[#6B7280] mb-0.5 px-1">
                        {msg.sender.name} (vendedor)
                      </span>
                    )}
                    <div className="flex items-end gap-1.5">
                      {/* Botón eliminar — visible al hacer hover */}
                      <button
                        onClick={() => hideMessage(msg.id)}
                        title="Eliminar de esta vista"
                        className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 shrink-0 ${isGhost ? "order-first" : "order-last"}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        isGhost
                          ? "bg-[#8B5CF6] text-white rounded-tr-sm"
                          : "bg-white border border-[#E5E7EB] text-[#111827] rounded-tl-sm"
                      }`}>
                        {msg.content}
                      </div>
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
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-2.5 rounded-xl mx-4 mb-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Input */}
      <div className="py-4 px-4 border-t border-[#E5E7EB] bg-[#FAFAF8]">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(null); }}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Responder como cliente..."
            maxLength={1000}
            className="flex-1 px-4 py-3 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#8B5CF6] transition-colors"
          />
          <button
            onClick={send}
            disabled={!input.trim() || sending}
            className="px-4 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-40 text-white rounded-xl transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-[#9CA3AF] mt-2 text-center">
          Cada mensaje que envíes llegará al vendedor como si fuera del cliente.
        </p>
      </div>
    </div>
  );
}
