export const dynamic = "force-dynamic";

import { connectDB } from "@/lib/db/connection";
import { Blog } from "@/lib/models";
import BlogList from "@/components/admin/BlogList";

async function getBlogs() {
  await connectDB();
  const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(blogs));
}

export default async function AdminBlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className="px-4 py-6">
      <BlogList initialBlogs={blogs} />
    </div>
  );
}
