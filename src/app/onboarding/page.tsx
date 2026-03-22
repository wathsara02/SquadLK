"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

const DISTRICTS = ["COLOMBO", "GAMPAHA", "KALUTARA", "KANDY", "MATALE", "NUWARA_ELIYA", "GALLE", "MATARA", "HAMBANTOTA", "JAFFNA", "KILINOCHCHI", "MANNAR", "VAVUNIYA", "MULLAITIVU", "BATTICALOA", "AMPARA", "TRINCOMALEE", "KURUNEGALA", "PUTTALAM", "ANURADHAPURA", "POLONNARUWA", "BADULLA", "MONARAGALA", "RATNAPURA", "KEGALLE"];
const LANGUAGES = ["ENGLISH", "SINHALA", "TAMIL"];
const PLAY_STYLES = ["CASUAL", "COMPETITIVE", "CHILL", "TRYHARD", "RANKED_PUSH", "BEGINNER_FRIENDLY"];
const PLATFORMS = ["PC", "PLAYSTATION", "XBOX", "MOBILE", "SWITCH"];

export default function OnboardingPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        district: "COLOMBO",
        languages: [] as string[],
        platforms: [] as string[],
        playStyles: [] as string[],
        bio: ""
    });
    const [error, setError] = useState("");

    const toggleArray = (field: "languages" | "platforms" | "playStyles", value: string) => {
        setForm(prev => ({
            ...prev,
            [field]: prev[field].includes(value)
                ? prev[field].filter(v => v !== value)
                : [...prev[field], value]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("/api/onboarding", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            if (!res.ok) throw new Error("Failed to save profile");
            router.push("/discover");
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "4rem auto", padding: "2rem", background: "var(--surface)", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem", color: "var(--primary)" }}>Complete Your Profile</h1>
            {error && <div style={{ color: "var(--danger)", marginBottom: "1rem" }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div>
                    <label style={{ display: "block", marginBottom: "0.5rem" }}>District</label>
                    <select
                        value={form.district}
                        onChange={e => setForm({ ...form, district: e.target.value })}
                        style={{ width: "100%", padding: "0.75rem", background: "var(--background)", color: "white", border: "1px solid var(--border)", borderRadius: "6px" }}
                    >
                        {DISTRICTS.map(d => <option key={d} value={d}>{d.replace("_", " ")}</option>)}
                    </select>
                </div>

                <div>
                    <label style={{ display: "block", marginBottom: "0.5rem" }}>Bio</label>
                    <textarea
                        value={form.bio}
                        onChange={e => setForm({ ...form, bio: e.target.value })}
                        style={{ width: "100%", padding: "0.75rem", background: "var(--background)", color: "white", border: "1px solid var(--border)", borderRadius: "6px", minHeight: "80px", outline: "none" }}
                        placeholder="Tell us about yourself..."
                    />
                </div>

                <div>
                    <label style={{ display: "block", marginBottom: "0.5rem" }}>Languages You Speak</label>
                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                        {LANGUAGES.map(l => (
                            <label key={l} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                                <input type="checkbox" checked={form.languages.includes(l)} onChange={() => toggleArray("languages", l)} /> {l}
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label style={{ display: "block", marginBottom: "0.5rem" }}>Platforms</label>
                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                        {PLATFORMS.map(p => (
                            <label key={p} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                                <input type="checkbox" checked={form.platforms.includes(p)} onChange={() => toggleArray("platforms", p)} /> {p}
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label style={{ display: "block", marginBottom: "0.5rem" }}>Play Styles</label>
                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                        {PLAY_STYLES.map(ps => (
                            <label key={ps} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                                <input type="checkbox" checked={form.playStyles.includes(ps)} onChange={() => toggleArray("playStyles", ps)} /> {ps.replace("_", " ")}
                            </label>
                        ))}
                    </div>
                </div>

                <Button type="submit" style={{ marginTop: "1rem" }}>Save & Continue</Button>
            </form>
        </div>
    );
}
