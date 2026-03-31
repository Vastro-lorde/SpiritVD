import nodemailer from "nodemailer";
import { getEnv } from "@/lib/config/env";

function createTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = getEnv();
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });
}

interface ContactEmailPayload {
  name: string;
  email: string;
  message: string;
}

export async function sendContactEmail(
  payload: ContactEmailPayload
): Promise<void> {
  const { CONTACT_EMAIL, SMTP_USER } = getEnv();
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Portfolio Contact" <${SMTP_USER}>`,
    to: CONTACT_EMAIL,
    replyTo: payload.email,
    subject: `New message from ${payload.name}`,
    html: `
      <h2>New Contact Form Message</h2>
      <p><strong>Name:</strong> ${payload.name}</p>
      <p><strong>Email:</strong> ${payload.email}</p>
      <hr />
      <p>${payload.message}</p>
    `,
  });
}

export async function sendNotification(
  subject: string,
  html: string
): Promise<void> {
  const { CONTACT_EMAIL, SMTP_USER } = getEnv();
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"SpiritVD" <${SMTP_USER}>`,
    to: CONTACT_EMAIL,
    subject,
    html,
  });
}

export async function sendReplyEmail(
  to: string,
  subject: string,
  body: string
): Promise<void> {
  const { SMTP_USER } = getEnv();
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Seun Omatsola" <${SMTP_USER}>`,
    to,
    subject,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        ${body.replace(/\n/g, "<br />")}
      </div>
    `,
  });
}
