import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/lib/auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const apiKey = process.env.CLOUDINARY_API_KEY;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!apiKey || !cloudName || !apiSecret) {
    return NextResponse.json(
      { error: "Falta configuración de Cloudinary." },
      { status: 500 }
    );
  }

  const folder = "quiver-co";
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request({ folder, timestamp }, apiSecret);

  return NextResponse.json({
    apiKey,
    cloudName,
    folder,
    resourceType: "auto" as const,
    signature,
    timestamp,
  });
}
