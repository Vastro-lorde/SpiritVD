"use client";

import { useState } from "react";
import { submitContactForm } from "@/lib/actions/contact.actions";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function handleSubmit(formData: FormData) {
    setStatus("sending");
    try {
      const result = await submitContactForm(formData);
      if (result.success) {
        setStatus("sent");
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form action={handleSubmit} className="mt-8 space-y-4">
      <div>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          required
          className="w-full rounded-lg border border-border bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-primary dark:border-border-dark dark:text-white"
        />
      </div>
      <div>
        <input
          type="email"
          name="email"
          placeholder="Email Id"
          required
          className="w-full rounded-lg border border-border bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-primary dark:border-border-dark dark:text-white"
        />
      </div>
      <div>
        <textarea
          name="message"
          placeholder="Type your message here..."
          rows={5}
          required
          className="w-full rounded-lg border border-border bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-primary dark:border-border-dark dark:text-white"
        />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-lg bg-primary py-3 text-sm font-medium text-white transition-colors hover:bg-primary-light disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "Submit"}
      </button>

      {status === "sent" && (
        <p className="text-center text-sm text-green-600">
          Message sent successfully!
        </p>
      )}
      {status === "error" && (
        <p className="text-center text-sm text-red-500">
          Failed to send. Please try again.
        </p>
      )}
    </form>
  );
}
