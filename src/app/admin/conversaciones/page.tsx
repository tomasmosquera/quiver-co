import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default async function AdminConversacionesPage() {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) redirect("/");

  const conversations = await prisma.conversation.findMany({
    where: {
      buyer: { email: { not: { startsWith: "ghost+" } } },
    },
    include: {
      listing: {
        select: { id: true, title: true, images: { take: 1, orderBy: { order: "asc" } } },
      },
      buyer:   { select: { id: true, name: true, email: true, image: true } },
      seller:  { select: { id: true, name: true, email: true, image: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Conversaciones</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Mensajes entre usuarios reales · {conversations.length} conversación{conversations.length !== 1 ? "es" : ""}
        </p>
      </div>

      {conversations.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center">
          <MessageCircle className="w-10 h-10 text-[#D1D5DB] mx-auto mb-3" />
          <p className="text-[#6B7280] text-sm">Aún no hay conversaciones entre usuarios.</p>
        </div>
      ) : (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl divide-y divide-[#F3F4F6] overflow-hidden">
          {conversations.map((conv) => {
            const lastMsg = conv.messages[0];
            const thumb = conv.listing.images[0]?.url;
            return (
              <Link
                key={conv.id}
                href={`/admin/conversaciones/${conv.id}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-[#F9FAFB] transition-colors"
              >
                {/* Thumbnail anuncio */}
                <div className="w-12 h-12 rounded-xl bg-[#F3F4F6] overflow-hidden shrink-0">
                  {thumb
                    ? <img src={thumb} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full" />
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#111827] truncate">{conv.listing.title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    {/* Avatar comprador */}
                    <span className="text-xs text-[#6B7280]">{conv.buyer.name}</span>
                    <span className="text-xs text-[#D1D5DB]">→</span>
                    <span className="text-xs text-[#6B7280]">{conv.seller.name}</span>
                  </div>
                  {lastMsg && (
                    <p className="text-xs text-[#9CA3AF] truncate mt-0.5">{lastMsg.content}</p>
                  )}
                </div>

                <div className="text-xs text-[#9CA3AF] shrink-0 text-right">
                  {lastMsg
                    ? new Date(lastMsg.createdAt).toLocaleDateString("es-CO", {
                        day: "numeric",
                        month: "short",
                      })
                    : "—"}
                  <p className="mt-0.5 text-[10px] text-[#D1D5DB]">
                    {conv.messages.length > 0 ? "" : "sin mensajes"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
