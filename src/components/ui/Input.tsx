import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
            {label && <label style={{ fontWeight: "500", fontSize: "0.9rem" }}>{label}</label>}
            <input
                style={{
                    padding: "0.75rem 1rem",
                    borderRadius: "6px",
                    border: `1px solid ${error ? "var(--danger)" : "var(--border)"}`,
                    background: "var(--surface)",
                    color: "var(--foreground)",
                    outline: "none",
                    ...style
                }}
                {...props}
            />
            {error && <span style={{ color: "var(--danger)", fontSize: "0.8rem" }}>{error}</span>}
        </div>
    );
}
