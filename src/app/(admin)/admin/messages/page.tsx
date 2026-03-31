export const dynamic = "force-dynamic";

import { connectDB } from "@/lib/db/connection";
import { ContactMessage } from "@/lib/models";
import MessageList from "@/components/admin/MessageList";
import SearchInput from "@/components/shared/SearchInput";
import Pagination from "@/components/shared/Pagination";

const LIMIT = 10;

async function getMessages(page: number, search: string) {
  await connectDB();
  const filter: Record<string, unknown> = {};
  if (search) {
    const regex = { $regex: search, $options: "i" };
    filter.$or = [{ name: regex }, { email: regex }, { message: regex }];
  }
  const [messages, total] = await Promise.all([
    ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * LIMIT)
      .limit(LIMIT)
      .lean(),
    ContactMessage.countDocuments(filter),
  ]);
  return { messages: JSON.parse(JSON.stringify(messages)), total };
}

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1"));
  const search = params.search ?? "";
  const { messages, total } = await getMessages(page, search);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-primary dark:text-white">
        Messages
      </h1>
      <p className="mt-1 text-sm text-muted">
        Contact form submissions — {total} total
      </p>
      <div className="mt-4">
        <SearchInput placeholder="Search messages..." />
      </div>
      <MessageList initialMessages={messages} />
      <Pagination total={total} page={page} limit={LIMIT} />
    </div>
  );
}
