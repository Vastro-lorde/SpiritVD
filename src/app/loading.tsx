export default function GlobalLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-surface-dark">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-accent dark:border-border-dark dark:border-t-accent" />
        <p className="text-sm text-muted animate-pulse">Loading…</p>
      </div>
    </div>
  );
}
