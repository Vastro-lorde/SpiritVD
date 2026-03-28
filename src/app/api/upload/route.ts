import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  uploadImage,
  uploadResume,
  deleteAsset,
} from "@/lib/services/cloudinary.service";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) ?? "general";
  const type = (formData.get("type") as string) ?? "image";

  if (!file) {
    return NextResponse.json(
      { success: false, error: "No file provided" },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const result =
    type === "resume"
      ? await uploadResume(buffer)
      : await uploadImage(buffer, folder);

  return NextResponse.json({ success: true, data: result }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { publicId } = await req.json();
  if (!publicId) {
    return NextResponse.json(
      { success: false, error: "No publicId provided" },
      { status: 400 }
    );
  }

  await deleteAsset(publicId);
  return NextResponse.json({ success: true, message: "Deleted" });
}
