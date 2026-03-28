export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db/connection";
import { Blog } from "@/lib/models";
import { BlogStatus } from "@/enums";

async function getBlog(slug: string) {
  await connectDB();
  const blog = await Blog.findOneAndUpdate(
    { slug, status: BlogStatus.PUBLISHED },
    { $inc: { viewCount: 1 } },
    { new: true }
  ).lean();
  if (!blog) return null;
  return JSON.parse(JSON.stringify(blog));
}

async function getNextBlog(currentSlug: string) {
  await connectDB();
  const next = await Blog.findOne({
    slug: { $ne: currentSlug },
    status: BlogStatus.PUBLISHED,
  })
    .sort({ createdAt: -1 })
    .lean();
  return next ? JSON.parse(JSON.stringify(next)) : null;
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [blog, nextBlog] = await Promise.all([
    getBlog(slug),
    getNextBlog(slug),
  ]);

  if (!blog) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      {/* Breadcrumb */}
      <div className="text-sm text-muted">
        <Link href="/blog" className="hover:text-primary dark:hover:text-white">
          Blog
        </Link>
      </div>

      <h1 className="mt-4 text-3xl font-bold leading-tight text-primary dark:text-white">
        {blog.title}
      </h1>

      <p className="mt-2 text-sm text-muted">
        Updated:{" "}
        {new Date(blog.updatedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      {/* Cover image */}
      {blog.coverImage && (
        <div className="relative mt-6 h-64 w-full overflow-hidden rounded-xl md:h-96">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Content */}
      <article className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <div dangerouslySetInnerHTML={{ __html: blog.content || blog.description }} />
      </article>

      {/* Medium link */}
      {blog.mediumUrl && (
        <p className="mt-6">
          <a
            href={blog.mediumUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary underline dark:text-accent"
          >
            Also published on Medium &rarr;
          </a>
        </p>
      )}

      {/* Up Next */}
      {nextBlog && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-primary dark:text-white">
            Up Next
          </h2>
          <Link
            href={`/blog/${nextBlog.slug}`}
            className="group mt-4 block rounded-xl border border-border p-4 transition-shadow hover:shadow-lg dark:border-border-dark"
          >
            <p className="text-xs text-muted">
              {new Date(nextBlog.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <h3 className="mt-1 font-semibold text-primary dark:text-white">
              {nextBlog.title}
            </h3>
            <p className="mt-1 text-sm text-muted">{nextBlog.description}</p>
            <span className="mt-2 inline-block text-sm font-medium text-primary dark:text-accent">
              Read Full Article &rarr;
            </span>
          </Link>
        </section>
      )}
    </div>
  );
}
