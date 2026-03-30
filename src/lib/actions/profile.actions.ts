"use server";

import { connectDB } from "@/lib/db/connection";
import { User, SocialLink } from "@/lib/models";
import { revalidatePath } from "next/cache";
import type { SocialPlatform } from "@/enums";
import { requireAuthenticatedAdminEmail } from "@/lib/auth/admin";

export async function updateProfile(formData: FormData) {
  const adminEmail = await requireAuthenticatedAdminEmail();

  await connectDB();

  await User.findOneAndUpdate(
    { email: adminEmail },
    {
      name: formData.get("name") as string,
      bio: formData.get("bio") as string,
      title: formData.get("title") as string,
      profileImage: (formData.get("profileImage") as string) ?? undefined,
      resumeUrl: (formData.get("resumeUrl") as string) ?? undefined,
    },
    { new: true }
  );

  revalidatePath("/admin/profile");
  revalidatePath("/");
  revalidatePath("/about");

  return { success: true };
}

export async function updateSocialLinks(
  links: { platform: SocialPlatform; url: string }[]
) {
  await requireAuthenticatedAdminEmail();

  await connectDB();

  for (const link of links) {
    await SocialLink.findOneAndUpdate(
      { platform: link.platform },
      { url: link.url },
      { upsert: true, new: true }
    );
  }

  revalidatePath("/admin/profile");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");

  return { success: true };
}

export async function updateResume(resumeUrl: string) {
  const adminEmail = await requireAuthenticatedAdminEmail();

  await connectDB();
  await User.findOneAndUpdate({ email: adminEmail }, { resumeUrl });

  revalidatePath("/admin/profile");
  revalidatePath("/contact");

  return { success: true };
}
