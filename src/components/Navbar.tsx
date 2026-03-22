"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav style={{ padding: "1rem 2rem", background: "var(--surface)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Link href="/" style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--primary)", textDecoration: "none" }}>
                Squad Finder LK
            </Link>
            <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                <Link href="/discover" style={{ textDecoration: "none", color: "var(--foreground)" }}>Discover</Link>
                {session ? (
                    <>
                        <Link href="/profile/me" style={{ textDecoration: "none", color: "var(--foreground)" }}>My Profile</Link>
                        {(session.user as any).role === "ADMIN" || (session.user as any).role === "SUPER_ADMIN" ? (
                            <Link href="/admin/games" style={{ textDecoration: "none", color: "var(--foreground)" }}>Admin</Link>
                        ) : null}
                    </>
                ) : (
                    <>
                        <Link href="/auth/login" style={{ textDecoration: "none", color: "var(--foreground)" }}>Login</Link>
                        <Link href="/auth/signup" style={{ background: "var(--primary)", color: "white", padding: "0.5rem 1rem", borderRadius: "4px", textDecoration: "none" }}>Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
