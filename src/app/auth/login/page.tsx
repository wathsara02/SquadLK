"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError("Invalid email or password");
        } else {
            router.push("/discover");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "4rem auto", padding: "2rem", background: "var(--surface)", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem", color: "var(--primary)", textAlign: "center" }}>Welcome Back</h1>
            {error && <div style={{ color: "var(--danger)", marginBottom: "1rem", textAlign: "center" }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button type="submit" style={{ width: "100%", marginTop: "1rem" }}>Login</Button>
            </form>
            <div style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.9rem" }}>
                Don't have an account? <a href="/auth/signup" style={{ color: "var(--primary)" }}>Sign up</a>
            </div>
        </div>
    );
}
