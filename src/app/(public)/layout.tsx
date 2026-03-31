import { Suspense } from "react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import NavigationProgress from "@/components/shared/NavigationProgress";
import { connectDB } from "@/lib/db/connection";
import { SiteConfig, SocialLink } from "@/lib/models";

async function getLayoutData() {
  try {
    await connectDB();
    const [config, socialLinks] = await Promise.all([
      SiteConfig.findOne().lean(),
      SocialLink.find().select("platform url").lean(),
    ]);
    return {
      siteName: config?.siteName ?? "SD",
      ownerName: config?.ownerName ?? "",
      socialLinks: JSON.parse(JSON.stringify(socialLinks ?? [])) as {
        platform: string;
        url: string;
      }[],
    };
  } catch {
    return { siteName: "SD", ownerName: "", socialLinks: [] };
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { siteName, ownerName, socialLinks } = await getLayoutData();

  return (
    <div className="flex min-h-screen flex-col bg-white text-primary dark:bg-surface-dark dark:text-white">
      <Suspense fallback={null}>
        <NavigationProgress />
      </Suspense>
      <Navbar siteName={siteName} />
      <main className="flex-1">{children}</main>
      <Footer ownerName={ownerName} socialLinks={socialLinks} />
    </div>
  );
}
