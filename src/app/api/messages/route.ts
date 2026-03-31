import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { ContactMessage } from "@/lib/models";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const messages = await ContactMessage.find()
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({
    success: true,
    data: JSON.parse(JSON.stringify(messages)),
  });
}
