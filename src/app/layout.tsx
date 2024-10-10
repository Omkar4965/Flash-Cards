import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from '@/app/context/UserContext';
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
      <body>
      <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
