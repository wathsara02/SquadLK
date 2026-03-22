import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as z from "zod";

const messageSchema = z.object({
    conversationId: z.string(),
    content: z.string().min(1),
});

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { conversationId, content } = messageSchema.parse(await req.json());
        const senderId = (session.user as any).id;

        // Verify participant
        const isParticipant = await prisma.conversationParticipant.findUnique({
            where: { conversationId_userId: { conversationId, userId: senderId } }
        });

        if (!isParticipant) return new NextResponse("Forbidden", { status: 403 });

        const message = await prisma.message.create({
            data: {
                conversationId,
                senderId,
                content
            }
        });

        return NextResponse.json(message);
    } catch (error) {
        if (error instanceof z.ZodError) return new NextResponse("Validation Error", { status: 422 });
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
