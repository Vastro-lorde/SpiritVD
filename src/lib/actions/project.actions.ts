"use server";

import { connectDB } from "@/lib/db/connection";
import { Project } from "@/lib/models";
import { auth } from "@/lib/auth";
import slugify from "slugify";
import { revalidatePath } from "next/cache";
import { ProjectStatus } from "@/enums";


export async function createProject(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await connectDB();

  const title = formData.get("title") as string;
  const project = await Project.create({
    title,
    slug: slugify(title, { lower: true, strict: true }),
    description: formData.get("description") as string,
    coverImage: formData.get("coverImage") as string,
    techStack: (formData.get("techStack") as string)?.split(",").filter(Boolean) ?? [],
    liveUrl: (formData.get("liveUrl") as string) ?? "",
    githubUrl: (formData.get("githubUrl") as string) ?? "",
    featured: formData.get("featured") === "true",
    status: (formData.get("status") as string) ?? ProjectStatus.DRAFT,
    category: (formData.get("category") as string) ?? "",
    year: (formData.get("year") as string) ?? "",
    services: (formData.get("services") as string)?.split(",").filter(Boolean) ?? [],
  });

  revalidatePath("/admin/projects");
  revalidatePath("/work");
  revalidatePath("/");

  return { success: true, data: JSON.parse(JSON.stringify(project)) };
}

export async function updateProject(id: string, formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await connectDB();

  const updates: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (key === "techStack" || key === "services") {
      updates[key] = (value as string).split(",").filter(Boolean);
    } else if (key === "featured") {
      updates[key] = value === "true";
    } else {
      updates[key] = value;
    }
  }

  const project = await Project.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  revalidatePath("/admin/projects");
  revalidatePath("/work");
  revalidatePath("/");

  return { success: true, data: JSON.parse(JSON.stringify(project)) };
}

export async function deleteProject(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await connectDB();
  await Project.findByIdAndDelete(id);

  revalidatePath("/admin/projects");
  revalidatePath("/work");
  revalidatePath("/");

  return { success: true };
}

export async function toggleProjectFeatured(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await connectDB();
  const project = await Project.findById(id);
  if (!project) throw new Error("Project not found");

  project.featured = !project.featured;
  await project.save();

  revalidatePath("/admin/projects");
  revalidatePath("/");

  return { success: true, featured: project.featured };
}

