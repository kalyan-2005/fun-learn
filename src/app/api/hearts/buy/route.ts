import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import getCurrentUser from "@/actions/getCurrentUser";

export async function POST(req: NextRequest) {
  try {
    const { count } = await req.json();
    const currentUser = await getCurrentUser();
    if (!currentUser) return null;
    const user = await db.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        hearts: {
          increment: count,
        },
      },
    });
    const diamonds = await db.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        diamonds: {
          decrement: count * 5 - 2 * (count - 1),
        },
      },
    });

    return NextResponse.json({ message: "Success", payload: user });
  } catch (error) {
    return NextResponse.json({ message: "Error" });
  }
}
