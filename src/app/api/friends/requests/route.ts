import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as z from "zod";

const requestSchema = z.object({
    receiverId: z.string(),
});

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { receiverId } = requestSchema.parse(await req.json());
        const senderId = (session.user as any).id;

        if (senderId === receiverId) return new NextResponse("Cannot add yourself", { status: 400 });

        const existing = await prisma.friendRequest.findUnique({
            where: { senderId_receiverId: { senderId, receiverId } }
        });

        if (existing) return new NextResponse("Request already sent", { status: 409 });

        const fr = await prisma.friendRequest.create({
            data: { senderId, receiverId }
        });

        return NextResponse.json(fr);
    } catch (error) {
        if (error instanceof z.ZodError) return new NextResponse("Validation Error", { status: 422 });
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const requests = await prisma.friendRequest.findMany({
            where: { receiverId: (session.user as any).id, status: "PENDING" },
            include: { sender: { select: { id: true, displayName: true, profilePhoto: true } } }
        });
        return NextResponse.json(requests);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
