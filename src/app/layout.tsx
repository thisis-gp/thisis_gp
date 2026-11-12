import type { Metadata, Viewport } from "next";
import { Radio_Canada, Radio_Canada_Big } from "next/font/google";
import { GSC_TOKEN, NAME, SITE_URL, TAGLINE, abs } from "@/lib/site";
import "./globals.css";

const display = Radio_Canada_Big({ subsets: ["latin"], variable: "--face-display", display: "swap" });
const body = Radio_Canada({ subsets: ["latin"], variable: "--face-body", display: "swap" });

const TITLE = `${NAME} | Software Engineer in Bangalore`;

export const viewport: Viewport = { themeColor: "#2040c0", width: "device-width", initialScale: 1 };

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: `%s | ${NAME}` },
  description: TAGLINE,
  applicationName: NAME,
  keywords: [NAME, "Gurupriyan", "software engineer Bangalore", "AI engineer", "MCP server", "RAG", "Android on-device AI", "ctxd", "Kanoon", "NILA", "slimpdf", "Nova Benefits"],
  authors: [{ name: NAME, url: SITE_URL }],
  creator: NAME,
  publisher: NAME,
  category: "technology",
  alternates: { canonical: "./", types: { "application/rss+xml": "/feed.xml" } },
  openGraph: { type: "website", locale: "en_IN", url: "./", siteName: NAME, title: TITLE, description: TAGLINE, images: [{ url: abs("/social.png"), width: 1200, height: 630, alt: `${NAME}: Find the problem. Then fix it.` }] },
  twitter: { card: "summary_large_image", creator: "@this_isGP", title: TITLE, description: TAGLINE, images: [abs("/social.png")] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  other: { "llms-txt": "/llms.txt" },
  ...(GSC_TOKEN ? { verification: { google: GSC_TOKEN } } : {}),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <head>
        <link rel="me" href="https://www.linkedin.com/in/thisis-gp/" />
        <link rel="me" href="https://github.com/thisis-gp" />
      </head>
      <body>{children}</body>
    </html>
  );
}
