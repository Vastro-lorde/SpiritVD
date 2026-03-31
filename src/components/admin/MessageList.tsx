"use client";

import { useState } from "react";
import { IContactMessage } from "@/types";
import {
  Mail,
  MailOpen,
  Reply,
  Trash2,
  Check,
  ChevronDown,
  ChevronUp,
  Loader2,
  X,
} from "lucide-react";
import { useToast } from "@/components/shared/Toast";

export default function MessageList({
  initialMessages,
}: {
  initialMessages: IContactMessage[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<IContactMessage | null>(null);
  const [replySubject, setReplySubject] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [sending, setSending] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { showToast } = useToast();

  const unreadCount = messages.filter((m) => !m.read).length;

  async function markRead(id: string, read: boolean) {
    const res = await fetch(`/api/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    });
    if (res.ok) {
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, read } : m))
      );
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this message?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m._id !== id));
        showToast("Message deleted", "success");
        if (expandedId === id) setExpandedId(null);
      } else {
        showToast("Failed to delete", "error");
      }
    } finally {
      setDeletingId(null);
    }
  }

  function openReply(msg: IContactMessage) {
    setReplyTo(msg);
    setReplySubject(`Re: Message from ${msg.name}`);
    setReplyBody("");
  }

  async function handleSendReply() {
    if (!replyTo || !replyBody.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/messages/${replyTo._id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: replySubject, body: replyBody }),
      });
      if (res.ok) {
        const { data } = await res.json();
        setMessages((prev) =>
          prev.map((m) => (m._id === replyTo._id ? data : m))
        );
        showToast("Reply sent successfully!", "success");
        setReplyTo(null);
      } else {
        showToast("Failed to send reply", "error");
      }
    } catch {
      showToast("Failed to send reply", "error");
    } finally {
      setSending(false);
    }
  }

  function toggleExpand(msg: IContactMessage) {
    if (expandedId === msg._id) {
      setExpandedId(null);
    } else {
      setExpandedId(msg._id);
      if (!msg.read) markRead(msg._id, true);
    }
  }

  return (
    <>
      {/* Stats */}
      {unreadCount > 0 && (
        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
          {unreadCount} unread message{unreadCount > 1 ? "s" : ""}
        </div>
      )}

      {messages.length === 0 ? (
        <div className="mt-12 text-center text-muted">
          <Mail className="mx-auto h-12 w-12 opacity-30" />
          <p className="mt-2">No messages yet</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {messages.map((msg) => {
            const isExpanded = expandedId === msg._id;
            return (
              <div
                key={msg._id}
                className={`rounded-xl border transition-colors ${
                  msg.read
                    ? "border-border bg-white dark:border-border-dark dark:bg-surface-dark"
                    : "border-primary/30 bg-primary/5 dark:border-primary/40 dark:bg-primary/5"
                }`}
              >
                {/* Header row */}
                <button
                  onClick={() => toggleExpand(msg)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left"
                >
                  {msg.read ? (
                    <MailOpen className="h-4 w-4 shrink-0 text-muted" />
                  ) : (
                    <Mail className="h-4 w-4 shrink-0 text-primary" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`truncate text-sm ${!msg.read ? "font-semibold text-primary dark:text-white" : "font-medium text-primary dark:text-white"}`}
                      >
                        {msg.name}
                      </span>
                      <span className="shrink-0 text-xs text-muted">
                        {new Date(msg.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {msg.repliedAt && (
                        <span className="flex shrink-0 items-center gap-1 text-xs text-green-600 dark:text-green-400">
                          <Check className="h-3 w-3" /> Replied
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-muted">{msg.email}</p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-muted" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted" />
                  )}
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t border-border px-4 py-4 dark:border-border-dark">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-primary dark:text-white">
                      {msg.message}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => openReply(msg)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-light"
                      >
                        <Reply className="h-3.5 w-3.5" />
                        Reply
                      </button>
                      <button
                        onClick={() => markRead(msg._id, !msg.read)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:text-primary dark:border-border-dark dark:hover:text-white"
                      >
                        {msg.read ? (
                          <>
                            <Mail className="h-3.5 w-3.5" /> Mark Unread
                          </>
                        ) : (
                          <>
                            <MailOpen className="h-3.5 w-3.5" /> Mark Read
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(msg._id)}
                        disabled={deletingId === msg._id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:hover:bg-red-900/20"
                      >
                        {deletingId === msg._id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Reply modal */}
      {replyTo && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-surface-dark">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-primary dark:text-white">
                Reply to {replyTo.name}
              </h3>
              <button
                onClick={() => setReplyTo(null)}
                aria-label="Close reply"
                className="text-muted hover:text-primary dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-1 text-xs text-muted">To: {replyTo.email}</p>

            {/* Original message */}
            <div className="mt-4 rounded-lg bg-gray-50 p-3 text-xs text-muted dark:bg-gray-800">
              <p className="font-medium">Original message:</p>
              <p className="mt-1 whitespace-pre-wrap">{replyTo.message}</p>
            </div>

            <div className="mt-4 space-y-3">
              <input
                type="text"
                value={replySubject}
                onChange={(e) => setReplySubject(e.target.value)}
                placeholder="Subject"
                className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark dark:text-white"
              />
              <textarea
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                placeholder="Type your reply..."
                rows={6}
                className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark dark:text-white"
              />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setReplyTo(null)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-primary dark:border-border-dark dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSendReply}
                disabled={sending || !replyBody.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-light disabled:opacity-60"
              >
                {sending && <Loader2 className="h-4 w-4 animate-spin" />}
                {sending ? "Sending..." : "Send Reply"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
