import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as z from "zod";

const onboardingSchema = z.object({
    district: z.string().optional(),
    bio: z.string().optional(),
    languages: z.array(z.string()).optional(),
    platforms: z.array(z.string()).optional(),
    playStyles: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const json = await req.json();
        const body = onboardingSchema.parse(json);

        await prisma.user.update({
            where: { id: (session.user as any).id },
            data: {
                district: body.district as any,
                bio: body.bio,
                languages: body.languages as any,
                platforms: body.platforms as any,
                playStyles: body.playStyles as any,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Onboarding error", error);
        if (error instanceof z.ZodError) {
            return new NextResponse("Invalid request data", { status: 422 });
        }
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
