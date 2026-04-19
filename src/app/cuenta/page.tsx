import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Shield } from "lucide-react";
import ProfileForm from "@/components/ProfileForm";

export default async function CuentaPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [user, ratingAgg] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true, email: true, image: true, phone: true,
        address: true, city: true, department: true, bio: true, verified: true, createdAt: true,
        _count: { select: { listings: true, favorites: true } },
      },
    }),
    prisma.review.aggregate({
      where: { subjectId: session.user.id },
      _avg: { rating: true },
      _count: { rating: true },
    }),
  ]);

  if (!user) redirect("/login");

  const memberSince = new Date(user.createdAt).toLocaleDateString("es-CO", { month: "long", year: "numeric" });
  const avgRating = ratingAgg._avg.rating;
  const ratingLabel = avgRating !== null
    ? `${avgRating.toFixed(1)} ★ (${ratingAgg._count.rating})`
    : "Nuevo";

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        {user.image ? (
          <img src={user.image} alt="" className="w-14 h-14 rounded-full object-cover" />
        ) : (
          <div className="w-14 h-14 rounded-full bg-[#3B82F6] flex items-center justify-center text-white text-xl font-bold">
            {user.name?.[0] ?? "U"}
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#111827]">{user.name ?? "Mi perfil"}</h1>
            {user.verified && <Shield className="w-4 h-4 text-[#3B82F6]" />}
          </div>
          <p className="text-sm text-[#6B7280]">{user.email} · Miembro desde {memberSince}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Anuncios activos", value: user._count.listings },
          { label: "Favoritos",        value: user._count.favorites },
          { label: "Calificación",     value: ratingLabel },
          { label: "Verificado",       value: user.verified ? "Sí" : "No" },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[#E5E7EB] rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-[#111827]">{s.value}</p>
            <p className="text-xs text-[#6B7280] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Formulario */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
        <h2 className="text-base font-bold text-[#111827] mb-1">Información personal</h2>
        <p className="text-sm text-[#6B7280] mb-6">
          Tu teléfono y dirección se usan para agilizar el proceso de compra.
        </p>
        <ProfileForm
          initial={{
            name:       user.name       ?? "",
            phone:      user.phone      ?? "",
            address:    user.address    ?? "",
            city:       user.city       ?? "",
            department: user.department ?? "",
            bio:        user.bio        ?? "",
          }}
        />
      </div>

    </div>
  );
}
