import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function MyProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/auth/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: (session.user as any).id },
        include: {
            gameProfiles: {
                include: { game: true }
            }
        }
    });

    if (!user) return <div>User not found</div>;

    return (
        <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ background: "var(--surface)", padding: "2rem", borderRadius: "8px", border: "1px solid var(--border)", marginBottom: "2rem" }}>
                <h1 style={{ fontSize: "2.5rem", color: "white", marginBottom: "0.5rem" }}>{user.displayName}</h1>
                <p style={{ color: "var(--primary)", fontSize: "1.2rem", marginBottom: "1rem" }}>@{user.username}</p>

                {user.bio && <p style={{ fontSize: "1rem", color: "var(--foreground)", opacity: 0.9, marginBottom: "1.5rem" }}>{user.bio}</p>}

                <div style={{ display: "grid", gap: "0.5rem", color: "var(--border)", fontSize: "0.9rem" }}>
                    <div><strong>District:</strong> {user.district?.replace("_", " ") || "Not specified"}</div>
                    <div><strong>Languages:</strong> {user.languages.join(", ")}</div>
                    <div><strong>Platforms:</strong> {user.platforms.join(", ")}</div>
                    <div><strong>Play Styles:</strong> {user.playStyles.map(s => s.replace("_", " ")).join(", ")}</div>
                </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1.5rem", color: "white" }}>Game Profiles</h2>
                <a href="/profile/games" style={{ background: "var(--primary)", color: "white", padding: "0.5rem 1rem", borderRadius: "4px", textDecoration: "none" }}>+ Add Game</a>
            </div>

            <div style={{ display: "grid", gap: "1rem" }}>
                {user.gameProfiles.map(gp => (
                    <div key={gp.id} style={{ background: "var(--surface)", padding: "1.5rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
                        <h3 style={{ fontSize: "1.2rem", color: "var(--primary)", marginBottom: "0.5rem" }}>{gp.game.name}</h3>
                        <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.95rem" }}>
                            <div><strong>IGN:</strong> <span style={{ color: "white" }}>{gp.inGameName}</span></div>
                            <div><strong>Platform:</strong> <span style={{ color: "white" }}>{gp.platform}</span></div>
                            <div><strong>Rank:</strong> <span style={{ color: "white" }}>{gp.rank}</span></div>
                        </div>
                    </div>
                ))}
                {user.gameProfiles.length === 0 && (
                    <p style={{ color: "var(--border)", fontStyle: "italic" }}>No game profiles added yet.</p>
                )}
            </div>
        </div>
    );
}
