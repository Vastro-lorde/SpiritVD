import Link from "next/link";
import {
  FaLinkedinIn,
  FaGithub,
  FaYoutube,
  FaTwitter,
} from "react-icons/fa";

const socialLinks = [
  { icon: FaLinkedinIn, href: "https://linkedin.com/in/seundanielomatsola", label: "LinkedIn" },
  { icon: FaGithub, href: "https://github.com/Vastro-lorde", label: "GitHub" },
  { icon: FaYoutube, href: "#", label: "YouTube" },
  { icon: FaTwitter, href: "https://twitter.com/vastroLord", label: "Twitter" },
];

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-white py-8 dark:border-border-dark dark:bg-surface-dark">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex flex-col items-center gap-4">
          {/* Bottom nav */}
          <nav className="hidden gap-6 md:flex">
            {footerLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-muted transition-colors hover:text-primary dark:hover:text-white"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Social icons */}
          <div className="flex gap-4">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:text-primary dark:hover:text-white"
                aria-label={label}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          <p className="text-sm text-muted">
            &copy; {year} Seun Denial Omatsola
          </p>
        </div>
      </div>
    </footer>
  );
}
