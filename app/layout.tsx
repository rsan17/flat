import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Roboto_Condensed, Onest, Caveat } from "next/font/google";
import "./globals.css";

// Тимчасова заміна Grind із брендбуку: важкий вузький гротеск із кирилицею.
const robotoCondensed = Roboto_Condensed({
  subsets: ["cyrillic", "latin"],
  weight: ["700", "900"],
  variable: "--font-roboto-condensed",
  display: "swap",
});

const onest = Onest({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-onest",
  display: "swap",
});

// Заміна Figma Hand — рукописні акценти.
const caveat = Caveat({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "700"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.flat-shop.com"),
  title: {
    default: "FLAT5 — місце своїх · Львів, площа Ринок 39",
    template: "%s · FLAT5",
  },
  description:
    "FLAT5 — кав'ярня і простір своїх у центрі Львова, навпроти ратуші. Кухня, шаховий клуб, квартирники, дворик. І мерч, який можна забрати з собою.",
  openGraph: {
    title: "FLAT5 — місце своїх",
    description:
      "Львів, площа Ринок 39. Кухня, шаховий клуб, квартирники, дворик — і мерч FLAT5.",
    type: "website",
    locale: "uk_UA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uk"
      className={`${robotoCondensed.variable} ${onest.variable} ${caveat.variable}`}
    >
      <body>
        {children}
        <div className="grain-fixed" aria-hidden="true" />
        <Analytics />
      </body>
    </html>
  );
}
