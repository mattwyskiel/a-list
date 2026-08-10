import { GoogleAnalytics } from "@next/third-parties/google";
import { PersonalSiteFooter } from "@whiskey/web-ui/components/site/personal-site-footer";
import { PersonalSiteHeader } from "@whiskey/web-ui/components/site/personal-site-header";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { ModeToggle } from "@/components/ModeToggle";
import { ThemeProvider } from "@/components/theme-provider";

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
        url: "https://assets.mattwyskiel.com/a-list/podcast-image-2.jpeg",
        width: 1024,
        height: 1024,
        alt: "The A-List Setlist - podcast cover image",
      },
    ],
  },
};

async function getCurrentYear() {
  "use cache";
  cacheLife("max");
  return new Date().getFullYear();
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentYear = await getCurrentYear();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          scriptProps={{ type: "text/plain" }}
        >
          <div className="flex min-h-screen flex-col">
            <PersonalSiteHeader
              brandHref="https://mattwyskiel.com"
              linkComponent={Link}
              navItems={[
                { href: "https://mattwyskiel.com/stories", label: "Stories" },
                { href: "/", label: "Music" },
              ]}
              themeControl={<ModeToggle />}
            />
            <main className="flex-1">{children}</main>
            <PersonalSiteFooter
              currentYear={currentYear}
              linkComponent={Link}
            />
          </div>
        </ThemeProvider>
        <GoogleAnalytics gaId="G-T6FX4D86NV" />
      </body>
    </html>
  );
}
