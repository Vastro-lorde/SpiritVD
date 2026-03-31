"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Pencil, Plus, Trash2, Upload } from "lucide-react";
import { updateProfile, updateSocialLinks, updateResume } from "@/lib/actions/profile.actions";
import { deleteExperience } from "@/lib/actions/experience.actions";
import { SocialPlatform } from "@/enums";
import AddExperienceModal from "./AddExperienceModal";
import { signOut } from "next-auth/react";

interface UserData {
  _id: string;
  name: string;
  email: string;
  bio: string;
  title: string;
  profileImage: string;
  resumeUrl: string;
  interests: string[];
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
  autoAddExp,
  autoUploadResume,
}: {
  initialUser: UserData | null;
  initialSocialLinks: SocialLinkData[];
  initialExperiences: ExperienceData[];
  autoAddExp?: boolean;
  autoUploadResume?: boolean;
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
  const [editingExperience, setEditingExperience] = useState<ExperienceData | null>(null);
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(initialUser?.profileImage ?? "");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [name, setName] = useState(initialUser?.name ?? "");
  const [bio, setBio] = useState(initialUser?.bio ?? "");
  const [title, setTitle] = useState(initialUser?.title ?? "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [interests, setInterests] = useState<string[]>(initialUser?.interests ?? []);
  const [newInterest, setNewInterest] = useState("");
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoAddExp) setShowAddExp(true);
  }, [autoAddExp]);

  useEffect(() => {
    if (autoUploadResume) resumeInputRef.current?.click();
  }, [autoUploadResume]);

  function formatDate(date: string | null) {
    if (!date) return "Present";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  }

  async function handleSaveProfile() {
    setSavingProfile(true);
    try {
      const formData = new FormData();
      formData.set("name", name);
      formData.set("bio", bio);
      formData.set("title", title);
      formData.set("profileImage", profileImage);
      formData.set("resumeUrl", initialUser?.resumeUrl ?? "");
      formData.set("interests", interests.join(","));
      await updateProfile(formData);
    } finally {
      setSavingProfile(false);
    }
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

  async function handleProfileImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "profile");
      formData.append("type", "image");

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (json.success) {
        const url = json.data.url as string;
        setProfileImage(url);

        const profileData = new FormData();
        profileData.set("name", name);
        profileData.set("bio", bio);
        profileData.set("title", title);
        profileData.set("profileImage", url);
        profileData.set("resumeUrl", initialUser?.resumeUrl ?? "");
        profileData.set("interests", interests.join(","));
        await updateProfile(profileData);
      }
    } catch (err) {
      console.error("Profile image upload failed:", err);
    } finally {
      setUploadingImage(false);
    }
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
        <button
          type="button"
          onClick={() => profileImageInputRef.current?.click()}
          className="relative h-14 w-14 overflow-hidden rounded-full bg-primary/10"
          disabled={uploadingImage}
        >
          {uploadingImage ? (
            <div className="flex h-full w-full items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : profileImage ? (
            <Image
              src={profileImage}
              alt={initialUser?.name ?? "Profile"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg font-bold text-primary">
              SD
            </div>
          )}
        </button>
        <input
          ref={profileImageInputRef}
          type="file"
          accept="image/*"
          onChange={handleProfileImageUpload}
          className="hidden"
          aria-label="Upload profile photo"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-primary dark:text-white">
            {initialUser?.name ?? "Admin User"}
          </h3>
          <p className="text-xs text-muted">{initialUser?.email}</p>
        </div>
        <button
          title="Change profile photo"
          onClick={() => profileImageInputRef.current?.click()}
          disabled={uploadingImage}
          className="text-muted hover:text-primary"
        >
          <Pencil className="h-4 w-4" />
        </button>
      </div>

      {/* Profile Info */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-primary dark:text-white">
          Profile Info
        </h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-primary dark:text-white">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="mt-1 w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:text-white"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-primary dark:text-white">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Full-Stack Developer"
              className="mt-1 w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:text-white"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-primary dark:text-white">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A short bio about yourself"
              rows={3}
              className="mt-1 w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:text-white"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-primary dark:text-white">
              Interests
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {interests.map((interest) => (
                <span
                  key={interest}
                  className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:text-white"
                >
                  {interest}
                  <button
                    type="button"
                    onClick={() => setInterests((prev) => prev.filter((i) => i !== interest))}
                    className="ml-0.5 text-primary/60 hover:text-red-500 dark:text-white/60"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const val = newInterest.trim();
                    if (val && !interests.includes(val)) {
                      setInterests((prev) => [...prev, val]);
                      setNewInterest("");
                    }
                  }
                }}
                placeholder="Type an interest and press Enter"
                className="flex-1 rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:text-white"
              />
              <button
                type="button"
                onClick={() => {
                  const val = newInterest.trim();
                  if (val && !interests.includes(val)) {
                    setInterests((prev) => [...prev, val]);
                    setNewInterest("");
                  }
                }}
                className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary dark:text-white"
              >
                Add
              </button>
            </div>
          </div>
          <button
            onClick={handleSaveProfile}
            disabled={savingProfile}
            className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {savingProfile ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </section>

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
              ref={resumeInputRef}
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
                <button
                  onClick={() => setEditingExperience(exp)}
                  className="text-muted hover:text-primary"
                >
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
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-sm font-medium text-red-500"
        >
          Logout
        </button>
      </div>

      {(showAddExp || editingExperience) && (
        <AddExperienceModal
          initialData={editingExperience ?? undefined}
          onClose={() => {
            setShowAddExp(false);
            setEditingExperience(null);
          }}
        />
      )}
    </>
  );
}
