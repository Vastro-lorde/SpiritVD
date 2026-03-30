"use server";

import { connectDB } from "@/lib/db/connection";
import { Blog } from "@/lib/models";
import slugify from "slugify";
import { revalidatePath } from "next/cache";
import { BlogStatus, BlogSource } from "@/enums";
import {
  publishPost,
  isMediumConfigured,
} from "@/lib/services/medium.service";
import { requireAuthenticatedAdminEmail } from "@/lib/auth/admin";
import { generateUniqueSlug } from "@/lib/utils/slug";

export async function createBlog(formData: FormData) {
  await requireAuthenticatedAdminEmail();

  await connectDB();

  const title = formData.get("title") as string;
  const baseSlug = slugify(title, { lower: true, strict: true });
  const slug = await generateUniqueSlug(baseSlug, async (candidate) => {
    const count = await Blog.countDocuments({ slug: candidate });
    return count > 0;
  });

  const blog = await Blog.create({
    title,
    slug,
    subtitle: (formData.get("subtitle") as string) ?? "",
    description: (formData.get("description") as string) ?? "",
    content: (formData.get("content") as string) ?? "",
    coverImage: (formData.get("coverImage") as string) ?? "",
    status: (formData.get("status") as string) ?? BlogStatus.DRAFT,
    source: BlogSource.LOCAL,
  });

  revalidatePath("/admin/blogs");
  revalidatePath("/blog");
  revalidatePath("/");

  return { success: true, data: JSON.parse(JSON.stringify(blog)) };
}

export async function updateBlog(id: string, formData: FormData) {
  await requireAuthenticatedAdminEmail();

  await connectDB();

  const updates: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    updates[key] = value;
  }

  const blog = await Blog.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  revalidatePath("/admin/blogs");
  revalidatePath("/blog");
  revalidatePath("/");

  return { success: true, data: JSON.parse(JSON.stringify(blog)) };
}

export async function deleteBlog(id: string) {
  await requireAuthenticatedAdminEmail();

  await connectDB();
  await Blog.findByIdAndUpdate(id, { status: BlogStatus.DELETED });

  revalidatePath("/admin/blogs");
  revalidatePath("/blog");
  revalidatePath("/");

  return { success: true };
}

export async function toggleBlogPublish(id: string) {
  await requireAuthenticatedAdminEmail();

  await connectDB();
  const blog = await Blog.findById(id);
  if (!blog) throw new Error("Blog not found");

  blog.status =
    blog.status === BlogStatus.PUBLISHED
      ? BlogStatus.DRAFT
      : BlogStatus.PUBLISHED;
  await blog.save();

  revalidatePath("/admin/blogs");
  revalidatePath("/blog");

  return { success: true, status: blog.status };
}

export async function publishToMedium(id: string) {
  if (!isMediumConfigured()) {
    return {
      success: false,
      error:
        "Medium is not configured. Set MEDIUM_TOKEN and MEDIUM_USER_ID in your environment variables.",
    };
  }

  await requireAuthenticatedAdminEmail();

  await connectDB();
  const blog = await Blog.findById(id);
  if (!blog) throw new Error("Blog not found");

  const result = await publishPost({
    title: blog.title,
    content: blog.content || blog.description,
    contentFormat: "html",
    tags: [],
    publishStatus: "draft",
  });

  blog.mediumUrl = result.url;
  blog.source = BlogSource.MEDIUM;
  await blog.save();

  revalidatePath("/admin/blogs");
  return { success: true, mediumUrl: result.url };
}
