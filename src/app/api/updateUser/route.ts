import { NextResponse,NextRequest } from "next/server";
import { db } from "@/lib/db";
import getCurrentUser from "@/actions/getCurrentUser";

export async function POST (req: NextRequest) {
    try{
        const { imgurl, voiceid } = await req.json();
        const currentUser = await getCurrentUser()
        if(!currentUser){
            return NextResponse.json({ message: "Unauthorized" });
        }
        
        const user = await db.user.update({
            where:{
                id:currentUser.id
            },
            data:{
                imgurl,
                voiceid
            }
        })
        
        return NextResponse.json({ message: "Success", payload: user });
    }
    catch(error){
        return NextResponse.json({ message: "Error" });
    }
}