import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FLAT5 — місце своїх · Львів, площа Ринок 39",
  description:
    "FLAT5 — місце своїх у центрі Львова. Навпроти ратуші, без вивіски. Натискай «5» на домофоні — і заходь.",
  openGraph: {
    title: "FLAT5 — місце своїх",
    description:
      "Львів, площа Ринок 39. Без вивіски — тільки код на домофоні.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body>
        {children}
        <div className="grain-fixed" aria-hidden="true" />
        <Analytics />
      </body>
    </html>
  );
}
