"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Pencil, Star, Trash2 } from "lucide-react";
import { ProjectStatus } from "@/enums";
import {
  deleteProject,
  toggleProjectFeatured,
} from "@/lib/actions/project.actions";
import CreateProjectModal from "./CreateProjectModal";
import EditProjectModal from "./EditProjectModal";
import SearchInput from "@/components/shared/SearchInput";

interface ProjectItem {
  _id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  status: ProjectStatus;
  featured: boolean;
  viewCount: number;
  updatedAt: string;
}

export default function ProjectList({
  initialProjects,
  autoOpenCreate,
}: {
  initialProjects: ProjectItem[];
  autoOpenCreate?: boolean;
}) {
  const [projects, setProjects] = useState(initialProjects);
  const [showCreate, setShowCreate] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  useEffect(() => {
    if (autoOpenCreate) setShowCreate(true);
  }, [autoOpenCreate]);

  function timeAgo(dateStr: string) {
    const days = Math.floor(
      (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (days === 0) return "Today";
    if (days < 7) return `${days} days ago`;
    if (days < 30)
      return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`;
    return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? "s" : ""} ago`;
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this project?")) return;
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p._id !== id));
  }

  async function handleToggleFeatured(id: string) {
    const result = await toggleProjectFeatured(id);
    setProjects((prev) =>
      prev.map((p) =>
        p._id === id ? { ...p, featured: result.featured } : p
      )
    );
  }

  return (
    <>
      {/* Search */}
      <SearchInput placeholder="Search projects..." />

      {/* Create button */}
      <button
        onClick={() => setShowCreate(true)}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-medium text-white transition-colors hover:bg-primary-light"
      >
        <Plus className="h-4 w-4" />
        Create New Project
      </button>

      {/* Project cards */}
      <div className="mt-6 space-y-6">
        {projects.map((project) => (
          <div
            key={project._id}
            className="overflow-hidden rounded-xl border border-border bg-white dark:border-border-dark dark:bg-surface-dark"
          >
            <div className="relative h-44 w-full bg-primary/5">
              {project.coverImage && (
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              )}
              <span
                className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-medium ${
                  project.status === ProjectStatus.PUBLISHED
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {project.status === ProjectStatus.PUBLISHED
                  ? "Published"
                  : "Draft"}
              </span>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-primary dark:text-white">
                {project.title}
              </h3>
              <p className="text-xs text-muted">
                Updated {timeAgo(project.updatedAt)} &bull;{" "}
                {project.viewCount.toLocaleString()} views
              </p>

              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => setEditingProject(project)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-medium text-primary dark:border-border-dark dark:text-white"
                >                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleToggleFeatured(project._id)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
                    project.featured
                      ? "border-amber-400 text-amber-500"
                      : "border-border text-muted dark:border-border-dark"
                  }`}
                >
                  <Star
                    className="h-4 w-4"
                    fill={project.featured ? "currentColor" : "none"}
                  />
                </button>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCreate && (
        <CreateProjectModal onClose={() => setShowCreate(false)} />
      )}
      {editingProject && (
        <EditProjectModal
          project={editingProject}
          onClose={() => setEditingProject(null)}
        />
      )}
    </>
  );
}
