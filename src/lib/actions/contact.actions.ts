"use server";

import { headers } from "next/headers";
import { connectDB } from "@/lib/db/connection";
import { ContactMessage } from "@/lib/models";
import { sendContactEmail } from "@/lib/services/nodemailer.service";
import { rateLimit } from "@/lib/utils/rate-limit";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  message: z.string().min(1, "Message is required"),
});

// 5 messages per 15 minutes per IP
const MAX_REQUESTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export async function submitContactForm(formData: FormData) {
  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerStore.get("x-real-ip") ??
    "unknown";

  const { limited, retryAfterMs } = rateLimit(ip, MAX_REQUESTS, WINDOW_MS);
  if (limited) {
    const minutes = Math.ceil(retryAfterMs / 60_000);
    return {
      success: false,
      error: `Too many messages. Please try again in ${minutes} minute${minutes > 1 ? "s" : ""}.`,
    };
  }

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
