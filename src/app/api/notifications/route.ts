import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ADMIN_EMAIL = "tmosquera93@gmail.com";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ notifications: [] });

  const userId = session.user.id;
  const isAdmin = session.user.email === ADMIN_EMAIL;

  // Auto-deliver orders past deadline
  await prisma.order.updateMany({
    where: {
      status: "SHIPPED",
      deliveryDeadline: { lt: new Date() },
    },
    data: { status: "DELIVERED", deliveredAt: new Date() },
  });

  const [unreadMessages, pendingOrdersAsSeller, pendingOrdersAsBuyer, paidOrdersAsSeller, paidOrdersAsBuyer, shippedOrdersAsBuyer, deliveredOrdersAsSeller] = await Promise.all([
    // Mensajes sin leer enviados por otra persona
    prisma.message.findMany({
      where: {
        readAt: null,
        senderId: { not: userId },
        conversation: {
          OR: [{ buyerId: userId }, { sellerId: userId }],
        },
      },
      include: {
        conversation: {
          include: {
            listing: { select: { id: true, title: true } },
            buyer:   { select: { id: true, name: true } },
            seller:  { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),

    // Órdenes pendientes donde soy vendedor
    prisma.order.findMany({
      where: { sellerId: userId, status: "PENDING" },
      include: { listing: { select: { id: true, title: true } } },
      orderBy: { createdAt: "desc" },
    }),

    // Órdenes pendientes donde soy comprador
    prisma.order.findMany({
      where: { buyerId: userId, status: "PENDING" },
      include: { listing: { select: { id: true, title: true } } },
      orderBy: { createdAt: "desc" },
    }),

    // Órdenes PAID donde soy vendedor (debo enviar el equipo)
    prisma.order.findMany({
      where: { sellerId: userId, status: "PAID" },
      include: { listing: { select: { id: true, title: true } } },
      orderBy: { createdAt: "desc" },
    }),

    // Órdenes PAID donde soy comprador (pago confirmado)
    prisma.order.findMany({
      where: { buyerId: userId, status: "PAID" },
      include: { listing: { select: { id: true, title: true } } },
      orderBy: { createdAt: "desc" },
    }),

    // Órdenes SHIPPED donde soy comprador (debo confirmar recepción)
    prisma.order.findMany({
      where: { buyerId: userId, status: "SHIPPED" },
      include: { listing: { select: { id: true, title: true } } },
      orderBy: { createdAt: "desc" },
    }),

    // Órdenes DELIVERED donde soy vendedor, entregadas en los últimos 7 días
    prisma.order.findMany({
      where: {
        sellerId: userId,
        status: "DELIVERED",
        deliveredAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      include: { listing: { select: { id: true, title: true } } },
      orderBy: { deliveredAt: "desc" },
    }),
  ]);

  // Si es admin: órdenes DELIVERED que necesitan transferencia (últimos 30 días)
  const pendingTransfers = isAdmin
    ? await prisma.order.findMany({
        where: {
          status: "DELIVERED",
          deliveredAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
        include: {
          listing: { select: { id: true, title: true } },
          seller:  { select: { name: true } },
        },
        orderBy: { deliveredAt: "desc" },
      })
    : [];

  // Agrupar mensajes sin leer por conversación
  const convMap = new Map<string, typeof unreadMessages>();
  for (const msg of unreadMessages) {
    const convId = msg.conversationId;
    if (!convMap.has(convId)) convMap.set(convId, []);
    convMap.get(convId)!.push(msg);
  }

  const notifications: {
    id: string;
    type: "message" | "sale" | "purchase";
    title: string;
    body: string;
    href: string;
    createdAt: Date;
  }[] = [];

  // Notificaciones de mensajes (una por conversación)
  for (const [convId, msgs] of convMap.entries()) {
    const conv = msgs[0].conversation;
    const other = conv.buyerId === userId ? conv.seller : conv.buyer;
    const count = msgs.length;
    notifications.push({
      id: `msg-${convId}`,
      type: "message",
      title: `Mensaje de ${other.name}`,
      body: count === 1
        ? `Tienes 1 mensaje sin leer sobre "${conv.listing.title}"`
        : `Tienes ${count} mensajes sin leer sobre "${conv.listing.title}"`,
      href: `/mensajes/${convId}`,
      createdAt: msgs[0].createdAt,
    });
  }

  // Notificaciones de ventas pendientes
  for (const order of pendingOrdersAsSeller) {
    notifications.push({
      id: `sale-${order.id}`,
      type: "sale",
      title: "Nueva venta pendiente",
      body: `Alguien compró "${order.listing.title}". Espera la confirmación de pago.`,
      href: "/cuenta/ventas",
      createdAt: order.createdAt,
    });
  }

  // Notificaciones de compras pendientes
  for (const order of pendingOrdersAsBuyer) {
    notifications.push({
      id: `purchase-${order.id}`,
      type: "purchase",
      title: "Compra en proceso",
      body: `Tu compra de "${order.listing.title}" está siendo validada.`,
      href: "/cuenta/compras",
      createdAt: order.createdAt,
    });
  }

  // Notificaciones de compras PAID (comprador: pago confirmado)
  for (const order of paidOrdersAsBuyer) {
    notifications.push({
      id: `paid-buyer-${order.id}`,
      type: "purchase",
      title: "¡Pago confirmado!",
      body: `Tu pago por "${order.listing.title}" fue confirmado. El vendedor está preparando el envío.`,
      href: "/cuenta/compras",
      createdAt: order.createdAt,
    });
  }

  // Notificaciones de ventas PAID (vendedor debe enviar)
  for (const order of paidOrdersAsSeller) {
    notifications.push({
      id: `ship-${order.id}`,
      type: "sale",
      title: "Pago confirmado — debes enviar el equipo",
      body: `Pago confirmado para "${order.listing.title}". Debes enviar el equipo al comprador.`,
      href: "/cuenta/ventas",
      createdAt: order.createdAt,
    });
  }

  // Notificaciones de pedidos SHIPPED (comprador debe confirmar)
  for (const order of shippedOrdersAsBuyer) {
    notifications.push({
      id: `shipped-${order.id}`,
      type: "purchase",
      title: "Tu pedido fue enviado",
      body: `"${order.listing.title}" está en camino. Confirma cuando llegue.`,
      href: "/cuenta/compras",
      createdAt: order.createdAt,
    });
  }

  // Notificaciones de entrega confirmada (vendedor)
  for (const order of deliveredOrdersAsSeller) {
    const amount = Math.round(order.amount * 0.95).toLocaleString("es-CO");
    notifications.push({
      id: `delivered-seller-${order.id}`,
      type: "sale",
      title: "¡Tu venta fue entregada!",
      body: `El comprador confirmó la recepción de "${order.listing.title}". Recibirás $${amount} COP (menos comisión del 5%) en las próximas horas.`,
      href: "/cuenta/ventas",
      createdAt: order.deliveredAt ?? order.updatedAt,
    });
  }

  // Notificaciones para el admin: transferencias pendientes
  for (const order of pendingTransfers) {
    const amount = Math.round(order.amount * 0.95).toLocaleString("es-CO");
    notifications.push({
      id: `transfer-${order.id}`,
      type: "sale",
      title: "Transferencia pendiente",
      body: `Entregar $${amount} COP a ${order.seller.name} por "${order.listing.title}".`,
      href: "/admin/orders",
      createdAt: order.deliveredAt ?? order.updatedAt,
    });
  }

  notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return NextResponse.json({ notifications });
}
