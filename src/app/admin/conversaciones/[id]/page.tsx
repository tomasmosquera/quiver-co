import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Eye } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminConversacionThreadPage({ params }: Props) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) redirect("/");

  const { id } = await params;

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      listing: { select: { id: true, title: true, images: { take: 1, orderBy: { order: "asc" } } } },
      buyer:   { select: { id: true, name: true, email: true, image: true } },
      seller:  { select: { id: true, name: true, email: true, image: true } },
    },
  });

  if (!conversation || conversation.buyer.email?.startsWith("ghost+")) notFound();

  const messages = await prisma.message.findMany({
    where: { conversationId: id },
    orderBy: { createdAt: "asc" },
    include: { sender: { select: { id: true, name: true, image: true } } },
  });

  const thumb = conversation.listing.images[0]?.url;

  function formatTime(date: Date) {
    return date.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
  }
  function formatDate(date: Date) {
    return date.toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
  }

  // Agrupar por fecha
  const grouped: { date: string; messages: typeof messages }[] = [];
  for (const msg of messages) {
    const date = formatDate(msg.createdAt);
    const last = grouped[grouped.length - 1];
    if (last?.date === date) last.messages.push(msg);
    else grouped.push({ date, messages: [msg] });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link href="/admin/conversaciones" className="mt-1 text-[#6B7280] hover:text-[#111827] transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>

        <div className="flex items-center gap-3 flex-1 min-w-0">
          {thumb && (
            <div className="w-12 h-12 rounded-xl bg-[#F3F4F6] overflow-hidden shrink-0">
              <img src={thumb} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-base font-bold text-[#111827] truncate">{conversation.listing.title}</p>
            <p className="text-xs text-[#6B7280] mt-0.5">
              {conversation.buyer.name} ({conversation.buyer.email}) →{" "}
              {conversation.seller.name} ({conversation.seller.email})
            </p>
          </div>
        </div>

        <Link
          href={`/equipo/${conversation.listing.id}`}
          target="_blank"
          className="shrink-0 flex items-center gap-1.5 px-3 py-2 border border-[#E5E7EB] hover:bg-[#F9FAFB] text-[#374151] text-xs font-semibold rounded-xl transition-colors"
        >
          <Eye className="w-3.5 h-3.5" /> Ver anuncio
        </Link>
      </div>

      {/* Leyenda modo lectura */}
      <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 text-amber-700 text-xs font-medium px-4 py-2.5 rounded-xl">
        <Eye className="w-4 h-4 shrink-0" />
        Estás en modo lectura. Los usuarios no saben que estás viendo esta conversación.
      </div>

      {/* Hilo de mensajes */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
        {messages.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#9CA3AF]">Esta conversación no tiene mensajes aún.</div>
        ) : (
          <div className="p-6 space-y-1">
            {grouped.map(({ date, messages: dayMsgs }) => (
              <div key={date}>
                {/* Separador de fecha */}
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-[#F3F4F6]" />
                  <span className="text-xs text-[#9CA3AF] bg-white px-2">{date}</span>
                  <div className="flex-1 h-px bg-[#F3F4F6]" />
                </div>

                {dayMsgs.map((msg) => {
                  const isBuyer = msg.senderId === conversation.buyerId;
                  return (
                    <div key={msg.id} className={`flex gap-3 mb-4 ${isBuyer ? "flex-row" : "flex-row-reverse"}`}>
                      {/* Avatar */}
                      <div className="shrink-0 mt-1">
                        {msg.sender.image
                          ? <img src={msg.sender.image} alt="" className="w-7 h-7 rounded-full object-cover" />
                          : <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${isBuyer ? "bg-[#3B82F6]" : "bg-[#10B981]"}`}>
                              {msg.sender.name?.[0] ?? "?"}
                            </div>
                        }
                      </div>

                      <div className={`max-w-[70%] flex flex-col ${isBuyer ? "items-start" : "items-end"}`}>
                        <span className="text-[10px] text-[#9CA3AF] mb-0.5 px-1">
                          {msg.sender.name} · {isBuyer ? "comprador" : "vendedor"}
                        </span>
                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          isBuyer
                            ? "bg-[#F3F4F6] text-[#111827] rounded-tl-sm"
                            : "bg-[#111827] text-white rounded-tr-sm"
                        }`}>
                          {msg.content}
                        </div>
                        <span className="text-[10px] text-[#9CA3AF] mt-1 px-1">{formatTime(msg.createdAt)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-center text-[#9CA3AF]">
        {messages.length} mensaje{messages.length !== 1 ? "s" : ""} en total
      </p>
    </div>
  );
}
