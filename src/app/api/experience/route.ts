import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { Experience } from "@/lib/models";
import { getAuthenticatedAdminEmail } from "@/lib/auth/admin";

export async function GET() {
  const adminEmail = await getAuthenticatedAdminEmail();
  if (!adminEmail) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const experiences = await Experience.find()
    .sort({ order: 1, createdAt: -1 })
    .lean();
  return NextResponse.json({ success: true, data: experiences });
}

export async function POST(req: NextRequest) {
  const adminEmail = await getAuthenticatedAdminEmail();
  if (!adminEmail) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const body = await req.json();
  const count = await Experience.countDocuments();

  const experience = await Experience.create({
    ...body,
    currentlyWorking: !body.endDate,
    order: body.order ?? count,
  });

  return NextResponse.json(
    { success: true, data: experience },
    { status: 201 }
  );
}
