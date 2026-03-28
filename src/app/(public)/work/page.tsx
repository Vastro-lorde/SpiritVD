export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { connectDB } from "@/lib/db/connection";
import { Project } from "@/lib/models";
import { ProjectStatus } from "@/enums";

async function getProjects() {
  await connectDB();
  const projects = await Project.find({ status: ProjectStatus.PUBLISHED })
    .sort({ featured: -1, createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(projects));
}

export default async function WorkPage() {
  const projects = await getProjects();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-primary dark:text-white">
        My Work
      </h1>
      <p className="mt-2 text-muted">
        A collection of projects I&apos;ve worked on.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {projects.map(
          (project: {
            _id: string;
            slug: string;
            title: string;
            description: string;
            coverImage: string;
            techStack: string[];
            year: string;
          }) => (
            <Link
              key={project._id}
              href={`/work/${project.slug}`}
              className="group overflow-hidden rounded-xl border border-border transition-shadow hover:shadow-lg dark:border-border-dark"
            >
              <div className="relative h-48 w-full bg-primary/5">
                {project.coverImage && (
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-primary dark:text-white">
                  {project.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted">
                  {project.description}
                </p>
                {project.techStack.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.techStack.slice(0, 4).map((tech: string) => (
                      <span
                        key={tech}
                        className="rounded-full bg-primary/5 px-2.5 py-0.5 text-xs text-primary dark:bg-white/10 dark:text-white"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          )
        )}
      </div>

      {projects.length === 0 && (
        <p className="mt-12 text-center text-muted">
          No projects published yet.
        </p>
      )}
    </div>
  );
}
