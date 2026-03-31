import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { SiteConfig } from "@/lib/models";
import { auth } from "@/lib/auth";

// GET — public: returns site config (creates default if none exists)
export async function GET() {
  try {
    await connectDB();
    let config = await SiteConfig.findOne().lean();
    if (!config) {
      config = await SiteConfig.create({});
      config = config.toObject();
    }
    return NextResponse.json({ success: true, data: config });
  } catch (err) {
    console.error("Failed to load site config:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load site config" },
      { status: 500 }
    );
  }
}

// PUT — admin only: update site config
export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectDB();
    const body = await req.json();

    const allowed = [
      "siteName",
      "siteTitle",
      "siteDescription",
      "faviconUrl",
      "ownerName",
      "ownerEmail",
      "ownerPhone",
    ];
    const updates: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in body) updates[key] = body[key];
    }

    let config = await SiteConfig.findOne();
    if (!config) {
      config = await SiteConfig.create(updates);
    } else {
      Object.assign(config, updates);
      await config.save();
    }

    return NextResponse.json({ success: true, data: config.toObject() });
  } catch (err) {
    console.error("Failed to update site config:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update site config" },
      { status: 500 }
    );
  }
}
