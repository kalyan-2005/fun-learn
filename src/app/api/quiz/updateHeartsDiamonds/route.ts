import { updateHeartsDiamonds } from "@/actions/quizzes";
import { NextResponse , NextRequest } from "next/server";

export async function POST (req: NextRequest) {
    try{
        const {hearts,diamonds}  = await req.json();
        
        const user = await updateHeartsDiamonds(hearts,diamonds);
        
        return NextResponse.json({ message: "Success", payload: user });
    }
    catch(error){
        return NextResponse.json({ message: "Error" });
    }
}