"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil, Plus, Trash2, Upload } from "lucide-react";
import { updateSocialLinks, updateResume } from "@/lib/actions/profile.actions";
import { deleteExperience } from "@/lib/actions/experience.actions";
import { SocialPlatform } from "@/enums";
import AddExperienceModal from "./AddExperienceModal";

interface UserData {
  _id: string;
  name: string;
  email: string;
  bio: string;
  title: string;
  profileImage: string;
  resumeUrl: string;
}

interface SocialLinkData {
  _id: string;
  platform: SocialPlatform;
  url: string;
}

interface ExperienceData {
  _id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  currentlyWorking: boolean;
}

const platformLabels: Record<string, string> = {
  github: "Git hub",
  linkedin: "LinkedIn",
  youtube: "Youtube",
  twitter: "Twitter",
};

export default function ProfileManager({
  initialUser,
  initialSocialLinks,
  initialExperiences,
}: {
  initialUser: UserData | null;
  initialSocialLinks: SocialLinkData[];
  initialExperiences: ExperienceData[];
}) {
  const [socialLinks, setSocialLinks] = useState(
    Object.values(SocialPlatform).map((platform) => {
      const existing = initialSocialLinks.find(
        (l) => l.platform === platform
      );
      return { platform, url: existing?.url ?? "" };
    })
  );
  const [experiences, setExperiences] = useState(initialExperiences);
  const [showAddExp, setShowAddExp] = useState(false);
  const [saving, setSaving] = useState(false);

  function formatDate(date: string | null) {
    if (!date) return "Present";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  }

  async function handleSaveSocials() {
    setSaving(true);
    await updateSocialLinks(
      socialLinks.filter((l) => l.url.trim() !== "")
    );
    setSaving(false);
  }

  async function handleDeleteExperience(id: string) {
    if (!confirm("Delete this experience?")) return;
    await deleteExperience(id);
    setExperiences((prev) => prev.filter((e) => e._id !== id));
  }

  async function handleResumeUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "resume");

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const json = await res.json();
    if (json.success) {
      await updateResume(json.data.url);
    }
  }

  return (
    <>
      {/* Profile header */}
      <div className="flex items-center gap-4 rounded-xl border border-border bg-white p-4 dark:border-border-dark dark:bg-surface-dark">
        <div className="relative h-14 w-14 overflow-hidden rounded-full bg-primary/10">
          {initialUser?.profileImage ? (
            <Image
              src={initialUser.profileImage}
              alt={initialUser.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg font-bold text-primary">
              SD
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-primary dark:text-white">
            {initialUser?.name ?? "Admin User"}
          </h3>
          <p className="text-xs text-muted">{initialUser?.email}</p>
        </div>
        <button className="text-muted hover:text-primary">
          <Pencil className="h-4 w-4" />
        </button>
      </div>

      {/* Social Links */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-primary dark:text-white">
          Social Links
        </h2>
        <div className="mt-4 space-y-4">
          {socialLinks
            .filter((l) => platformLabels[l.platform])
            .map((link, i) => (
              <div key={link.platform}>
                <label className="text-sm font-medium text-primary dark:text-white">
                  {platformLabels[link.platform]}
                </label>
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => {
                    const updated = [...socialLinks];
                    updated[i] = { ...link, url: e.target.value };
                    setSocialLinks(updated);
                  }}
                  placeholder={`https://${link.platform}.com/...`}
                  className="mt-1 w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:text-white"
                />
              </div>
            ))}
          <button
            onClick={handleSaveSocials}
            disabled={saving}
            className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Social Links"}
          </button>
        </div>
      </section>

      {/* Resume */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-primary dark:text-white">
          Resume
        </h2>
        <div className="mt-4 rounded-xl border border-border bg-white p-4 dark:border-border-dark dark:bg-surface-dark">
          {initialUser?.resumeUrl ? (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5">
                <Upload className="h-5 w-5 text-primary dark:text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-primary dark:text-white">
                  Current Resume
                </p>
                <a
                  href={initialUser.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted underline"
                >
                  View Resume
                </a>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted">No resume uploaded</p>
          )}
          <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-primary py-3 text-sm font-medium text-primary dark:text-white">
            <Upload className="h-4 w-4" />
            Upload New Resume
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeUpload}
              className="hidden"
            />
          </label>
        </div>
      </section>

      {/* Experience */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary dark:text-white">
            Experience
          </h2>
          <button
            onClick={() => setShowAddExp(true)}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
          >
            <Plus className="h-4 w-4" />
            Add New
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {experiences.map((exp) => (
            <div
              key={exp._id}
              className="flex items-center justify-between rounded-lg border border-border bg-white px-4 py-3 dark:border-border-dark dark:bg-surface-dark"
            >
              <div>
                <p className="text-sm font-medium text-primary dark:text-white">
                  {exp.position}
                </p>
                <p className="text-xs text-muted">
                  {exp.company} &bull; {formatDate(exp.startDate)} -{" "}
                  {formatDate(exp.endDate)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-muted hover:text-primary">
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteExperience(exp._id)}
                  className="text-red-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Logout */}
      <div className="mt-12 text-center">
        <button
          onClick={() => {
            window.location.href = "/api/auth/signout";
          }}
          className="text-sm font-medium text-red-500"
        >
          Logout
        </button>
      </div>

      {showAddExp && (
        <AddExperienceModal onClose={() => setShowAddExp(false)} />
      )}
    </>
  );
}
