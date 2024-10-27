import getCurrentUser from "@/actions/getCurrentUser";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { url, voiceid } = await req.json();
  const currentUser = await getCurrentUser();

  try {
    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const user = await db.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        imgurl: url,
        voiceid,
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
