import "./globals.css";
import { Providers } from "@/store/provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SohCahToa-Holdings",
  description: "Financial transaction management platform",
  icons: {
    icon: "/favicon.jpeg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.jpeg" type="image/jpeg" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}