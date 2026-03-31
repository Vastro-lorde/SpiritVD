import { NextRequest, NextResponse } from "next/server";
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

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const { limited, retryAfterMs } = rateLimit(ip, MAX_REQUESTS, WINDOW_MS);
  if (limited) {
    const retryAfterSec = Math.ceil(retryAfterMs / 1000);
    return NextResponse.json(
      { success: false, error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfterSec) },
      }
    );
  }

  const body = await req.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  await connectDB();
  await ContactMessage.create(parsed.data);

  try {
    await sendContactEmail(parsed.data);
  } catch (err) {
    console.error("Failed to send contact email:", err);
  }

  return NextResponse.json(
    { success: true, message: "Message sent successfully" },
    { status: 201 }
  );
}
