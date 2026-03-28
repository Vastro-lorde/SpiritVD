import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/connection";
import { User } from "@/lib/models";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { error: "Current password and new password are required" },
      { status: 400 }
    );
  }

  if (newPassword.length < 6) {
    return NextResponse.json(
      { error: "New password must be at least 6 characters" },
      { status: 400 }
    );
  }

  await connectDB();
  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) {
    return NextResponse.json(
      { error: "Current password is incorrect" },
      { status: 400 }
    );
  }

  const newHash = await bcrypt.hash(newPassword, 12);
  await User.updateOne(
    { _id: user._id },
    { $set: { passwordHash: newHash } }
  );

  return NextResponse.json({ message: "Password changed successfully" });
}
