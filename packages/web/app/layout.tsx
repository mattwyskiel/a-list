import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The A-List Setlist",
  description: "Mixes by DJ A-List",
  openGraph: {
    type: "music.playlist",
    creators: ["DJ A-List"],
    title: "The A-List Setlist",
    description: "Mixes by DJ A-List",
    url: "https://a-list.mattwyskiel.com",
    siteName: "The A-List Setlist",
    images: [
      {
        url: "https://assets.mattwyskiel.com/a-list/podcast-image.jpeg",
        width: 1024,
        height: 1024,
        alt: "The A-List Setlist - podcast cover image",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
