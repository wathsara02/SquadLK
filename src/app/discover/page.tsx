import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";

export default async function DiscoverPage({
    searchParams,
}: {
    searchParams: { game?: string; district?: string; playStyle?: string };
}) {
    const { game, district, playStyle } = searchParams;

    const whereClause: any = {};
    if (district) whereClause.district = district;
    if (playStyle) whereClause.playStyles = { has: playStyle };
    if (game) {
        whereClause.gameProfiles = {
            some: { gameId: game }
        };
    }

    const users = await prisma.user.findMany({
        where: whereClause,
        take: 50,
        orderBy: { lastActiveAt: 'desc' },
        select: { id: true, displayName: true, district: true, playStyles: true, profilePhoto: true, gameProfiles: { include: { game: true } } }
    });

    const allGames = await prisma.game.findMany({ orderBy: { name: "asc" } });

    return (
        <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
            <h1 style={{ fontSize: "2.5rem", color: "var(--primary)", marginBottom: "2rem", fontWeight: "bold" }}>Discover Players</h1>

            <form style={{ display: "flex", gap: "1rem", marginBottom: "2.5rem", flexWrap: "wrap", background: "var(--surface)", padding: "1rem", borderRadius: "8px" }}>
                <select name="game" defaultValue={game || ""} style={{ padding: "0.75rem", background: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: "6px", flex: 1, minWidth: "150px" }}>
                    <option value="">All Games</option>
                    {allGames.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>

                <select name="district" defaultValue={district || ""} style={{ padding: "0.75rem", background: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: "6px", flex: 1, minWidth: "150px" }}>
                    <option value="">All Districts</option>
                    <option value="COLOMBO">Colombo</option>
                    <option value="GAMPAHA">Gampaha</option>
                    <option value="KANDY">Kandy</option>
                    <option value="GALLE">Galle</option>
                    <option value="MATARA">Matara</option>
                </select>

                <select name="playStyle" defaultValue={playStyle || ""} style={{ padding: "0.75rem", background: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: "6px", flex: 1, minWidth: "150px" }}>
                    <option value="">All Play Styles</option>
                    {["CASUAL", "COMPETITIVE", "CHILL", "TRYHARD", "RANKED_PUSH", "BEGINNER_FRIENDLY"].map(ps => (
                        <option key={ps} value={ps}>{ps.replace("_", " ")}</option>
                    ))}
                </select>

                <Button type="submit" variant="primary">Apply Filters</Button>
            </form>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
                {users.map((u: any) => (
                    <div key={u.id} style={{ background: "var(--surface)", padding: "1.5rem", borderRadius: "8px", border: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
                        <h3 style={{ fontSize: "1.25rem", marginBottom: "0.25rem", color: "white" }}>{u.displayName}</h3>
                        <p style={{ fontSize: "0.9rem", color: "var(--foreground)", opacity: 0.8, marginBottom: "1rem" }}>{u.district || "Sri Lanka"}</p>

                        {u.gameProfiles?.length > 0 && (
                            <div style={{ marginBottom: "1rem" }}>
                                <p style={{ fontSize: "0.8rem", color: "var(--border)", marginBottom: "0.25rem" }}>Plays:</p>
                                <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
                                    {u.gameProfiles.map((gp: any) => (
                                        <span key={gp.game.id} style={{ fontSize: "0.8rem", background: "var(--background)", padding: "0.2rem 0.5rem", borderRadius: "4px", border: "1px solid var(--border)" }}>
                                            {gp.game.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem", flex: 1 }}>
                            {u.playStyles.map((ps: string) => (
                                <span key={ps} style={{ background: "rgba(99, 102, 241, 0.2)", color: "var(--primary)", padding: "0.2rem 0.6rem", borderRadius: "12px", fontSize: "0.75rem" }}>
                                    {ps}
                                </span>
                            ))}
                        </div>

                        <a href={`/profile/${u.id}`} style={{ width: "100%", display: "block", textAlign: "center", padding: "0.5rem", background: "var(--primary)", color: "white", borderRadius: "4px", fontWeight: "600" }}>
                            View Profile
                        </a>
                    </div>
                ))}

                {users.length === 0 && (
                    <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "4rem", background: "var(--surface)", borderRadius: "8px", border: "1px dashed var(--border)" }}>
                        <p style={{ fontSize: "1.1rem" }}>No players found matching these filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
