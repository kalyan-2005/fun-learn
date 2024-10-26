import { NextResponse,NextRequest } from "next/server";
import { buySuperCoins } from "@/actions/superCoins";

export async function POST (req: NextRequest) {
    try{
        const { count } = await req.json();
        
        const user = await buySuperCoins(count);
        
        return NextResponse.json({ message: "Success", payload: user });
    }
    catch(error) {
        return NextResponse.json({ message: "Error" });
    }
}