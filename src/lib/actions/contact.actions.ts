"use server";

import { connectDB } from "@/lib/db/connection";
import { ContactMessage } from "@/lib/models";
import { sendContactEmail } from "@/lib/services/nodemailer.service";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  message: z.string().min(1, "Message is required"),
});

export async function submitContactForm(formData: FormData) {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  await connectDB();
  await ContactMessage.create(parsed.data);

  try {
    await sendContactEmail(parsed.data);
  } catch (err) {
    console.error("Failed to send email:", err);
  }

  return { success: true, message: "Message sent successfully" };
}
