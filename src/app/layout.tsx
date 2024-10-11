import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from '@/app/context/UserContext';

// Use `metadata` instead of `meta`
export const metadata: Metadata = {
  title: "Flashcards",
  description: "App for revision purposes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
