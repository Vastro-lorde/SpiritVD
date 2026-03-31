import Link from "next/link";
import {
  FaLinkedinIn,
  FaGithub,
  FaYoutube,
  FaTwitter,
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";
import type { IconType } from "react-icons";

const platformIcons: Record<string, { icon: IconType; label: string }> = {
  linkedin: { icon: FaLinkedinIn, label: "LinkedIn" },
  github: { icon: FaGithub, label: "GitHub" },
  twitter: { icon: FaTwitter, label: "Twitter" },
  youtube: { icon: FaYoutube, label: "YouTube" },
  facebook: { icon: FaFacebookF, label: "Facebook" },
  instagram: { icon: FaInstagram, label: "Instagram" },
};

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

interface FooterProps {
  ownerName?: string;
  socialLinks?: { platform: string; url: string }[];
}

export default function Footer({ ownerName, socialLinks = [] }: FooterProps) {
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
            {socialLinks
              .filter((link) => link.url && platformIcons[link.platform])
              .map((link) => {
                const { icon: Icon, label } = platformIcons[link.platform];
                return (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:text-primary dark:hover:text-white"
                    aria-label={label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
          </div>

          {ownerName && (
            <p className="text-sm text-muted">
              &copy; {year} {ownerName}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
