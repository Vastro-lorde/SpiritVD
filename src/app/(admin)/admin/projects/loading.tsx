export default function ProjectsLoading() {
  return (
    <div className="px-4 py-6">
      {/* Search skeleton */}
      <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-border-dark" />

      {/* Create button skeleton */}
      <div className="mt-4 h-11 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-border-dark" />

      {/* Project card skeletons */}
      <div className="mt-6 space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-border bg-white dark:border-border-dark dark:bg-surface-dark"
          >
            <div className="h-44 w-full animate-pulse bg-gray-200 dark:bg-border-dark" />
            <div className="p-4 space-y-3">
              <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-border-dark" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-border-dark" />
              <div className="flex gap-2 mt-3">
                <div className="h-9 flex-1 animate-pulse rounded-lg bg-gray-200 dark:bg-border-dark" />
                <div className="h-9 w-9 animate-pulse rounded-lg bg-gray-200 dark:bg-border-dark" />
                <div className="h-9 w-9 animate-pulse rounded-lg bg-gray-200 dark:bg-border-dark" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
