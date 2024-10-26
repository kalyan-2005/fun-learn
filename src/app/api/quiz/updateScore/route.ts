import { NextResponse, NextRequest } from "next/server";
import { updateScore } from "@/actions/quizzes";

export async function POST(req: NextRequest) {
  try {
    const {submoduleId, score} = await req.json();

    const updatedScore = await updateScore(submoduleId, score);

    return NextResponse.json({ message: "Success", payload: updatedScore });
  } catch (error) {
    return NextResponse.json({ message: "Error" });
  }
}
