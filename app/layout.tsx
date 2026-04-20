import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "THE BOARD — кастомні шахові дашки",
  description:
    "Ручна робота. Лімітовані серії. Стріт-стиль на вашому столі. Оплата онлайн, доставка Новою поштою.",
  openGraph: {
    title: "THE BOARD",
    description: "Кастомні шахові дашки. Лімітований дроп.",
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
      </body>
    </html>
  );
}
