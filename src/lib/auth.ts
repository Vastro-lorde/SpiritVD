import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/connection";
import { User } from "@/lib/models";
import { UserRole } from "@/enums";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: { params: { scope: "read:user user:email" } },
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null;
          const email = String(credentials.email).trim().toLowerCase();

          await connectDB();
          const user = await User.findOne({ email });
          if (!user) return null;
          if (!user.passwordHash || user.role !== UserRole.ADMIN) return null;

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash
          );
          if (!isValid) return null;

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.profileImage,
            role: user.role,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "github") {
        await connectDB();

        // Fetch all verified emails from GitHub (primary may differ from admin email)
        const githubEmails: string[] = [];
        if (account.access_token) {
          try {
            const res = await fetch("https://api.github.com/user/emails", {
              headers: {
                Authorization: `Bearer ${account.access_token}`,
                Accept: "application/vnd.github+json",
              },
            });
            if (res.ok) {
              const data = (await res.json()) as Array<{
                email: string;
                verified: boolean;
              }>;
              for (const entry of data) {
                if (entry.verified) {
                  githubEmails.push(entry.email.trim().toLowerCase());
                }
              }
            }
          } catch {
            // Fall through to primary email only
          }
        }

        // Also include the primary email NextAuth resolved (may already be in list)
        if (user.email) {
          const primary = user.email.trim().toLowerCase();
          if (!githubEmails.includes(primary)) githubEmails.push(primary);
        }

        if (githubEmails.length === 0) return false;

        // Find the admin whose email matches any verified GitHub email
        const existing = await User.findOne({
          email: { $in: githubEmails },
          role: UserRole.ADMIN,
        });

        if (!existing) return false;

        (user as { id?: string; role?: string; image?: string; name?: string }).id =
          existing._id.toString();
        (user as { id?: string; role?: string; image?: string; name?: string }).role =
          existing.role;
        (user as { image?: string }).image =
          existing.profileImage || (user.image ?? "");
        (user as { name?: string }).name = existing.name || user.name || "Admin";
      }

      if (
        account?.provider === "credentials" &&
        (user as { role?: string }).role !== UserRole.ADMIN
      ) {
        return false;
      }

      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        if (token?.sub) {
          (session.user as { id?: string }).id = token.sub;
        }
        if (token?.role) {
          (session.user as { role?: string }).role = String(token.role);
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = (user as { id?: string }).id ?? token.sub;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
  },
  session: { strategy: "jwt" },
});
