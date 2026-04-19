import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import ConversationThread from "./ConversationThread";

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      listing: { select: { id: true, title: true, images: { take: 1, orderBy: { order: "asc" } } } },
      buyer:   { select: { id: true, name: true, image: true } },
      seller:  { select: { id: true, name: true, image: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        include: { sender: { select: { id: true, name: true, image: true } } },
      },
    },
  });

  if (!conversation) notFound();
  if (conversation.buyerId !== session.user.id && conversation.sellerId !== session.user.id) notFound();

  // Marcar como leídos
  await prisma.message.updateMany({
    where: { conversationId: id, senderId: { not: session.user.id }, readAt: null },
    data: { readAt: new Date() },
  });

  const other = conversation.buyerId === session.user.id ? conversation.seller : conversation.buyer;
  const img = conversation.listing.images[0]?.url;

  return (
    <div className="bg-[#FAFAF8] h-[75vh] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/mensajes" className="p-1.5 rounded-lg hover:bg-[#F3F4F6] transition-colors">
            <ChevronLeft className="w-5 h-5 text-[#374151]" />
          </Link>

          {other.image
            ? <img src={other.image} alt="" className="w-9 h-9 rounded-full object-cover" />
            : <div className="w-9 h-9 rounded-full bg-[#3B82F6] flex items-center justify-center text-white font-bold text-sm">{other.name?.[0]}</div>
          }

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-[#111827]">{other.name}</p>
            <Link href={`/equipo/${conversation.listing.id}`} className="text-xs text-[#3B82F6] hover:underline truncate block">
              {conversation.listing.title}
            </Link>
          </div>

          {img && (
            <img src={img} alt="" className="w-10 h-10 rounded-lg object-cover border border-[#E5E7EB]" />
          )}
        </div>
      </div>

      {/* Thread */}
      <ConversationThread
        conversationId={id}
        currentUserId={session.user.id}
        initialMessages={conversation.messages.map(m => ({
          id: m.id,
          content: m.content,
          createdAt: m.createdAt.toISOString(),
          senderId: m.senderId,
          sender: m.sender,
        }))}
      />
    </div>
  );
}
