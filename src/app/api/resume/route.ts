import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { User } from "@/lib/models";

export async function GET() {
  try {
    await connectDB();
    const user = await User.findOne().select("resumeUrl").lean();

    if (!user?.resumeUrl) {
      return NextResponse.json(
        { success: false, error: "Resume not found" },
        { status: 404 }
      );
    }

    const response = await fetch(user.resumeUrl);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch resume" },
        { status: 502 }
      );
    }

    const fileBuffer = await response.arrayBuffer();
    const contentType =
      response.headers.get("content-type") || "application/pdf";

    // Extract filename from the URL
    const urlPath = new URL(user.resumeUrl).pathname;
    const filename = decodeURIComponent(
      urlPath.split("/").pop() || "resume.pdf"
    );

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
