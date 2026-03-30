import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { User, SocialLink, Education } from "@/lib/models";
import { getAuthenticatedAdminEmail } from "@/lib/auth/admin";

export async function GET() {
  const adminEmail = await getAuthenticatedAdminEmail();
  if (!adminEmail) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const user = await User.findOne().select("-passwordHash").lean();
  const socialLinks = await SocialLink.find().lean();
  const education = await Education.find().lean();

  return NextResponse.json({
    success: true,
    data: { user, socialLinks, education },
  });
}

export async function PUT(req: NextRequest) {
  const adminEmail = await getAuthenticatedAdminEmail();
  if (!adminEmail) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const body = await req.json();

  if (body.socialLinks && Array.isArray(body.socialLinks)) {
    for (const link of body.socialLinks) {
      await SocialLink.findOneAndUpdate(
        { platform: link.platform },
        { url: link.url },
        { upsert: true, new: true }
      );
    }
  }

  if (body.user) {
    await User.findOneAndUpdate({ email: adminEmail }, body.user, { new: true });
  }

  const user = await User.findOne({ email: adminEmail }).select("-passwordHash").lean();
  const socialLinks = await SocialLink.find().lean();

  return NextResponse.json({
    success: true,
    data: { user, socialLinks },
  });
}
