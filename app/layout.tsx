import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { ToasterProvider } from "@/components/Toaster";
import { THEME_INIT_SCRIPT } from "@/lib/theme";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "FlirtyAI — Your AI Wingperson",
  description:
    "Upload a chat screenshot, pick a vibe, and get reply options that actually land.",
  applicationName: "FlirtyAI",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FlirtyAI",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0c0c12" },
    { media: "(prefers-color-scheme: light)", color: "#faf8fc" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${serif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="font-sans antialiased relative">
        <ToasterProvider>{children}</ToasterProvider>
      </body>
    </html>
  );
}
