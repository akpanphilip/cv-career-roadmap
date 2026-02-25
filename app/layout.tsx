import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

export const metadata: Metadata = {
  title: "SkillBridge | AI-Powered Career Guidance",
  description:
    "Upload your CV and get personalized career recommendations, skill gap analysis, and learning roadmaps powered by AI.",
  keywords:
    "career roadmap, CV analysis, skill gap, job recommendations, AI career coach",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
