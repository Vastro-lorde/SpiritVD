"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaGoogle, FaLinkedinIn, FaGithub } from "react-icons/fa";
import ThemeToggle from "@/components/shared/ThemeToggle";
import PasswordInput from "@/components/shared/PasswordInput";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleCredentialLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 dark:bg-surface-dark">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm">
        <h1 className="text-center text-2xl font-bold text-primary dark:text-white">
          Login
        </h1>
        <p className="mt-1 text-center text-sm text-muted">
          Don&apos;t have an account??{" "}
          <span className="font-medium text-primary dark:text-white">
            SignUp
          </span>
        </p>

        <form onSubmit={handleCredentialLogin} className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Email Id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-border bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-primary dark:border-border-dark dark:text-white"
          />
          <PasswordInput
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-center text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-3 text-sm font-medium text-white transition-colors hover:bg-primary-light disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border dark:bg-border-dark" />
          <span className="text-sm text-muted">or</span>
          <div className="h-px flex-1 bg-border dark:bg-border-dark" />
        </div>

        {/* OAuth buttons */}
        <div className="mt-6 flex justify-center gap-6">
          <button
            onClick={() => signIn("google", { callbackUrl: "/admin" })}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border transition-colors hover:bg-primary/5 dark:border-border-dark"
          >
            <FaGoogle className="h-5 w-5 text-primary dark:text-white" />
          </button>
          <button
            onClick={() => signIn("linkedin", { callbackUrl: "/admin" })}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border transition-colors hover:bg-primary/5 dark:border-border-dark"
          >
            <FaLinkedinIn className="h-5 w-5 text-blue-600" />
          </button>
          <button
            onClick={() => signIn("github", { callbackUrl: "/admin" })}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border transition-colors hover:bg-primary/5 dark:border-border-dark"
          >
            <FaGithub className="h-5 w-5 text-primary dark:text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
