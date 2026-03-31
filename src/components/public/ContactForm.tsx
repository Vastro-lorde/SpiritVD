"use client";

import { useState, useRef } from "react";
import { submitContactForm } from "@/lib/actions/contact.actions";
import { useToast } from "@/components/shared/Toast";
import { Loader2 } from "lucide-react";

export default function ContactForm() {
  const [sending, setSending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { showToast } = useToast();

  async function handleSubmit(formData: FormData) {
    setSending(true);
    try {
      const result = await submitContactForm(formData);
      if (result.success) {
        showToast("Message sent successfully!", "success");
        formRef.current?.reset();
      } else if (result.error) {
        showToast(result.error, "error");
      } else {
        showToast("Failed to send message. Please try again.", "error");
      }
    } catch {
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setSending(false);
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="mt-8 space-y-4">
      <div>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          required
          disabled={sending}
          className="w-full rounded-lg border border-border bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 dark:border-border-dark dark:text-white"
        />
      </div>
      <div>
        <input
          type="email"
          name="email"
          placeholder="Email Id"
          required
          disabled={sending}
          className="w-full rounded-lg border border-border bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 dark:border-border-dark dark:text-white"
        />
      </div>
      <div>
        <textarea
          name="message"
          placeholder="Type your message here..."
          rows={5}
          required
          disabled={sending}
          className="w-full rounded-lg border border-border bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 dark:border-border-dark dark:text-white"
        />
      </div>
      <button
        type="submit"
        disabled={sending}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-medium text-white transition-colors hover:bg-primary-light disabled:opacity-60"
      >
        {sending && <Loader2 className="h-4 w-4 animate-spin" />}
        {sending ? "Sending..." : "Submit"}
      </button>
    </form>
  );
}
