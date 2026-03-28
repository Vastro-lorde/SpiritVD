export const dynamic = "force-dynamic";

import { connectDB } from "@/lib/db/connection";
import { User, SocialLink, Experience } from "@/lib/models";
import ProfileManager from "@/components/admin/ProfileManager";

async function getData() {
  await connectDB();
  const [user, socialLinks, experiences] = await Promise.all([
    User.findOne().select("-passwordHash").lean(),
    SocialLink.find().lean(),
    Experience.find().sort({ order: 1, createdAt: -1 }).lean(),
  ]);

  return {
    user: user ? JSON.parse(JSON.stringify(user)) : null,
    socialLinks: JSON.parse(JSON.stringify(socialLinks)),
    experiences: JSON.parse(JSON.stringify(experiences)),
  };
}

export default async function AdminProfilePage() {
  const { user, socialLinks, experiences } = await getData();

  return (
    <div className="px-4 py-6">
      <ProfileManager
        initialUser={user}
        initialSocialLinks={socialLinks}
        initialExperiences={experiences}
      />
    </div>
  );
}
