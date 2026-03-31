export const dynamic = "force-dynamic";

import Image from "next/image";
import { connectDB } from "@/lib/db/connection";
import { User, Experience, Education, SocialLink } from "@/lib/models";
import { fetchProfile, fetchRepos } from "@/lib/services/github.service";
import {
  FaLinkedinIn,
  FaGithub,
  FaTwitter,
  FaYoutube,
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";
import { GoRepo, GoStar, GoGitBranch, GoPeople } from "react-icons/go";
import type { IconType } from "react-icons";
import type { GitHubProfile, GitHubRepo } from "@/types";

const platformIcons: Record<string, { icon: IconType; label: string }> = {
  linkedin: { icon: FaLinkedinIn, label: "LinkedIn" },
  github: { icon: FaGithub, label: "GitHub" },
  twitter: { icon: FaTwitter, label: "Twitter" },
  youtube: { icon: FaYoutube, label: "YouTube" },
  facebook: { icon: FaFacebookF, label: "Facebook" },
  instagram: { icon: FaInstagram, label: "Instagram" },
};

async function getData() {
  try {
    await connectDB();
    const [user, experiences, education, socialLinks] = await Promise.all([
      User.findOne().select("-passwordHash").lean(),
      Experience.find().sort({ order: 1, createdAt: -1 }).lean(),
      Education.find().lean(),
      SocialLink.find().select("platform url").lean(),
    ]);
    return {
      user: user ? JSON.parse(JSON.stringify(user)) : null,
      experiences: JSON.parse(JSON.stringify(experiences)),
      education: JSON.parse(JSON.stringify(education)),
      socialLinks: JSON.parse(JSON.stringify(socialLinks)),
    };
  } catch (err) {
    console.error("Failed to load about page data:", err);
    return { user: null, experiences: [], education: [], socialLinks: [] };
  }
}

async function getGitHubStats(): Promise<{
  profile: GitHubProfile | null;
  totalStars: number;
  topLanguages: string[];
}> {
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
    return { profile: null, totalStars: 0, topLanguages: [] };
  }
}

function formatDate(date: string | null) {
  if (!date) return "Present";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

export default async function AboutPage() {
  const [{ user, experiences, socialLinks }, github] = await Promise.all([
    getData(),
    getGitHubStats(),
  ]);

  const userInterests: string[] = user?.interests ?? [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-center text-3xl font-bold text-primary dark:text-white">
        About Me
      </h1>

      {/* Profile */}
      <div className="mt-8 flex flex-col items-center">
        <div className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-primary/10">
          {user?.profileImage ? (
            <Image
              src={user.profileImage}
              alt={user.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary/5 text-3xl font-bold text-primary">
              SD
            </div>
          )}
        </div>

        <h2 className="mt-4 text-xl font-bold text-primary dark:text-white">
          {user?.name ?? "Seun Denial Omatsola"}
        </h2>
        <p className="text-sm text-muted">
          {user?.title ?? "Software Engineer (.NET/JS)"}
        </p>

        {/* Social icons — rendered dynamically from backend */}
        <div className="mt-3 flex gap-3">
          {socialLinks
            .filter(
              (link: { platform: string; url: string }) =>
                link.url && platformIcons[link.platform]
            )
            .map((link: { platform: string; url: string }) => {
              const { icon: Icon, label } = platformIcons[link.platform];
              return (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="text-muted hover:text-primary dark:hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
        </div>

        <p className="mt-6 text-center leading-relaxed text-muted">
          {user?.bio ??
            "I am a passionate software engineer with over 5 years of professional experience building modern web applications. My journey started with front-end development, but I quickly transitioned into full-stack engineering to architect robust systems from end to end."}
        </p>
      </div>

      {/* GitHub Statistics */}
      {github.profile && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-primary dark:text-white">
            GitHub Statistics
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex flex-col items-center rounded-xl border border-border bg-white p-4 dark:border-border-dark dark:bg-surface-dark">
              <GoRepo className="h-5 w-5 text-primary" />
              <span className="mt-2 text-2xl font-bold text-primary dark:text-white">
                {github.profile.public_repos}
              </span>
              <span className="text-xs text-muted">Repositories</span>
            </div>
            <div className="flex flex-col items-center rounded-xl border border-border bg-white p-4 dark:border-border-dark dark:bg-surface-dark">
              <GoStar className="h-5 w-5 text-primary" />
              <span className="mt-2 text-2xl font-bold text-primary dark:text-white">
                {github.totalStars}
              </span>
              <span className="text-xs text-muted">Total Stars</span>
            </div>
            <div className="flex flex-col items-center rounded-xl border border-border bg-white p-4 dark:border-border-dark dark:bg-surface-dark">
              <GoPeople className="h-5 w-5 text-primary" />
              <span className="mt-2 text-2xl font-bold text-primary dark:text-white">
                {github.profile.followers}
              </span>
              <span className="text-xs text-muted">Followers</span>
            </div>
            <div className="flex flex-col items-center rounded-xl border border-border bg-white p-4 dark:border-border-dark dark:bg-surface-dark">
              <GoGitBranch className="h-5 w-5 text-primary" />
              <span className="mt-2 text-2xl font-bold text-primary dark:text-white">
                {github.topLanguages.length}
              </span>
              <span className="text-xs text-muted">Languages</span>
            </div>
          </div>
          {github.topLanguages.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {github.topLanguages.map((lang) => (
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
      )}

      {/* Experience */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-primary dark:text-white">
          Experience
        </h2>

        <div className="mt-6 space-y-0">
          {experiences.map(
            (
              exp: {
                _id: string;
                company: string;
                position: string;
                startDate: string;
                endDate: string | null;
                responsibilities: string[];
              },
              i: number
            ) => (
              <div
                key={exp._id}
                className="relative border-l-2 border-primary/20 py-6 pl-6 dark:border-border-dark"
              >
                {/* Timeline dot */}
                <div className="absolute -left-1.75 top-8 h-3 w-3 rounded-full bg-primary" />

                <p className="text-xs text-muted">
                  {formatDate(exp.startDate)} &ndash; {formatDate(exp.endDate)}
                </p>
                <h3 className="mt-1 font-semibold text-primary dark:text-white">
                  {exp.position}
                </h3>
                <p className="text-sm text-muted">{exp.company}</p>

                {exp.responsibilities.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {exp.responsibilities.map((r: string, j: number) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-sm text-muted"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40" />
                        {r}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          )}
        </div>
      </section>

      {/* Interests */}
      {userInterests.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-primary dark:text-white">
            Interests
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {userInterests.map((interest) => (
              <span
                key={interest}
                className="rounded-full border border-border px-4 py-2 text-sm text-muted dark:border-border-dark"
              >
                {interest}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Get In Touch */}
      <section className="mt-16 text-center">
        <h2 className="text-xl font-bold text-primary dark:text-white">
          Get In Touch
        </h2>
        <p className="mt-1 text-sm text-muted">
          Let&apos;s Connect and Create the Magic together!
        </p>
        <a
          href="/contact"
          className="mt-4 inline-block rounded-full bg-primary px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-light"
        >
          Say Hello!
        </a>
      </section>
    </div>
  );
}
