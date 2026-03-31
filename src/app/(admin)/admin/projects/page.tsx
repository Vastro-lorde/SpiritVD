export const dynamic = "force-dynamic";

import { connectDB } from "@/lib/db/connection";
import { Project } from "@/lib/models";
import ProjectList from "@/components/admin/ProjectList";
import SearchInput from "@/components/shared/SearchInput";
import Pagination from "@/components/shared/Pagination";

const LIMIT = 10;

async function getProjects(page: number, search: string) {
  await connectDB();
  const filter: Record<string, unknown> = {};
  if (search) {
    const regex = { $regex: search, $options: "i" };
    filter.$or = [{ title: regex }, { description: regex }];
  }
  const [projects, total] = await Promise.all([
    Project.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * LIMIT)
      .limit(LIMIT)
      .lean(),
    Project.countDocuments(filter),
  ]);
  return { projects: JSON.parse(JSON.stringify(projects)), total };
}

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1"));
  const search = params.search ?? "";
  const { projects, total } = await getProjects(page, search);

  return (
    <div className="px-4 py-6">
      <ProjectList initialProjects={projects} autoOpenCreate={params.new === "true"} />
      <Pagination total={total} page={page} limit={LIMIT} />
    </div>
  );
}
