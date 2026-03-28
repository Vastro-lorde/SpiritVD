import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { Project } from "@/lib/models";
import { auth } from "@/lib/auth";
import slugify from "slugify";
import { ProjectStatus } from "@/enums";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const featured = searchParams.get("featured");
  const limit = parseInt(searchParams.get("limit") ?? "50");

  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (featured === "true") filter.featured = true;

  const projects = await Project.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return NextResponse.json({ success: true, data: projects });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const body = await req.json();
  const slug = slugify(body.title, { lower: true, strict: true });

  const project = await Project.create({
    ...body,
    slug,
    status: body.status ?? ProjectStatus.DRAFT,
  });

  return NextResponse.json({ success: true, data: project }, { status: 201 });
}
