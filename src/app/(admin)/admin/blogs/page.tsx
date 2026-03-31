export const dynamic = "force-dynamic";

import { connectDB } from "@/lib/db/connection";
import { Blog } from "@/lib/models";
import { BlogStatus } from "@/enums";
import BlogList from "@/components/admin/BlogList";
import SearchInput from "@/components/shared/SearchInput";
import Pagination from "@/components/shared/Pagination";

const LIMIT = 10;

type Tab = "all" | "published" | "deleted";

async function getBlogs(page: number, search: string, tab: Tab) {
  await connectDB();
  const filter: Record<string, unknown> = {};

  if (tab === "published") filter.status = BlogStatus.PUBLISHED;
  else if (tab === "deleted") filter.status = BlogStatus.DELETED;
  else filter.status = { $ne: BlogStatus.DELETED };

  if (search) {
    const regex = { $regex: search, $options: "i" };
    filter.$or = [{ title: regex }, { subtitle: regex }, { description: regex }];
  }

  const [blogs, total, counts] = await Promise.all([
    Blog.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * LIMIT)
      .limit(LIMIT)
      .lean(),
    Blog.countDocuments(filter),
    Promise.all([
      Blog.countDocuments({ status: { $ne: BlogStatus.DELETED } }),
      Blog.countDocuments({ status: BlogStatus.PUBLISHED }),
      Blog.countDocuments({ status: BlogStatus.DELETED }),
    ]).then(([all, published, deleted]) => ({ all, published, deleted })),
  ]);
  return { blogs: JSON.parse(JSON.stringify(blogs)), total, counts };
}

export default async function AdminBlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; page?: string; search?: string; tab?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1"));
  const search = params.search ?? "";
  const tab = (params.tab as Tab) || "all";
  const { blogs, total, counts } = await getBlogs(page, search, tab);

  return (
    <div className="px-4 py-6">
      <BlogList
        initialBlogs={blogs}
        autoOpenCreate={params.new === "true"}
        counts={counts}
        currentTab={tab}
      />
      <Pagination total={total} page={page} limit={LIMIT} />
    </div>
  );
}
