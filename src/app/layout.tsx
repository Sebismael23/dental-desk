import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DentDesk AI | Never Miss Another Patient Call",
  description: "Your AI receptionist answers every call 24/7, books appointments, handles rescheduling, and captures new patient leads—even at 2am on a Sunday.",
  keywords: ["dental AI", "dental receptionist", "AI phone answering", "dental practice automation", "patient scheduling"],
  openGraph: {
    title: "DentDesk AI | Never Miss Another Patient Call",
    description: "Your AI receptionist answers every call 24/7, books appointments, handles rescheduling, and captures new patient leads.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
