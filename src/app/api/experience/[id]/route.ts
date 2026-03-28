import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { Experience } from "@/lib/models";
import { auth } from "@/lib/auth";

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

  const experience = await Experience.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  }).lean();

  if (!experience) {
    return NextResponse.json(
      { success: false, error: "Experience not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: experience });
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
  const experience = await Experience.findByIdAndDelete(id);

  if (!experience) {
    return NextResponse.json(
      { success: false, error: "Experience not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, message: "Deleted" });
}
