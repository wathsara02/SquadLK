import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

export const metadata = {
    title: "Squad Finder LK",
    description: "Find your perfect gaming squad in Sri Lanka.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                <Providers>
                    <Navbar />
                    <main style={{ flex: 1 }}>{children}</main>
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
