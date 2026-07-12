import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.umeafcnhub.online'),
  title: "UMEAFCN Hub",
  description: "Job Listings, Internships, Scholarships, Graduate Trainee Programs and career Updates",
  openGraph: {
    title: "UMEAFCN Hub",
    description: "Job Listings, Internships, Scholarships, Graduate Trainee Programs and career Updates",
    url: 'https://www.umeafcnhub.online',
    siteName: 'UMEAFCN Hub',
    images: [
      {
        url: '/logo-light.jpg',
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "UMEAFCN Hub",
    description: "Job Listings, Internships, Scholarships, Graduate Trainee Programs and career Updates",
    images: ['/logo-light.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-W24RT7GRQJ"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-W24RT7GRQJ');
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <Header />

        <main className="container">
          {children}
        </main>

        <Footer />
        <ThemeToggle />
      </body>
    </html>
  );
}
