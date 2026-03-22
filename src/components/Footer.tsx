export default function Footer() {
    return (
        <footer style={{ padding: "2rem", textAlign: "center", borderTop: "1px solid var(--border)", marginTop: "4rem", color: "var(--border)" }}>
            <p>&copy; {new Date().getFullYear()} Squad Finder LK. All rights reserved.</p>
        </footer>
    );
}
