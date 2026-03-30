import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { ContactMessage } from "@/lib/models";
import { sendContactEmail } from "@/lib/services/nodemailer.service";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  message: z.string().min(1, "Message is required"),
});

export async function POST(req: NextRequest) {
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
