import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { Blog } from "@/lib/models";
import slugify from "slugify";
import { BlogStatus } from "@/enums";
import { getAuthenticatedAdminEmail } from "@/lib/auth/admin";
import { generateUniqueSlug } from "@/lib/utils/slug";

export async function GET(req: NextRequest) {
  await connectDB();
  const adminEmail = await getAuthenticatedAdminEmail();
  const isAdmin = Boolean(adminEmail);

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const limit = parseInt(searchParams.get("limit") ?? "50");

  const filter: Record<string, unknown> = {};
  if (isAdmin && status) {
    filter.status = status;
  } else if (!isAdmin) {
    filter.status = BlogStatus.PUBLISHED;
  }

  const blogs = await Blog.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return NextResponse.json({ success: true, data: blogs });
}

export async function POST(req: NextRequest) {
  const adminEmail = await getAuthenticatedAdminEmail();
  if (!adminEmail) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const body = await req.json();
  const baseSlug = slugify(body.title, { lower: true, strict: true });
  const slug = await generateUniqueSlug(baseSlug, async (candidate) => {
    const count = await Blog.countDocuments({ slug: candidate });
    return count > 0;
  });

  const blog = await Blog.create({
    ...body,
    slug,
    status: body.status ?? BlogStatus.DRAFT,
  });

  return NextResponse.json({ success: true, data: blog }, { status: 201 });
}
