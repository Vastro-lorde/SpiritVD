export const dynamic = "force-dynamic";

import { connectDB } from "@/lib/db/connection";
import { Project } from "@/lib/models";
import ProjectList from "@/components/admin/ProjectList";

async function getProjects() {
  await connectDB();
  const projects = await Project.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(projects));
}

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="px-4 py-6">
      <ProjectList initialProjects={projects} />
    </div>
  );
}
