import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { Project } from "@/lib/models";
import { auth } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;
  const project = await Project.findById(id).lean();

  if (!project) {
    return NextResponse.json(
      { success: false, error: "Project not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: project });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const { id } = await params;
  const body = await req.json();

  const project = await Project.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  }).lean();

  if (!project) {
    return NextResponse.json(
      { success: false, error: "Project not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: project });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const { id } = await params;
  const project = await Project.findByIdAndDelete(id);

  if (!project) {
    return NextResponse.json(
      { success: false, error: "Project not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, message: "Deleted" });
}
