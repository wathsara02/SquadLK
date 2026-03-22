export default function Home() {
    return (
        <main style={{ padding: "4rem 2rem", textAlign: "center", minHeight: "100vh" }}>
            <h1 style={{ color: "var(--primary)", fontSize: "3.5rem", marginBottom: "1rem", fontWeight: "bold" }}>
                Squad Finder LK
            </h1>
            <p style={{ fontSize: "1.25rem", color: "var(--foreground)", maxWidth: "600px", margin: "0 auto 2rem auto" }}>
                Find other players by game, rank, and play style in Sri Lanka.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                <a href="/discover" style={{ padding: "0.75rem 1.5rem", backgroundColor: "var(--primary)", borderRadius: "6px", fontWeight: "600" }}>
                    Discover Players
                </a>
                <a href="/auth/signup" style={{ padding: "0.75rem 1.5rem", border: "1px solid var(--border)", borderRadius: "6px", fontWeight: "600" }}>
                    Create Profile
                </a>
            </div>
        </main>
    );
}
