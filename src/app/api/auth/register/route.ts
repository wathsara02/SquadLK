import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { email, password, displayName, username } = await req.json();

        if (!email || !password || !displayName || !username) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        });

        if (existingUser) {
            return new NextResponse("Email or Username already taken", { status: 409 });
        }

        // In a real app we'd hash the password here with bcrypt
        // const passwordHash = await bcrypt.hash(password, 10);
        const passwordHash = password;

        const user = await prisma.user.create({
            data: {
                email,
                username,
                displayName,
                passwordHash,
            },
        });

        return NextResponse.json({ success: true, userId: user.id });
    } catch (error) {
        console.error("Registration error", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
