import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "@/src/styles/glass.css";
import { TelegramSessionBootstrap } from "@/src/components/telegram-session-bootstrap";

const exo2 = Exo_2({
  variable: "--font-exo2",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Плюс Один Mini App",
  description: "Клуб знакомств через реальные встречи",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${exo2.variable} antialiased`}>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        <TelegramSessionBootstrap />
        {children}
      </body>
    </html>
  );
}
