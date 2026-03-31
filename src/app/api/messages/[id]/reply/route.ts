import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { ContactMessage } from "@/lib/models";
import { auth } from "@/lib/auth";
import { sendReplyEmail } from "@/lib/services/nodemailer.service";
import { z } from "zod";

const replySchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Reply body is required"),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();

  const message = await ContactMessage.findById(id);
  if (!message) {
    return NextResponse.json(
      { success: false, error: "Message not found" },
      { status: 404 }
    );
  }

  const json = await req.json();
  const parsed = replySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    await sendReplyEmail(message.email, parsed.data.subject, parsed.data.body);
    message.repliedAt = new Date();
    message.read = true;
    await message.save();
  } catch (err) {
    console.error("Failed to send reply:", err);
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Reply sent successfully",
    data: JSON.parse(JSON.stringify(message)),
  });
}
