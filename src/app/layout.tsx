import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { CustomCursor } from "@/components/ui/custom-cursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SceneFlow - Turn Scene Ideas into Cinematic Shotlists",
  description: "AI-powered tool that turns scene ideas into cinematic shotlists and moodboards for creators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${inter.variable} antialiased`}
      >
        {children}
        <Toaster />
        <CustomCursor />
      </body>
    </html>
  );
}
