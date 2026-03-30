"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { createExperience } from "@/lib/actions/experience.actions";
import { useRouter } from "next/navigation";

export default function AddExperienceModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const router = useRouter();
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentlyWorking, setCurrentlyWorking] = useState(false);
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submitExperience() {
    if (!company.trim() || !position.trim()) return;
    setSaving(true);
    setError("");

    try {
      const formData = new FormData();
      formData.set("company", company);
      formData.set("position", position);
      formData.set("startDate", startDate);
      formData.set("endDate", currentlyWorking ? "" : endDate);
      formData.set("currentlyWorking", String(currentlyWorking));
      formData.set("description", description);

      await createExperience(formData);
      router.refresh();
      onClose();
    } catch {
      setError("Failed to save experience. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await submitExperience();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 pt-4 pb-20">
      <div className="w-full max-w-md rounded-xl bg-white p-6 dark:bg-surface-dark">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={onClose} className="flex items-center gap-2 text-sm text-primary dark:text-white">
            <ArrowLeft className="h-4 w-4" />
            Add Experience
          </button>
          <button
            onClick={() => void submitExperience()}
            className="text-sm text-muted hover:text-primary"
          >
            Save
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-primary dark:text-white">
              Company Name
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Enter Company Name..."
              required
              className="mt-1 w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:text-white"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-primary dark:text-white">
              Position
            </label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Enter Position..."
              required
              className="mt-1 w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="startDate" className="text-sm font-medium text-primary dark:text-white">
                Start Date
              </label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="text-sm font-medium text-primary dark:text-white">
                End Date
              </label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={currentlyWorking}
                className="mt-1 w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary disabled:opacity-50 dark:border-border-dark dark:text-white"
              />
            </div>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={currentlyWorking}
              onChange={(e) => setCurrentlyWorking(e.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
            <span className="text-sm text-primary dark:text-white">
              Currently Working Here
            </span>
          </label>

          <div>
            <label className="text-sm font-medium text-primary dark:text-white">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a brief description of the project..."
              rows={4}
              className="mt-1 w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={saving || !company.trim() || !position.trim()}
            className="w-full rounded-lg bg-primary py-3 text-sm font-medium text-white transition-colors hover:bg-primary-light disabled:opacity-60"
          >
            {saving ? "Submitting..." : "Submit"}
          </button>

          {error && <p className="text-center text-sm text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
}
