import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";

function LoginPageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 dark:bg-surface-dark">
      <div className="w-full max-w-sm">
        <div className="h-8 w-24 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
        <div className="mt-6 h-12 w-full animate-pulse rounded-lg bg-gray-300 dark:bg-gray-600" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}
