import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { gameId, inGameName, platform, rank, lookingForTeam } = await req.json();

        const profile = await prisma.userGameProfile.upsert({
            where: { userId_gameId: { userId: (session.user as any).id, gameId } },
            update: { inGameName, platform, rank, lookingForTeam },
            create: {
                userId: (session.user as any).id,
                gameId,
                inGameName,
                platform,
                rank,
                lookingForTeam
            }
        });

        return NextResponse.json(profile);
    } catch (error) {
        console.error("Profile error", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
