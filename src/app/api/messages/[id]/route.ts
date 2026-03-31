import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { ContactMessage } from "@/lib/models";
import { auth } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();

  const body = await req.json();
  const message = await ContactMessage.findByIdAndUpdate(id, body, {
    new: true,
  }).lean();

  if (!message) {
    return NextResponse.json(
      { success: false, error: "Message not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: JSON.parse(JSON.stringify(message)),
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();

  const deleted = await ContactMessage.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json(
      { success: false, error: "Message not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
