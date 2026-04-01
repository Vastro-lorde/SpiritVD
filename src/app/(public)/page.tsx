export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { connectDB } from "@/lib/db/connection";
import { Project, Blog, User, Experience, SocialLink, SiteConfig } from "@/lib/models";
import { ProjectStatus, BlogStatus } from "@/enums";
import { FiDownload } from "react-icons/fi";
import { FaLinkedinIn, FaGithub, FaTwitter } from "react-icons/fa";

const fallbackData = {
  user: null as null,
  projects: [] as never[],
  blogs: [] as never[],
  socialLinks: [] as { platform: string; url: string }[],
  stats: { projects: 0, experience: 0, totalViews: 0 },
  siteConfig: null as null | { siteName?: string; ownerName?: string },
};

async function getData() {
  try {
    await connectDB();
    const [user, projects, blogs, socialLinks, experienceCount, siteConfig] = await Promise.all([
      User.findOne().select("-passwordHash").lean(),
      Project.find({ status: ProjectStatus.PUBLISHED })
        .sort({ createdAt: -1 })
        .limit(3)
        .lean(),
      Blog.find({ status: BlogStatus.PUBLISHED })
        .sort({ createdAt: -1 })
        .limit(2)
        .lean(),
      SocialLink.find().select("platform url").lean(),
      Experience.countDocuments(),
      SiteConfig.findOne().lean(),
    ]);

    const totalViews =
      (await Project.aggregate([
        { $group: { _id: null, total: { $sum: "$viewCount" } } },
      ]).then((r) => r[0]?.total ?? 0)) +
      (await Blog.aggregate([
        { $group: { _id: null, total: { $sum: "$viewCount" } } },
      ]).then((r) => r[0]?.total ?? 0));

    const projectCount = await Project.countDocuments({
      status: ProjectStatus.PUBLISHED,
    });

    return {
      user,
      projects: JSON.parse(JSON.stringify(projects)),
      blogs: JSON.parse(JSON.stringify(blogs)),
      socialLinks: JSON.parse(JSON.stringify(socialLinks)),
      stats: {
        projects: projectCount,
        experience: experienceCount,
        totalViews,
      },
      siteConfig: siteConfig ? JSON.parse(JSON.stringify(siteConfig)) : null,
    };
  } catch (err) {
    console.error("Failed to load home page data:", err);
    return fallbackData;
  }
}

export default async function HomePage() {
  const { user, projects, blogs, socialLinks, stats, siteConfig } = await getData();

  const ownerName = user?.name ?? siteConfig?.ownerName ?? "";
  const siteName = siteConfig?.siteName ?? "SD";

  const getSocialUrl = (platform: string) =>
    socialLinks.find((link: { platform: string; url: string }) => link.platform === platform)
      ?.url || "#";

  return (
    <div>
      {/* Hero Section */}
      <section className="mx-auto max-w-5xl px-4 py-16 md:py-24">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <div className="text-center md:text-left">
            <p className="font-script text-4xl text-primary dark:text-white md:text-5xl">
              Hey!
            </p>
            <h1 className="mt-2 text-3xl font-bold text-primary dark:text-white md:text-4xl">
              {ownerName}
            </h1>
            <p className="mt-1 text-lg text-muted">
              {user?.title ?? ""}
            </p>

            <div className="mt-4 flex items-center justify-center gap-3 md:justify-start">
              <a
                href={getSocialUrl("linkedin")}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
                className="text-muted hover:text-primary dark:hover:text-white"
              >
                <FaLinkedinIn className="h-5 w-5" />
              </a>
              <a
                href={getSocialUrl("github")}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                title="GitHub"
                className="text-muted hover:text-primary dark:hover:text-white"
              >
                <FaGithub className="h-5 w-5" />
              </a>
              <a
                href={getSocialUrl("twitter")}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                title="Twitter"
                className="text-muted hover:text-primary dark:hover:text-white"
              >
                <FaTwitter className="h-5 w-5" />
              </a>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3 md:justify-start">
              <Link
                href="/contact"
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-light"
              >
                Let&apos;s Connect
              </Link>
              {user?.resumeUrl && (
                <a
                  href="/api/resume"
                  download
                  className="flex items-center gap-2 rounded-full border border-primary px-6 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white dark:border-white dark:text-white"
                >
                  <FiDownload className="h-4 w-4" />
                  Download CV
                </a>
              )}
            </div>
          </div>

          {/* Profile image */}
          <div className="relative h-56 w-56 overflow-hidden rounded-full border-4 border-primary/10 md:h-64 md:w-64">
            {user?.profileImage ? (
              <Image
                src={user.profileImage}
                alt={user.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary/5 text-4xl font-bold text-primary">
                {siteName}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "PROJECTS", value: `${stats.projects}+` },
            { label: "YRS EXP", value: `${stats.experience}+` },
            { label: "TOTAL VIEWS", value: `${stats.totalViews}` },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl border border-border p-4 text-center dark:border-border-dark"
            >
              <p className="text-2xl font-bold text-primary dark:text-white">
                {value}
              </p>
              <p className="mt-1 text-xs text-muted">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Projects */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-2xl font-bold text-primary dark:text-white">
          Recent Projects
        </h2>
        <div className="mt-6 space-y-6">
          {projects.map(
            (project: {
              _id: string;
              slug: string;
              title: string;
              description: string;
              coverImage: string;
            }) => (
              <Link
                key={project._id}
                href={`/work/${project.slug}`}
                className="group block overflow-hidden rounded-xl border border-border transition-shadow hover:shadow-lg dark:border-border-dark"
              >
                {project.coverImage && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={project.coverImage}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-primary dark:text-white">
                    {project.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">
                    {project.description}
                  </p>
                  <span className="mt-2 inline-block text-sm font-medium text-primary dark:text-accent">
                    View Project &rarr;
                  </span>
                </div>
              </Link>
            )
          )}
        </div>
      </section>

      {/* Latest Writing */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-2xl font-bold text-primary dark:text-white">
          Latest Writing
        </h2>
        <div className="mt-6 space-y-4">
          {blogs.map(
            (blog: {
              _id: string;
              slug: string;
              title: string;
              subtitle: string;
              description: string;
              coverImage: string;
              createdAt: string;
            }) => (
              <Link
                key={blog._id}
                href={`/blog/${blog.slug}`}
                className="group block rounded-xl border border-border p-4 transition-shadow hover:shadow-lg dark:border-border-dark"
              >
                <p className="text-xs text-muted">
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <h3 className="mt-1 font-semibold text-primary dark:text-white">
                  {blog.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted">
                  {blog.description}
                </p>
                <span className="mt-2 inline-block text-sm font-medium text-primary dark:text-accent">
                  Read Full Article &rarr;
                </span>
              </Link>
            )
          )}
        </div>
      </section>

      {/* Get In Touch CTA */}
      <section className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-primary dark:text-white">
          Get In Touch
        </h2>
        <p className="mt-2 text-muted">
          Let&apos;s Connect and Create the Magic together!
        </p>
        <Link
          href="/contact"
          className="mt-6 inline-block rounded-full bg-primary px-8 py-3 font-medium text-white transition-colors hover:bg-primary-light"
        >
          Say Hello!
        </Link>
      </section>
    </div>
  );
}
