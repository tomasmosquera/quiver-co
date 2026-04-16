import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MessageCircle, Wind } from "lucide-react";

export default async function MensajesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const conversations = await prisma.conversation.findMany({
    where: { OR: [{ buyerId: session.user.id }, { sellerId: session.user.id }] },
    include: {
      listing: { select: { id: true, title: true, images: { take: 1, orderBy: { order: "asc" } } } },
      buyer:   { select: { id: true, name: true, image: true } },
      seller:  { select: { id: true, name: true, image: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-[#111827] mb-6">Mensajes</h1>

        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Wind className="w-12 h-12 text-[#D1D5DB] mb-4" />
            <h3 className="font-semibold text-[#374151] text-lg">Sin conversaciones aún</h3>
            <p className="text-sm text-[#9CA3AF] mt-1">Cuando contactes a un vendedor, aparecerá aquí.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv) => {
              const other = conv.buyerId === session.user.id ? conv.seller : conv.buyer;
              const lastMsg = conv.messages[0];
              const img = conv.listing.images[0]?.url;
              const unread = conv.messages[0] && !conv.messages[0].readAt && conv.messages[0].senderId !== session.user.id;

              return (
                <Link
                  key={conv.id}
                  href={`/mensajes/${conv.id}`}
                  className="flex items-center gap-4 bg-white border border-[#E5E7EB] rounded-2xl p-4 hover:border-[#3B82F6] hover:shadow-sm transition-all"
                >
                  {/* Foto anuncio */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#F3F4F6] shrink-0">
                    {img
                      ? <img src={img} alt="" className="w-full h-full object-cover" />
                      : <MessageCircle className="w-6 h-6 text-[#D1D5DB] m-auto mt-4" />
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-sm text-[#111827] truncate">{other.name}</p>
                      {lastMsg && (
                        <span className="text-xs text-[#9CA3AF] shrink-0">
                          {new Date(lastMsg.createdAt).toLocaleDateString("es-CO", { day: "numeric", month: "short" })}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#9CA3AF] truncate">{conv.listing.title}</p>
                    {lastMsg && (
                      <p className={`text-sm truncate mt-0.5 ${unread ? "font-semibold text-[#111827]" : "text-[#6B7280]"}`}>
                        {lastMsg.senderId === session.user.id ? "Tú: " : ""}{lastMsg.content}
                      </p>
                    )}
                  </div>

                  {unread && <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] shrink-0" />}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
