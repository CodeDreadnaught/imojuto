import bcrypt from "bcryptjs";
import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { connectDb } from "@/lib/db";
import { Role, User } from "@/models";

declare module "next-auth" {
  interface Session {
    user: {
      userId: string;
      roleId: string;
      permissions: string[];
    } & DefaultSession["user"];
  }

  interface User {
    userId: string;
    roleId: string;
    permissions: string[];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    userId?: string;
    roleId?: string;
    permissions?: string[];
  }
}

const credentialsSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(1),
});

type CredentialsInput = Partial<Record<"email" | "password", unknown>>;

export async function authorizeUserCredentials(credentials: CredentialsInput) {
  const parsed = credentialsSchema.safeParse(credentials);
  if (!parsed.success) {
    return null;
  }

  await connectDb();

  const user = await User.findOne({ email: parsed.data.email }).lean();
  if (!user || !user.isActive) {
    return null;
  }

  const isValidPassword = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!isValidPassword) {
    return null;
  }

  const role = await Role.findById(user.roleId).lean();
  if (!role) {
    return null;
  }

  return {
    id: String(user._id),
    userId: String(user._id),
    name: user.name,
    email: user.email,
    roleId: String(role._id),
    permissions: role.permissions,
  };
}

const nextAuth = NextAuth({
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: authorizeUserCredentials,
    }),
  ],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.userId = user.userId;
        token.roleId = user.roleId;
        token.permissions = user.permissions;
      }

      if (trigger === "update" && session?.user) {
        token.userId = session.user.userId ?? token.userId;
        token.roleId = session.user.roleId ?? token.roleId;
        token.permissions = session.user.permissions ?? token.permissions;
      }

      return token;
    },
    session({ session, token }) {
      if (token.userId && token.roleId) {
        session.user.userId = token.userId;
        session.user.roleId = token.roleId;
        session.user.permissions = token.permissions ?? [];
      }

      return session;
    },
  },
});

export const { handlers, auth, signIn, signOut, unstable_update } = nextAuth;
export const { GET, POST } = handlers;
