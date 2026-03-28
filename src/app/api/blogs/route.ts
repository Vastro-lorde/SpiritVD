import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { Blog } from "@/lib/models";
import { auth } from "@/lib/auth";
import slugify from "slugify";
import { BlogStatus } from "@/enums";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const limit = parseInt(searchParams.get("limit") ?? "50");

  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;

  const blogs = await Blog.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return NextResponse.json({ success: true, data: blogs });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const body = await req.json();
  const slug = slugify(body.title, { lower: true, strict: true });

  const blog = await Blog.create({
    ...body,
    slug,
    status: body.status ?? BlogStatus.DRAFT,
  });

  return NextResponse.json({ success: true, data: blog }, { status: 201 });
}
