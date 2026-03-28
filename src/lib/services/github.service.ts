import { getEnv } from "@/lib/config/env";
import type { GitHubRepo, GitHubProfile } from "@/types";

const GITHUB_API = "https://api.github.com";

function headers() {
  const { GITHUB_TOKEN } = getEnv();
  return {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

export async function fetchProfile(): Promise<GitHubProfile> {
  const { GITHUB_USERNAME } = getEnv();
  const res = await fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}`, {
    headers: headers(),
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`GitHub profile fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchRepos(
  limit = 10,
  sort: "updated" | "stars" = "updated"
): Promise<GitHubRepo[]> {
  const { GITHUB_USERNAME } = getEnv();
  const sortParam = sort === "stars" ? "stargazers_count" : "updated";
  const res = await fetch(
    `${GITHUB_API}/users/${GITHUB_USERNAME}/repos?per_page=${limit}&sort=${sortParam}&direction=desc`,
    { headers: headers(), next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error(`GitHub repos fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchLanguages(
  repoName: string
): Promise<Record<string, number>> {
  const { GITHUB_USERNAME } = getEnv();
  const res = await fetch(
    `${GITHUB_API}/repos/${GITHUB_USERNAME}/${repoName}/languages`,
    { headers: headers(), next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error(`GitHub languages fetch failed: ${res.status}`);
  return res.json();
}
