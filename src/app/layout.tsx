import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jobs With Clinton",
  description: "Automated job listings and news",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="glass-header">
          <div className="container">
            <h1><a href="/">Jobs With Clinton</a></h1>
          </div>
        </header>

        <main className="container">
          {children}
        </main>

        <footer>
          <div className="container">
            <p>&copy; {new Date().getFullYear()} Jobs With Clinton</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
