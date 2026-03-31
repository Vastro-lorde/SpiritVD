import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { ToastProvider } from "@/components/shared/Toast";
import { connectDB } from "@/lib/db/connection";
import { SiteConfig } from "@/lib/models";

const inter = Inter({ subsets: ["latin"] });

async function getSiteConfig() {
  try {
    await connectDB();
    const config = await SiteConfig.findOne().lean();
    return config;
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();

  const icons: Metadata["icons"] = config?.faviconUrl
    ? { icon: config.faviconUrl }
    : undefined;

  return {
    title: config?.siteTitle || "Portfolio",
    description: config?.siteDescription || "",
    icons,
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
