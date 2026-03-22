"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function GameProfilePage() {
    const router = useRouter();
    const [games, setGames] = useState<any[]>([]);
    const [selectedGameId, setSelectedGameId] = useState("");
    const [form, setForm] = useState({ inGameName: "", platform: "PC", rank: "", lookingForTeam: false });
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("/api/games")
            .then(res => res.json())
            .then(data => setGames(data))
            .catch(console.error);
    }, []);

    const selectedGame = games.find(g => g.id === selectedGameId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedGameId) return setError("Please select a game first");
        if (!form.rank) return setError("Please specify your rank");

        setError("");
        try {
            const res = await fetch("/api/profile/games", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ gameId: selectedGameId, ...form })
            });
            if (!res.ok) throw new Error("Failed to save game profile");
            router.push("/profile/me");
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "4rem auto", padding: "2rem", background: "var(--surface)", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem", color: "var(--primary)" }}>Add Game Profile</h1>
            {error && <div style={{ color: "var(--danger)", marginBottom: "1rem" }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                <div>
                    <label style={{ display: "block", marginBottom: "0.5rem" }}>Select Game</label>
                    <select
                        value={selectedGameId}
                        onChange={e => {
                            setSelectedGameId(e.target.value);
                            setForm(prev => ({ ...prev, rank: "" })); // reset rank when game changes
                        }}
                        style={{ width: "100%", padding: "0.75rem", background: "var(--background)", color: "white", border: "1px solid var(--border)", borderRadius: "6px" }}
                    >
                        <option value="">-- Choose a Game --</option>
                        {games.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                </div>

                {selectedGame && (
                    <>
                        <Input label="In-Game Name / Gamer Tag" required value={form.inGameName} onChange={e => setForm({ ...form, inGameName: e.target.value })} />

                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem" }}>Platform</label>
                            <select
                                value={form.platform}
                                onChange={e => setForm({ ...form, platform: e.target.value })}
                                style={{ width: "100%", padding: "0.75rem", background: "var(--background)", color: "white", border: "1px solid var(--border)", borderRadius: "6px" }}
                            >
                                {["PC", "PLAYSTATION", "XBOX", "MOBILE", "SWITCH"].map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>

                        {selectedGame.rankDefinition?.isFreeText ? (
                            <Input label="Your Rank" value={form.rank} onChange={e => setForm({ ...form, rank: e.target.value })} placeholder="E.g. Top 500, Level 99" required />
                        ) : (
                            <div>
                                <label style={{ display: "block", marginBottom: "0.5rem" }}>Your Rank</label>
                                <select
                                    value={form.rank}
                                    required
                                    onChange={e => setForm({ ...form, rank: e.target.value })}
                                    style={{ width: "100%", padding: "0.75rem", background: "var(--background)", color: "white", border: "1px solid var(--border)", borderRadius: "6px" }}
                                >
                                    <option value="">-- Select Rank --</option>
                                    {selectedGame.rankDefinition?.options?.sort((a: any, b: any) => a.sortPriority - b.sortPriority).map((opt: any) => (
                                        <option key={opt.id} value={opt.label}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "0.5rem" }}>
                            <input type="checkbox" id="lft" checked={form.lookingForTeam} onChange={e => setForm({ ...form, lookingForTeam: e.target.checked })} />
                            <label htmlFor="lft">Currently looking for teammates for this game</label>
                        </div>

                        <Button type="submit" style={{ marginTop: "1rem" }}>Save Game Profile</Button>
                    </>
                )}
            </form>
        </div>
    );
}
