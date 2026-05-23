import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import AdminConversationThread from "./AdminConversationThread";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminConversationPage({ params }: Props) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) redirect("/");

  const { id } = await params;

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      listing: {
        select: { id: true, title: true, images: { take: 1, orderBy: { order: "asc" } } },
      },
      buyer: { select: { id: true, name: true, email: true } },
      seller: { select: { id: true, name: true } },
    },
  });

  if (!conversation || !conversation.buyer.email?.startsWith("ghost+")) notFound();

  const messages = await prisma.message.findMany({
    where: { conversationId: id },
    orderBy: { createdAt: "asc" },
    include: { sender: { select: { id: true, name: true, image: true } } },
  });

  const thumb = conversation.listing.images[0]?.url;

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-h-[800px]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-[#E5E7EB] bg-white">
        <Link
          href="/admin/mensajes"
          className="text-[#6B7280] hover:text-[#111827] transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>

        {thumb && (
          <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] overflow-hidden shrink-0">
            <img src={thumb} alt="" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#111827] truncate">{conversation.listing.title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs font-medium text-[#8B5CF6]">
              Tú como: {conversation.buyer.name}
            </span>
            <span className="text-xs text-[#9CA3AF]">·</span>
            <span className="text-xs text-[#6B7280]">vendedor: {conversation.seller.name}</span>
          </div>
        </div>

        <Link
          href={`/equipo/${conversation.listing.id}`}
          target="_blank"
          className="text-xs text-[#3B82F6] hover:underline shrink-0"
        >
          Ver anuncio
        </Link>
      </div>

      {/* Thread */}
      <AdminConversationThread
        conversationId={id}
        ghostUserId={conversation.buyerId}
        initialMessages={messages}
      />
    </div>
  );
}
