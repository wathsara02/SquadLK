import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const games = await prisma.game.findMany({
            include: {
                rankDefinition: {
                    include: { options: true }
                }
            },
            orderBy: { name: "asc" }
        });
        return NextResponse.json(games);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
