import type { Metadata } from "next";
import "./globals.css";

// Inter is referenced in globals.css via --font-sans.
// In production, load Inter from Google Fonts via <link> or next/font/google
// when network access is available. The CSS custom property falls back to
// system sans-serif fonts gracefully.

export const metadata: Metadata = {
  title: "StagParty.io — Plan Epic Bachelor Parties",
  description:
    "AI-powered bachelor party planning. Create, invite the crew, vote on destinations, and build the perfect itinerary — all in one place.",
  keywords: [
    "bachelor party",
    "stag party",
    "party planning",
    "best man",
    "groomsmen",
    "group trip planner",
  ],
  openGraph: {
    title: "StagParty.io — Plan Epic Bachelor Parties",
    description:
      "AI-powered bachelor party planning. Create, invite the crew, vote on destinations, and build the perfect itinerary.",
    type: "website",
    siteName: "StagParty.io",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-navy-950 text-text-primary font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
