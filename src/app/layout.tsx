import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";
import "./above-1920.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? site.url;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — Exhibition Stall Design & Fabrication`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — Exhibition Stall Design & Fabrication`,
    description: site.description,
    url: "/",
    locale: "en",
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#04051a",
  colorScheme: "light dark",
};

/**
 * Runs before first paint: enables "hidden until revealed" styles only when
 * JS runs and the visitor allows motion. If the animation bundle hasn't
 * started after 5s (slow network, script error) the content is shown anyway.
 */
/**
 * Runs before first paint: applies the saved theme, or the OS preference when
 * the visitor hasn't chosen one (and follows OS changes until they do).
 */
const themeScript = `(function(d){var k="theme",m=matchMedia("(prefers-color-scheme: dark)");function s(){var t;try{t=localStorage.getItem(k)}catch(e){}return t==="dark"||t==="light"?t:null}d.dataset.theme=s()||(m.matches?"dark":"light");m.addEventListener("change",function(e){if(!s())d.dataset.theme=e.matches?"dark":"light"})})(document.documentElement)`;

const motionScript = `(function(d){try{if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;d.classList.add("js-motion");setTimeout(function(){if(!d.classList.contains("motion-ready"))d.classList.remove("js-motion")},5000)}catch(e){}})(document.documentElement)`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${instrument.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
