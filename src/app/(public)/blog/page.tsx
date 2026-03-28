export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { connectDB } from "@/lib/db/connection";
import { Blog } from "@/lib/models";
import { BlogStatus } from "@/enums";

async function getBlogs() {
  await connectDB();
  const blogs = await Blog.find({ status: BlogStatus.PUBLISHED })
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(blogs));
}

export default async function BlogPage() {
  const blogs = await getBlogs();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-primary dark:text-white">Blog</h1>
      <p className="mt-2 text-muted">Thoughts, tutorials, and insights.</p>

      <div className="mt-8 space-y-8">
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
              className="group block overflow-hidden rounded-xl border border-border transition-shadow hover:shadow-lg dark:border-border-dark"
            >
              {blog.coverImage && (
                <div className="relative h-52 w-full">
                  <Image
                    src={blog.coverImage}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-5">
                <p className="text-xs text-muted">
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <h2 className="mt-1 text-xl font-semibold text-primary dark:text-white">
                  {blog.title}
                </h2>
                {blog.subtitle && (
                  <p className="mt-1 text-sm font-medium text-muted">
                    {blog.subtitle}
                  </p>
                )}
                <p className="mt-2 line-clamp-3 text-sm text-muted">
                  {blog.description}
                </p>
                <span className="mt-3 inline-block text-sm font-medium text-primary dark:text-accent">
                  Read Full Article &rarr;
                </span>
              </div>
            </Link>
          )
        )}
      </div>

      {blogs.length === 0 && (
        <p className="mt-12 text-center text-muted">
          No blog posts published yet.
        </p>
      )}
    </div>
  );
}
