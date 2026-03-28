"use client";

import { useState, InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export default function PasswordInput({
  label,
  className = "",
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <label className="mb-1 block text-sm font-medium text-primary dark:text-white">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          {...props}
          type={visible ? "text" : "password"}
          className={`w-full rounded-lg border border-border bg-transparent px-4 py-3 pr-11 text-sm outline-none transition-colors focus:border-primary dark:border-border-dark dark:text-white ${className}`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-primary dark:hover:text-white"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? (
            <EyeOff className="h-4.5 w-4.5" />
          ) : (
            <Eye className="h-4.5 w-4.5" />
          )}
        </button>
      </div>
    </div>
  );
}
