export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db/connection";
import { Project } from "@/lib/models";
import { ProjectStatus } from "@/enums";

async function getProject(slug: string) {
  await connectDB();
  const project = await Project.findOneAndUpdate(
    { slug, status: ProjectStatus.PUBLISHED },
    { $inc: { viewCount: 1 } },
    { new: true }
  ).lean();
  if (!project) return null;
  return JSON.parse(JSON.stringify(project));
}

async function getNextProject(currentSlug: string) {
  await connectDB();
  const next = await Project.findOne({
    slug: { $ne: currentSlug },
    status: ProjectStatus.PUBLISHED,
  })
    .sort({ createdAt: -1 })
    .lean();
  return next ? JSON.parse(JSON.stringify(next)) : null;
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, nextProject] = await Promise.all([
    getProject(slug),
    getNextProject(slug),
  ]);

  if (!project) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Breadcrumb tabs */}
      <div className="flex items-center gap-2 text-sm text-muted">
        <Link href="/work" className="hover:text-primary dark:hover:text-white">
          Project
        </Link>
      </div>

      <h1 className="mt-4 text-3xl font-bold text-primary dark:text-white">
        {project.title}
      </h1>

      {/* Hero image */}
      {project.coverImage && (
        <div className="relative mt-6 h-64 w-full overflow-hidden rounded-xl md:h-96">
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Details grid */}
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {project.year && (
          <div>
            <p className="text-xs text-muted">Year</p>
            <p className="font-medium text-primary dark:text-white">
              {project.year}
            </p>
          </div>
        )}
        {project.category && (
          <div>
            <p className="text-xs text-muted">Client</p>
            <p className="font-medium text-primary dark:text-white">
              {project.category}
            </p>
          </div>
        )}
        {project.services?.length > 0 && (
          <div>
            <p className="text-xs text-muted">Services</p>
            {project.services.map((s: string) => (
              <p key={s} className="font-medium text-primary dark:text-white">
                {s}
              </p>
            ))}
          </div>
        )}
        <div className="flex gap-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary underline dark:text-accent"
            >
              Live Site
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary underline dark:text-accent"
            >
              GitHub
            </a>
          )}
        </div>
      </div>

      {/* Tech Highlights */}
      {project.techStack?.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-bold text-primary dark:text-white">
            Tech Highlights
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.techStack.map((tech: string) => (
              <span
                key={tech}
                className="rounded-full bg-primary/5 px-3 py-1 text-sm text-primary dark:bg-white/10 dark:text-white"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Description */}
      <section className="mt-8">
        <p className="leading-relaxed text-muted">{project.description}</p>
      </section>

      {/* Gallery */}
      {project.galleryImages?.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-primary dark:text-white">
            Project Gallery
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {project.galleryImages.map((img: string, i: number) => (
              <div
                key={i}
                className="relative h-48 overflow-hidden rounded-xl md:h-64"
              >
                <Image
                  src={img}
                  alt={`${project.title} gallery ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Up Next */}
      {nextProject && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-primary dark:text-white">
            Up Next
          </h2>
          <Link
            href={`/work/${nextProject.slug}`}
            className="group mt-4 block overflow-hidden rounded-xl border border-border transition-shadow hover:shadow-lg dark:border-border-dark"
          >
            {nextProject.coverImage && (
              <div className="relative h-48 w-full">
                <Image
                  src={nextProject.coverImage}
                  alt={nextProject.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-primary dark:text-white">
                {nextProject.title}
              </h3>
              <p className="mt-1 text-sm text-muted">
                {nextProject.description}
              </p>
            </div>
          </Link>
        </section>
      )}
    </div>
  );
}
