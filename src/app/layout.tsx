import type { Metadata, Viewport } from "next";
import { Mukta } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const mukta = Mukta({
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-mukta",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Public Service Hub Nepal", template: "%s · Public Service Hub Nepal" },
  description:
    "Step-by-step guides to Nepal government services in English and Nepali: passports, national ID, driving licence, police report, documents, fees and official portals.",
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

// Applies saved accessibility preferences and the page language before first paint.
const bootScript = `(function(){var r=document.documentElement;try{var p=JSON.parse(localStorage.getItem('psh-a11y')||'{}');if(p.text==='2'||p.text==='3')r.setAttribute('data-text',p.text);if(p.contrast===true)r.setAttribute('data-contrast','high');}catch(e){}var m=location.pathname.match(/^\\/(en|ne)(\\/|$)/);if(m)r.lang=m[1];})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={mukta.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
