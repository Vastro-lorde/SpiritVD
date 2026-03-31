"use client";

import { useState } from "react";
import { ISiteConfig } from "@/types";
import { Loader2, Save } from "lucide-react";
import { useToast } from "@/components/shared/Toast";
import ImageUpload from "@/components/admin/ImageUpload";

export default function SiteConfigManager({
  initialConfig,
}: {
  initialConfig: ISiteConfig;
}) {
  const [config, setConfig] = useState(initialConfig);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  function handleChange(field: keyof ISiteConfig, value: string) {
    setConfig((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteName: config.siteName,
          siteTitle: config.siteTitle,
          siteDescription: config.siteDescription,
          faviconUrl: config.faviconUrl,
          ownerName: config.ownerName,
          ownerEmail: config.ownerEmail,
          ownerPhone: config.ownerPhone,
        }),
      });

      if (res.ok) {
        const { data } = await res.json();
        setConfig(data);
        showToast("Settings saved!", "success");
      } else {
        showToast("Failed to save settings", "error");
      }
    } catch {
      showToast("Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-6 space-y-6">
      {/* Branding */}
      <section className="rounded-xl border border-border p-4 dark:border-border-dark">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
          Branding
        </h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-primary dark:text-white">
              Site Name / Logo Text
            </label>
            <input
              type="text"
              value={config.siteName}
              onChange={(e) => handleChange("siteName", e.target.value)}
              placeholder="e.g. SD"
              className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark dark:text-white"
            />
            <p className="mt-1 text-xs text-muted">
              Appears as the logo text in the navbar
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-primary dark:text-white">
              Favicon
            </label>
            <ImageUpload
              value={config.faviconUrl}
              onChange={(url) => handleChange("faviconUrl", url)}
              folder="favicon"
              label="Upload Favicon"
              recommendedSize="32 x 32 px"
            />
            <p className="mt-1 text-xs text-muted">
              Recommended: 32×32 or 64×64 PNG/ICO
            </p>
          </div>
        </div>
      </section>

      {/* SEO */}
      <section className="rounded-xl border border-border p-4 dark:border-border-dark">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
          SEO Metadata
        </h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-primary dark:text-white">
              Page Title
            </label>
            <input
              type="text"
              value={config.siteTitle}
              onChange={(e) => handleChange("siteTitle", e.target.value)}
              placeholder="e.g. John Doe | Software Engineer"
              className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark dark:text-white"
            />
            <p className="mt-1 text-xs text-muted">
              The browser tab title and search engine display title
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-primary dark:text-white">
              Meta Description
            </label>
            <textarea
              value={config.siteDescription}
              onChange={(e) => handleChange("siteDescription", e.target.value)}
              placeholder="A short description of your portfolio..."
              rows={3}
              className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark dark:text-white"
            />
          </div>
        </div>
      </section>

      {/* Owner Identity */}
      <section className="rounded-xl border border-border p-4 dark:border-border-dark">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
          Owner / Contact Info
        </h2>
        <p className="mt-1 text-xs text-muted">
          Used in the footer copyright, contact page, and email sender name
        </p>
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-primary dark:text-white">
              Full Name
            </label>
            <input
              type="text"
              value={config.ownerName}
              onChange={(e) => handleChange("ownerName", e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-primary dark:text-white">
              Public Email
            </label>
            <input
              type="email"
              value={config.ownerEmail}
              onChange={(e) => handleChange("ownerEmail", e.target.value)}
              placeholder="e.g. hello@example.com"
              className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-primary dark:text-white">
              Phone Number
            </label>
            <input
              type="tel"
              value={config.ownerPhone}
              onChange={(e) => handleChange("ownerPhone", e.target.value)}
              placeholder="e.g. +1 234 567 8900"
              className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark dark:text-white"
            />
          </div>
        </div>
      </section>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-medium text-white transition-colors hover:bg-primary-light disabled:opacity-60"
      >
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
}
