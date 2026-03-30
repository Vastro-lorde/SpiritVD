import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { Blog } from "@/lib/models";
import { getAuthenticatedAdminEmail } from "@/lib/auth/admin";
import { BlogStatus } from "@/enums";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminEmail = await getAuthenticatedAdminEmail();
  if (!adminEmail) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const { id } = await params;
  const blog = await Blog.findById(id).lean();

  if (!blog) {
    return NextResponse.json(
      { success: false, error: "Blog not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: blog });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminEmail = await getAuthenticatedAdminEmail();
  if (!adminEmail) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const { id } = await params;
  const body = await req.json();

  const blog = await Blog.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  }).lean();

  if (!blog) {
    return NextResponse.json(
      { success: false, error: "Blog not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: blog });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminEmail = await getAuthenticatedAdminEmail();
  if (!adminEmail) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const { id } = await params;
  const blog = await Blog.findByIdAndUpdate(id, { status: BlogStatus.DELETED });

  if (!blog) {
    return NextResponse.json(
      { success: false, error: "Blog not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, message: "Deleted" });
}
