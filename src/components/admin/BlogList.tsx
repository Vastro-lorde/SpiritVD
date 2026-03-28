"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Pencil, EyeOff, Trash2 } from "lucide-react";
import { BlogStatus } from "@/enums";
import { deleteBlog, toggleBlogPublish } from "@/lib/actions/blog.actions";
import CreateBlogModal from "./CreateBlogModal";

interface BlogItem {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  status: BlogStatus;
  viewCount: number;
  createdAt: string;
}

type Tab = "all" | "published" | "deleted";

export default function BlogList({
  initialBlogs,
}: {
  initialBlogs: BlogItem[];
}) {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [tab, setTab] = useState<Tab>("all");
  const [showCreate, setShowCreate] = useState(false);

  const filtered = blogs.filter((b) => {
    if (tab === "all") return b.status !== BlogStatus.DELETED;
    if (tab === "published") return b.status === BlogStatus.PUBLISHED;
    if (tab === "deleted") return b.status === BlogStatus.DELETED;
    return true;
  });

  const counts = {
    all: blogs.filter((b) => b.status !== BlogStatus.DELETED).length,
    published: blogs.filter((b) => b.status === BlogStatus.PUBLISHED).length,
    deleted: blogs.filter((b) => b.status === BlogStatus.DELETED).length,
  };

  async function handleDelete(id: string) {
    if (!confirm("Delete this blog post?")) return;
    await deleteBlog(id);
    setBlogs((prev) =>
      prev.map((b) =>
        b._id === id ? { ...b, status: BlogStatus.DELETED } : b
      )
    );
  }

  async function handleTogglePublish(id: string) {
    const result = await toggleBlogPublish(id);
    setBlogs((prev) =>
      prev.map((b) =>
        b._id === id ? { ...b, status: result.status as BlogStatus } : b
      )
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-primary dark:text-white">
          All Posts
        </h2>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
        >
          <Plus className="h-4 w-4" />
          New Post
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-4 flex gap-4 border-b border-border dark:border-border-dark">
        {(["all", "published", "deleted"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-2 text-sm font-medium capitalize transition-colors ${
              tab === t
                ? "border-b-2 border-primary text-primary dark:text-white"
                : "text-muted hover:text-primary"
            }`}
          >
            {t} ({counts[t]})
          </button>
        ))}
      </div>

      {/* Blog cards */}
      <div className="mt-6 space-y-6">
        {filtered.map((blog) => (
          <div
            key={blog._id}
            className="overflow-hidden rounded-xl border border-border bg-white dark:border-border-dark dark:bg-surface-dark"
          >
            <div className="relative h-44 w-full bg-primary/5">
              {blog.coverImage && (
                <Image
                  src={blog.coverImage}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
              )}
              <span
                className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-medium ${
                  blog.status === BlogStatus.PUBLISHED
                    ? "bg-green-100 text-green-700"
                    : blog.status === BlogStatus.DRAFT
                      ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-700"
                }`}
              >
                {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
              </span>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-primary dark:text-white">
                {blog.title}
              </h3>
              <p className="text-xs text-muted">
                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                &bull; {blog.viewCount.toLocaleString()} views
              </p>

              <div className="mt-3 flex items-center gap-2">
                <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-medium text-primary dark:border-border-dark dark:text-white">
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleTogglePublish(blog._id)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-medium text-primary dark:border-border-dark dark:text-white"
                >
                  <EyeOff className="h-3.5 w-3.5" />
                  {blog.status === BlogStatus.PUBLISHED
                    ? "Unpublish"
                    : "Publish"}
                </button>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCreate && <CreateBlogModal onClose={() => setShowCreate(false)} />}
    </>
  );
}
