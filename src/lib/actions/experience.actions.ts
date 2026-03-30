"use server";

import { connectDB } from "@/lib/db/connection";
import { Experience } from "@/lib/models";
import { revalidatePath } from "next/cache";
import { requireAuthenticatedAdminEmail } from "@/lib/auth/admin";

export async function createExperience(formData: FormData) {
  await requireAuthenticatedAdminEmail();

  await connectDB();

  const endDate = formData.get("endDate") as string;
  const currentlyWorking = formData.get("currentlyWorking") === "true" || !endDate;

  const count = await Experience.countDocuments();
  const experience = await Experience.create({
    company: formData.get("company") as string,
    position: formData.get("position") as string,
    startDate: formData.get("startDate") as string,
    endDate: currentlyWorking ? null : endDate,
    currentlyWorking,
    description: (formData.get("description") as string) ?? "",
    responsibilities: (formData.get("responsibilities") as string)
      ?.split("\n")
      .filter(Boolean) ?? [],
    order: count,
  });

  revalidatePath("/admin/profile");
  revalidatePath("/about");

  return { success: true, data: JSON.parse(JSON.stringify(experience)) };
}

export async function updateExperience(id: string, formData: FormData) {
  await requireAuthenticatedAdminEmail();

  await connectDB();

  const endDate = formData.get("endDate") as string;
  const currentlyWorking = formData.get("currentlyWorking") === "true" || !endDate;

  const experience = await Experience.findByIdAndUpdate(
    id,
    {
      company: formData.get("company") as string,
      position: formData.get("position") as string,
      startDate: formData.get("startDate") as string,
      endDate: currentlyWorking ? null : endDate,
      currentlyWorking,
      description: (formData.get("description") as string) ?? "",
      responsibilities: (formData.get("responsibilities") as string)
        ?.split("\n")
        .filter(Boolean) ?? [],
    },
    { new: true, runValidators: true }
  );

  revalidatePath("/admin/profile");
  revalidatePath("/about");

  return { success: true, data: JSON.parse(JSON.stringify(experience)) };
}

export async function deleteExperience(id: string) {
  await requireAuthenticatedAdminEmail();

  await connectDB();
  await Experience.findByIdAndDelete(id);

  revalidatePath("/admin/profile");
  revalidatePath("/about");

  return { success: true };
}
