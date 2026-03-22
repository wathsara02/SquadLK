import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "ghost";
    size?: "sm" | "md" | "lg";
}

export function Button({ variant = "primary", size = "md", style, children, ...props }: ButtonProps) {
    const baseStyle = {
        padding: size === "sm" ? "0.5rem 1rem" : size === "md" ? "0.75rem 1.5rem" : "1rem 2rem",
        borderRadius: "6px",
        fontWeight: "600",
        cursor: "pointer",
        border: "none",
        ...style
    };

    const variantStyle = {
        primary: { background: "var(--primary)", color: "white" },
        secondary: { background: "var(--surface-hover)", color: "var(--foreground)", border: "1px solid var(--border)" },
        danger: { background: "var(--danger)", color: "white" },
        ghost: { background: "transparent", color: "var(--foreground)" }
    }[variant];

    return (
        <button style={{ ...baseStyle, ...variantStyle }} {...props}>
            {children}
        </button>
    );
}
