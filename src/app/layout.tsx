import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

export const meta: Metadata = {
  title: "My Next.js Site",
  description: "My Next.js site description",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        >
        {children}
      </body>
    </html>
  );
}
