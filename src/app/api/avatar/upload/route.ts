import getCurrentUser from "@/actions/getCurrentUser";
import { db } from "@/lib/db";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename") || "avatar.png";

  const blob = await put(filename, request.body, {
    access: "public",
  });

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json("User not found", { status: 404 });
  }

  await db.user.update({
    where: { id: currentUser.id },
    data: {
      avatar: blob.url,
      diamonds:{
        decrement: 20
      }
    },
  });

  return NextResponse.json(blob);
}
