import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/connection";
import { User } from "@/lib/models";
import { UserRole } from "@/enums";

export async function getAuthenticatedAdminEmail(): Promise<string | null> {
  const session = await auth();
  const email = session?.user?.email?.trim().toLowerCase();
  if (!email) return null;

  await connectDB();
  const user = await User.findOne({ email }).select("email role").lean();

  if (!user || user.role !== UserRole.ADMIN) {
    return null;
  }

  return email;
}

export async function requireAuthenticatedAdminEmail(): Promise<string> {
  const email = await getAuthenticatedAdminEmail();
  if (!email) {
    throw new Error("Unauthorized");
  }
  return email;
}
