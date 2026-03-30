"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ImagePlus } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder: string;
  label?: string;
  recommendedSize?: string;
}

export default function ImageUpload({
  value,
  onChange,
  folder,
  label = "Add Cover Page",
  recommendedSize = "1200 x 630 px",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    formData.append("type", "image");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (json.success) {
        onChange(json.data.url);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-gray-50 py-8 transition-colors hover:border-primary dark:border-border-dark dark:bg-surface-dark"
    >
      {value ? (
        <div className="relative h-32 w-full overflow-hidden rounded-lg">
          <Image src={value} alt="Upload" fill className="object-cover" />
        </div>
      ) : (
        <>
          <ImagePlus className="h-10 w-10 text-muted" />
          <p className="mt-2 text-sm font-medium text-primary dark:text-white">
            {uploading ? "Uploading..." : label}
          </p>
          <p className="text-xs text-muted">
            Recommended size {recommendedSize}
          </p>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}
