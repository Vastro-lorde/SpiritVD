export const dynamic = "force-dynamic";

import { connectDB } from "@/lib/db/connection";
import { SiteConfig } from "@/lib/models";
import SiteConfigManager from "@/components/admin/SiteConfigManager";

async function getSiteConfig() {
  await connectDB();
  let config = await SiteConfig.findOne().lean();
  if (!config) {
    const created = await SiteConfig.create({});
    config = created.toObject();
  }
  return JSON.parse(JSON.stringify(config));
}

export default async function SiteSettingsPage() {
  const config = await getSiteConfig();

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="text-2xl font-bold text-primary dark:text-white">
        Site Settings
      </h1>
      <p className="mt-1 text-sm text-muted">
        Configure your site name, SEO metadata, favicon, and contact info.
      </p>
      <SiteConfigManager initialConfig={config} />
    </div>
  );
}
