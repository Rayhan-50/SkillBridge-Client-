import type { Metadata } from "next";
import { Outfit, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/Providers";
import { FloatingAIWidget } from "@/components/ai/FloatingAIWidget";

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SkillBridge | Connect with Expert Tutors",
  description: "Learn anything from expert tutors. Book a session today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${outfit.variable} ${jetbrainsMono.variable} font-body antialiased`} suppressHydrationWarning>
        <Providers>
          {children}
          <FloatingAIWidget />
        </Providers>
      </body>
    </html>
  );
}

