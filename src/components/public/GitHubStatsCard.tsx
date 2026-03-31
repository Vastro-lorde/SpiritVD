import { GoRepo, GoStar, GoGitBranch, GoPeople } from "react-icons/go";
import { fetchProfile, fetchRepos } from "@/lib/services/github.service";
import type { GitHubRepo } from "@/types";

async function getGitHubStats() {
  try {
    const [profile, repos] = await Promise.all([
      fetchProfile(),
      fetchRepos(100, "stars"),
    ]);
    const totalStars = repos.reduce(
      (sum: number, r: GitHubRepo) => sum + (r.stargazers_count ?? 0),
      0
    );
    const langCounts: Record<string, number> = {};
    for (const repo of repos) {
      if (repo.language) {
        langCounts[repo.language] = (langCounts[repo.language] ?? 0) + 1;
      }
    }
    const topLanguages = Object.entries(langCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([lang]) => lang);
    return { profile, totalStars, topLanguages };
  } catch (err) {
    console.error("Failed to load GitHub stats:", err);
    return null;
  }
}

export default async function GitHubStatsCard() {
  const stats = await getGitHubStats();
  if (!stats) return null;

  const { profile, totalStars, topLanguages } = stats;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold text-primary dark:text-white">
        GitHub Statistics
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="flex flex-col items-center rounded-xl border border-border bg-white p-4 dark:border-border-dark dark:bg-surface-dark">
          <GoRepo className="h-5 w-5 text-primary" />
          <span className="mt-2 text-2xl font-bold text-primary dark:text-white">
            {profile.public_repos}
          </span>
          <span className="text-xs text-muted">Repositories</span>
        </div>
        <div className="flex flex-col items-center rounded-xl border border-border bg-white p-4 dark:border-border-dark dark:bg-surface-dark">
          <GoStar className="h-5 w-5 text-primary" />
          <span className="mt-2 text-2xl font-bold text-primary dark:text-white">
            {totalStars}
          </span>
          <span className="text-xs text-muted">Total Stars</span>
        </div>
        <div className="flex flex-col items-center rounded-xl border border-border bg-white p-4 dark:border-border-dark dark:bg-surface-dark">
          <GoPeople className="h-5 w-5 text-primary" />
          <span className="mt-2 text-2xl font-bold text-primary dark:text-white">
            {profile.followers}
          </span>
          <span className="text-xs text-muted">Followers</span>
        </div>
        <div className="flex flex-col items-center rounded-xl border border-border bg-white p-4 dark:border-border-dark dark:bg-surface-dark">
          <GoGitBranch className="h-5 w-5 text-primary" />
          <span className="mt-2 text-2xl font-bold text-primary dark:text-white">
            {topLanguages.length}
          </span>
          <span className="text-xs text-muted">Languages</span>
        </div>
      </div>
      {topLanguages.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {topLanguages.map((lang) => (
            <span
              key={lang}
              className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:text-white"
            >
              {lang}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
