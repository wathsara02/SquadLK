"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function NewGamePage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: "", slug: "", category: "", isFreeText: false });
    const [options, setOptions] = useState([{ label: "", tier: "", sortPriority: 10 }]);
    const [error, setError] = useState("");

    const handleOptionChange = (idx: number, field: string, value: any) => {
        const newOpts = [...options];
        newOpts[idx] = { ...newOpts[idx], [field]: value };
        setOptions(newOpts);
    };

    const addOption = () => setOptions([...options, { label: "", tier: "", sortPriority: (options.length + 1) * 10 }]);
    const removeOption = (idx: number) => setOptions(options.filter((_, i) => i !== idx));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const payload = {
                ...form,
                options: form.isFreeText ? [] : options.map(o => ({ ...o, sortPriority: Number(o.sortPriority) }))
            };

            const res = await fetch("/api/admin/games", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Failed to create game");
            router.push("/admin/games");
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div style={{ maxWidth: "800px", margin: "4rem auto", padding: "2rem", background: "var(--surface)", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem", color: "var(--primary)" }}>Create New Game</h1>
            {error && <div style={{ color: "var(--danger)", marginBottom: "1rem" }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ display: "flex", gap: "1rem" }}>
                    <div style={{ flex: 1 }}><Input label="Game Name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                    <div style={{ flex: 1 }}><Input label="Slug (unique-id, lowercase)" required value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} /></div>
                </div>
                <Input label="Category (e.g. FPS, MOBA)" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <input type="checkbox" id="freeText" checked={form.isFreeText} onChange={e => setForm({ ...form, isFreeText: e.target.checked })} />
                    <label htmlFor="freeText">Users enter ranks as free text instead of selecting from a list</label>
                </div>

                {!form.isFreeText && (
                    <div style={{ border: "1px solid var(--border)", padding: "1.5rem", borderRadius: "8px", background: "var(--background)" }}>
                        <h3 style={{ marginBottom: "0.5rem" }}>Rank Options List</h3>
                        <p style={{ fontSize: "0.9rem", color: "var(--foreground)", opacity: 0.7, marginBottom: "1.5rem" }}>Add structured ranks users can pick from (e.g. Bronze 1, Gold).</p>

                        {options.map((opt, idx) => (
                            <div key={idx} style={{ display: "flex", gap: "1rem", alignItems: "flex-end", marginBottom: "1rem" }}>
                                <div style={{ flex: 2 }}><Input label="Label" required value={opt.label} onChange={e => handleOptionChange(idx, "label", e.target.value)} /></div>
                                <div style={{ flex: 1 }}><Input label="Tier Group" value={opt.tier} onChange={e => handleOptionChange(idx, "tier", e.target.value)} /></div>
                                <div style={{ flex: 1 }}><Input label="Sort Value" type="number" required value={opt.sortPriority} onChange={e => handleOptionChange(idx, "sortPriority", e.target.value)} /></div>
                                <Button type="button" variant="danger" style={{ marginBottom: "1rem", padding: "0.75rem" }} onClick={() => removeOption(idx)}>X</Button>
                            </div>
                        ))}
                        <Button type="button" variant="secondary" onClick={addOption}>+ Add Rank Option</Button>
                    </div>
                )}

                <Button type="submit" style={{ marginTop: "1rem" }}>Create Game Configuration</Button>
            </form>
        </div>
    );
}
