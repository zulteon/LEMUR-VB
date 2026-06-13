import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lemur VB",
  description: "Tippfogadási gondolatok, jegyzetek és meccselemzések."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu">
      <body>{children}</body>
    </html>
  );
}
