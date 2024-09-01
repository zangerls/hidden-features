import GameProvider from "@/hooks/GameContext";
import { ThemeProvider } from "@/providers/ThemeProvider";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

export const metadata: Metadata = {
  title: "Hidden Features",
  description: "Test your music knowledge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <GameProvider>{children}</GameProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
