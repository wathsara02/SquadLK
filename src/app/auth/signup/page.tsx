"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function SignupPage() {
    const router = useRouter();
    const [form, setForm] = useState({ displayName: "", username: "", email: "", password: "" });
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            if (!res.ok) {
                throw new Error(await res.text() || "Failed to sign up");
            }

            router.push("/auth/login?registered=true");
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "4rem auto", padding: "2rem", background: "var(--surface)", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem", color: "var(--primary)", textAlign: "center" }}>Create Account</h1>
            {error && <div style={{ color: "var(--danger)", marginBottom: "1rem", textAlign: "center" }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <Input label="Display Name" required value={form.displayName} onChange={e => setForm({ ...form, displayName: e.target.value })} />
                <Input label="Username" required value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
                <Input label="Email" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                <Input label="Password" type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <Button type="submit" style={{ width: "100%", marginTop: "1rem" }}>Sign Up</Button>
            </form>
        </div>
    );
}
