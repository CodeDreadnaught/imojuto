import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireSession } from "@/lib/session";

const maxSize = 5 * 1024 * 1024;
const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: Request) {
  await requireSession();
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose an image file." }, { status: 400 });
  }

  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Only JPEG, PNG, or WebP images are allowed." }, { status: 400 });
  }

  if (file.size > maxSize) {
    return NextResponse.json({ error: "Image must be 5 MB or smaller." }, { status: 400 });
  }

  const blob = await put(`evidence/${crypto.randomUUID()}-${file.name}`, file, {
    access: "public",
  });

  return NextResponse.json({ url: blob.url });
}
