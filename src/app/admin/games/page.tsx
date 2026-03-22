import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";

export default async function AdminGamesPage() {
    const games = await prisma.game.findMany({
        include: { rankDefinition: { include: { options: true } } }
    });

    return (
        <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h1 style={{ fontSize: "2rem", color: "var(--primary)", fontWeight: "bold" }}>Manage Games & Ranks</h1>
                <a href="/admin/games/new" style={{ padding: "0.75rem 1.5rem", background: "var(--primary)", color: "white", borderRadius: "6px", fontWeight: "600" }}>Add New Game</a>
            </div>

            <div style={{ display: "grid", gap: "1.5rem" }}>
                {games.map((game: any) => (
                    <div key={game.id} style={{ background: "var(--surface)", padding: "1.5rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
                        <h2 style={{ fontSize: "1.5rem", marginBottom: "0.25rem", color: "white" }}>{game.name}</h2>
                        <div style={{ fontSize: "0.9rem", color: "var(--border)", marginBottom: "1rem" }}>
                            Category: {game.category || "General"} | Rank Type: {game.rankDefinition?.isFreeText ? "Free Text" : "Predefined List"}
                        </div>

                        {game.rankDefinition?.options && game.rankDefinition.options.length > 0 && (
                            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                                {game.rankDefinition.options.map((opt: any) => (
                                    <span key={opt.id} style={{ background: "var(--primary)", color: "white", padding: "0.25rem 0.5rem", borderRadius: "4px", fontSize: "0.85rem" }}>
                                        {opt.label}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
                            <Button size="sm" variant="secondary">Edit Game Settings</Button>
                            <Button size="sm" variant="secondary">Manage Rank Structure</Button>
                        </div>
                    </div>
                ))}

                {games.length === 0 && (
                    <div style={{ padding: "3rem", textAlign: "center", background: "var(--surface)", borderRadius: "8px", border: "1px dashed var(--border)" }}>
                        <p style={{ color: "var(--foreground)", fontSize: "1.1rem" }}>No games configured yet. Add your first game!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
