export const dynamic = "force-dynamic";

import { connectDB } from "@/lib/db/connection";
import { User } from "@/lib/models";
import { FiMail, FiPhone, FiDownload } from "react-icons/fi";
import ContactForm from "@/components/public/ContactForm";

async function getUser() {
  try {
    await connectDB();
    const user = await User.findOne().select("-passwordHash").lean();
    return user ? JSON.parse(JSON.stringify(user)) : null;
  } catch (err) {
    console.error("Failed to load user data:", err);
    return null;
  }
}

export default async function ContactPage() {
  const user = await getUser();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-center text-sm text-muted">Contact</p>
      <h1 className="mt-1 text-center text-3xl font-bold text-primary dark:text-white">
        Get In Touch
      </h1>
      <p className="mt-2 text-center text-muted">
        Have any questions or want to ask any?
      </p>

      {/* Contact info */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/5">
            <FiMail className="h-5 w-5 text-primary dark:text-white" />
          </div>
          <div>
            <p className="text-xs text-muted">Email</p>
            <p className="font-medium text-primary dark:text-white">
              Omatsolaseund@gmail.com
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/5">
            <FiPhone className="h-5 w-5 text-primary dark:text-white" />
          </div>
          <div>
            <p className="text-xs text-muted">Phone Number</p>
            <p className="font-medium text-primary dark:text-white">
              +234 816 321 4714
            </p>
          </div>
        </div>

        {user?.resumeUrl && (
          <a
            href={user.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-light"
          >
            <FiDownload className="h-4 w-4" />
            Download CV
          </a>
        )}
      </div>

      {/* Contact form */}
      <ContactForm />
    </div>
  );
}
