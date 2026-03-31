"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { updateProject } from "@/lib/actions/project.actions";
import { ProjectStatus } from "@/enums";
import ImageUpload from "./ImageUpload";
import TechStackInput from "./TechStackInput";
import { useRouter } from "next/navigation";

interface ProjectData {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  status: ProjectStatus;
}

export default function EditProjectModal({
  project,
  onClose,
}: {
  project: ProjectData;
  onClose: () => void;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [coverImage, setCoverImage] = useState(project.coverImage);
  const [techStack, setTechStack] = useState<string[]>(project.techStack ?? []);
  const [liveUrl, setLiveUrl] = useState(project.liveUrl ?? "");
  const [githubUrl, setGithubUrl] = useState(project.githubUrl ?? "");
  const [featured, setFeatured] = useState(project.featured);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(status: ProjectStatus) {
    if (!title.trim()) return;
    setSaving(true);
    setError("");

    try {
      const formData = new FormData();
      formData.set("title", title);
      formData.set("description", description);
      formData.set("coverImage", coverImage);
      formData.set("techStack", techStack.join(","));
      formData.set("liveUrl", liveUrl);
      formData.set("githubUrl", githubUrl);
      formData.set("featured", String(featured));
      formData.set("status", status);

      await updateProject(project._id, formData);
      router.refresh();
      onClose();
    } catch {
      setError("Failed to update project. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 pt-4 pb-20">
      <div className="w-full max-w-md rounded-xl bg-white p-6 dark:bg-surface-dark">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={onClose} className="flex items-center gap-2 text-sm text-primary dark:text-white">
            <ArrowLeft className="h-4 w-4" />
            Edit Project
          </button>
          <button
            onClick={() => handleSubmit(ProjectStatus.DRAFT)}
            className="text-sm text-muted hover:text-primary"
          >
            Save As Draft
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-primary dark:text-white">
              Project Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project name..."
              className="mt-1 w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:text-white"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-primary dark:text-white">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a brief description of the project..."
              rows={4}
              className="mt-1 w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:text-white"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-primary dark:text-white">
              Cover Image
            </label>
            <div className="mt-1">
              <ImageUpload
                value={coverImage}
                onChange={setCoverImage}
                folder="projects"
                label="Tap to upload image"
                recommendedSize="PNG, JPG or WEBP up to 5MB"
              />
            </div>
          </div>

          {/* Featured toggle */}
          <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3 dark:border-border-dark">
            <div>
              <p className="text-sm font-medium text-primary dark:text-white">
                Featured Project
              </p>
              <p className="text-xs text-muted">
                Display on the main portfolio page
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFeatured(!featured)}
              aria-label="Toggle featured project"
              title="Toggle featured project"
              className={`h-6 w-11 rounded-full transition-colors ${
                featured ? "bg-primary" : "bg-gray-300 dark:bg-border-dark"
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  featured ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          <div>
            <label className="text-sm font-medium text-primary dark:text-white">
              Live URL (Optional)
            </label>
            <input
              type="url"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              placeholder="https://..."
              className="mt-1 w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:text-white"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-primary dark:text-white">
              Github Repository (Optional)
            </label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/..."
              className="mt-1 w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:text-white"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-primary dark:text-white">
              Tech Stack
            </label>
            <TechStackInput value={techStack} onChange={setTechStack} />
          </div>

          <button
            onClick={() => handleSubmit(project.status)}
            disabled={saving || !title.trim()}
            className="w-full rounded-lg bg-primary py-3 text-sm font-medium text-white transition-colors hover:bg-primary-light disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          {error && <p className="text-center text-sm text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}
