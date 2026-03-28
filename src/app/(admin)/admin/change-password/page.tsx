"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/shared/PasswordInput";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-4 py-6">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-primary dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="mx-auto max-w-md">
        <h2 className="text-xl font-bold text-primary dark:text-white">
          Change Password
        </h2>
        <p className="mt-1 text-sm text-muted">
          Enter your current password and choose a new one.
        </p>

        {success ? (
          <div className="mt-8 flex flex-col items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20">
            <CheckCircle className="h-10 w-10 text-green-500" />
            <p className="text-center font-medium text-green-700 dark:text-green-400">
              Password changed successfully!
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="mt-2 text-sm text-muted underline hover:text-primary dark:hover:text-white"
            >
              Change again
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <PasswordInput
              label="Current Password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />

            <PasswordInput
              label="New Password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />

            <PasswordInput
              label="Confirm New Password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />

            {error && (
              <p className="text-center text-sm text-red-500">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary py-3 text-sm font-medium text-white transition-colors hover:bg-primary-light disabled:opacity-60"
            >
              {loading ? "Changing..." : "Change Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
