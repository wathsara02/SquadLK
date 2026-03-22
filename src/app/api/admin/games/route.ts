import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as z from "zod";

const optionSchema = z.object({
    label: z.string(),
    tier: z.string().optional().nullable(),
    sortPriority: z.number()
});

const gameSchema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    category: z.string().optional(),
    isFreeText: z.boolean().default(false),
    options: z.array(optionSchema).optional()
});

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "SUPER_ADMIN")) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const json = await req.json();
        const data = gameSchema.parse(json);

        const game = await prisma.game.create({
            data: {
                name: data.name,
                slug: data.slug,
                category: data.category,
                rankDefinition: {
                    create: {
                        isFreeText: data.isFreeText,
                        options: {
                            create: data.options || []
                        }
                    }
                }
            }
        });

        return NextResponse.json(game);
    } catch (error) {
        if (error instanceof z.ZodError) return new NextResponse(error.message, { status: 422 });
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
