export const dynamic = "force-dynamic";

import Image from "next/image";
import { connectDB } from "@/lib/db/connection";
import { User, Experience, Education } from "@/lib/models";
import {
  FaLinkedinIn,
  FaGithub,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

async function getData() {
  await connectDB();
  const [user, experiences, education] = await Promise.all([
    User.findOne().select("-passwordHash").lean(),
    Experience.find().sort({ order: 1, createdAt: -1 }).lean(),
    Education.find().lean(),
  ]);
  return {
    user: user ? JSON.parse(JSON.stringify(user)) : null,
    experiences: JSON.parse(JSON.stringify(experiences)),
    education: JSON.parse(JSON.stringify(education)),
  };
}

function formatDate(date: string | null) {
  if (!date) return "Present";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

const interests = [
  "Photography",
  "Roller coasting",
  "Drawing",
  "Reading",
];

export default async function AboutPage() {
  const { user, experiences } = await getData();

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

        {/* Social icons */}
        <div className="mt-3 flex gap-3">
          {[
            { icon: FaLinkedinIn, href: "https://linkedin.com/in/seundanielomatsola" },
            { icon: FaGithub, href: "https://github.com/Vastro-lorde" },
            { icon: FaYoutube, href: "#" },
            { icon: FaTwitter, href: "https://twitter.com/vastroLord" },
          ].map(({ icon: Icon, href }, i) => (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-primary dark:hover:text-white"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>

        <p className="mt-6 text-center leading-relaxed text-muted">
          {user?.bio ??
            "I am a passionate software engineer with over 5 years of professional experience building modern web applications. My journey started with front-end development, but I quickly transitioned into full-stack engineering to architect robust systems from end to end."}
        </p>
      </div>

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
                <div className="absolute -left-[7px] top-8 h-3 w-3 rounded-full bg-primary" />

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
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-primary dark:text-white">
          Interests
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {interests.map((interest) => (
            <span
              key={interest}
              className="rounded-full border border-border px-4 py-2 text-sm text-muted dark:border-border-dark"
            >
              {interest}
            </span>
          ))}
        </div>
      </section>

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
