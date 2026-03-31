export const dynamic = "force-dynamic";

import { connectDB } from "@/lib/db/connection";
import { ContactMessage } from "@/lib/models";
import MessageList from "@/components/admin/MessageList";

async function getMessages() {
  await connectDB();
  const messages = await ContactMessage.find()
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(messages));
}

export default async function AdminMessagesPage() {
  const messages = await getMessages();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-primary dark:text-white">
        Messages
      </h1>
      <p className="mt-1 text-sm text-muted">
        Contact form submissions — {messages.length} total
      </p>
      <MessageList initialMessages={messages} />
    </div>
  );
}
