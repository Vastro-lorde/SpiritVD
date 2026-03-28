export const dynamic = "force-dynamic";

import Link from "next/link";
import { connectDB } from "@/lib/db/connection";
import { Project, Blog, Experience } from "@/lib/models";
import { ProjectStatus, BlogStatus } from "@/enums";
import {
  FolderOpen,
  FileText,
  Briefcase,
  Eye,
  Plus,
  PenLine,
  CirclePlus,
  Upload,
} from "lucide-react";

async function getStats() {
  await connectDB();

  const [projectCount, blogCount, experienceCount] = await Promise.all([
    Project.countDocuments(),
    Blog.countDocuments({ status: { $ne: BlogStatus.DELETED } }),
    Experience.countDocuments(),
  ]);

  const projectViews = await Project.aggregate([
    { $group: { _id: null, total: { $sum: "$viewCount" } } },
  ]).then((r) => r[0]?.total ?? 0);

  const blogViews = await Blog.aggregate([
    { $group: { _id: null, total: { $sum: "$viewCount" } } },
  ]).then((r) => r[0]?.total ?? 0);

  const totalViews = projectViews + blogViews;

  const recentContent = await Promise.all([
    Project.find()
      .sort({ updatedAt: -1 })
      .limit(3)
      .select("title slug updatedAt status")
      .lean(),
    Blog.find({ status: { $ne: BlogStatus.DELETED } })
      .sort({ updatedAt: -1 })
      .limit(3)
      .select("title slug updatedAt status")
      .lean(),
  ]);

  const recent = [
    ...recentContent[0].map((p) => ({
      ...p,
      _id: p._id.toString(),
      type: "Project" as const,
      href: `/admin/projects`,
    })),
    ...recentContent[1].map((b) => ({
      ...b,
      _id: b._id.toString(),
      type: "Blog" as const,
      href: `/admin/blogs`,
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 3);

  const mostViewed = await Promise.all([
    Project.find({ status: ProjectStatus.PUBLISHED })
      .sort({ viewCount: -1 })
      .limit(3)
      .select("title viewCount")
      .lean(),
    Blog.find({ status: BlogStatus.PUBLISHED })
      .sort({ viewCount: -1 })
      .limit(3)
      .select("title viewCount")
      .lean(),
  ]);

  const topViewed = [
    ...mostViewed[0].map((p) => ({
      ...p,
      _id: p._id.toString(),
      type: "Project" as const,
    })),
    ...mostViewed[1].map((b) => ({
      ...b,
      _id: b._id.toString(),
      type: "Blog" as const,
    })),
  ]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 3);

  return {
    projectCount,
    blogCount,
    experienceCount,
    totalViews,
    recent: JSON.parse(JSON.stringify(recent)),
    topViewed: JSON.parse(JSON.stringify(topViewed)),
  };
}

function formatViews(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

function timeAgo(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`;
  return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? "s" : ""} ago`;
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div className="px-4 py-6">
      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Projects", value: stats.projectCount, icon: FolderOpen },
          { label: "Blogs", value: stats.blogCount, icon: FileText },
          { label: "Experience", value: stats.experienceCount, icon: Briefcase },
          {
            label: "Total Views",
            value: formatViews(stats.totalViews),
            icon: Eye,
          },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-xl border border-border bg-white p-4 dark:border-border-dark dark:bg-surface-dark"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted">{label}</p>
              <Icon className="h-4 w-4 text-muted" />
            </div>
            <p className="mt-2 text-2xl font-bold text-primary dark:text-white">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <section className="mt-8">
        <h2 className="text-lg font-bold text-primary dark:text-white">
          Quick Actions
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Link
            href="/admin/projects?new=true"
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Link>
          <Link
            href="/admin/blogs?new=true"
            className="flex items-center gap-2 rounded-xl border border-primary bg-white px-4 py-3 text-sm font-medium text-primary dark:bg-surface-dark dark:text-white"
          >
            <PenLine className="h-4 w-4" />
            New Blog Post
          </Link>
          <Link
            href="/admin/profile?addExp=true"
            className="flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-3 text-sm font-medium text-primary dark:border-border-dark dark:bg-surface-dark dark:text-white"
          >
            <CirclePlus className="h-4 w-4" />
            Add Experience
          </Link>
          <Link
            href="/admin/profile?uploadResume=true"
            className="flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-3 text-sm font-medium text-primary dark:border-border-dark dark:bg-surface-dark dark:text-white"
          >
            <Upload className="h-4 w-4" />
            Update Resume
          </Link>
        </div>
      </section>

      {/* Recent Content */}
      <section className="mt-8">
        <h2 className="text-lg font-bold text-primary dark:text-white">
          Recent Content
        </h2>
        <div className="mt-3 space-y-3">
          {stats.recent.map(
            (item: {
              _id: string;
              title: string;
              type: string;
              href: string;
              updatedAt: string;
            }) => (
              <div
                key={item._id}
                className="flex items-center justify-between rounded-lg bg-white px-4 py-3 dark:bg-surface-dark"
              >
                <div>
                  <p className="text-sm font-medium text-primary dark:text-white">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted">
                    {item.type} &bull; {timeAgo(item.updatedAt)}
                  </p>
                </div>
                <Link
                  href={item.href}
                  className="text-xs font-medium text-primary dark:text-accent"
                >
                  Edit
                </Link>
              </div>
            )
          )}
        </div>
      </section>

      {/* Most Visited */}
      <section className="mt-8">
        <h2 className="text-lg font-bold italic text-primary dark:text-white">
          Most Visited
        </h2>
        <div className="mt-3 space-y-3">
          {stats.topViewed.map(
            (item: {
              _id: string;
              title: string;
              type: string;
              viewCount: number;
            }) => (
              <div
                key={item._id}
                className="flex items-center justify-between rounded-lg bg-white px-4 py-3 dark:bg-surface-dark"
              >
                <div>
                  <p className="text-sm font-medium text-primary dark:text-white">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted">{item.type}</p>
                </div>
                <p className="text-sm font-medium text-primary dark:text-white">
                  {formatViews(item.viewCount)} views
                </p>
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}
