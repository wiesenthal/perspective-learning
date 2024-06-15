import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PageNavigatorProvider } from "./hooks/pageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Perspective Learning",
  description: "Learn a story, memories, to learn this character",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex flex-col items-center justify-center h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
