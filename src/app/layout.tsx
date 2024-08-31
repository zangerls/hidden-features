import type { Metadata } from "next";
import { Poppins} from "next/font/google";
import "./globals.css";

const poppins = Poppins({weight: ["400", "600", "700"], });

export const metadata: Metadata = {
  title: "Title",
  description: "Description",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
