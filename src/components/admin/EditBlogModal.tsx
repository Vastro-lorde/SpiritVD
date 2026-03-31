"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { updateBlog } from "@/lib/actions/blog.actions";
import { BlogStatus } from "@/enums";
import ImageUpload from "./ImageUpload";
import { useRouter } from "next/navigation";

interface BlogData {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  coverImage: string;
  status: BlogStatus;
}

export default function EditBlogModal({
  blog,
  onClose,
}: {
  blog: BlogData;
  onClose: () => void;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(blog.title);
  const [subtitle, setSubtitle] = useState(blog.subtitle ?? "");
  const [description, setDescription] = useState(blog.description ?? "");
  const [coverImage, setCoverImage] = useState(blog.coverImage);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(status: BlogStatus) {
    if (!title.trim()) return;
    setSaving(true);
    setError("");

    try {
      const formData = new FormData();
      formData.set("title", title);
      formData.set("subtitle", subtitle);
      formData.set("description", description);
      formData.set("coverImage", coverImage);
      formData.set("status", status);

      await updateBlog(blog._id, formData);
      router.refresh();
      onClose();
    } catch {
      setError("Failed to update blog post. Please try again.");
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
            Edit Blog
          </button>
          <button
            onClick={() => handleSubmit(BlogStatus.DRAFT)}
            className="text-sm text-muted hover:text-primary"
          >
            Save As Draft
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {/* Cover image */}
          <ImageUpload
            value={coverImage}
            onChange={setCoverImage}
            folder="blogs"
            label="Add Cover Page"
            recommendedSize="1200 x 630 px"
          />

          <div>
            <label className="text-sm font-medium text-primary dark:text-white">
              Post Heading
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Post Header Name..."
              className="mt-1 w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:text-white"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-primary dark:text-white">
              Sub Title
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Enter title name..."
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
              rows={5}
              className="mt-1 w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:text-white"
            />
          </div>

          <button
            onClick={() => handleSubmit(blog.status === BlogStatus.PUBLISHED ? BlogStatus.PUBLISHED : BlogStatus.DRAFT)}
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
