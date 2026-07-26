"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { z } from "zod";
import { signIn, signOut } from "@/auth";
import { connectDb } from "@/lib/db";
import { Role, User } from "@/models";

type AuthActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address.").trim().toLowerCase(),
  password: z.string().min(1, "Password is required."),
  callbackUrl: z.string().optional(),
});

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Enter a valid email address.").trim().toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters."),
  department: z.string().trim().optional(),
  phone: z.string().trim().optional(),
});

export async function loginUser(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    callbackUrl: formData.get("callbackUrl") || "/dashboard",
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: parsed.data.callbackUrl || "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, message: "Email or password is incorrect." };
    }
    throw error;
  }

  return { ok: true, message: "Signed in." };
}

export async function registerUser(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    department: formData.get("department") || undefined,
    phone: formData.get("phone") || undefined,
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  await connectDb();

  const existingUser = await User.findOne({ email: parsed.data.email }).select("_id");
  if (existingUser) {
    return {
      ok: false,
      message: "An account already uses this email.",
      fieldErrors: { email: ["Email is already registered."] },
    };
  }

  const role = await Role.findOne({ name: "student_staff" }).select("_id");
  if (!role) {
    return { ok: false, message: "Student/staff role is not seeded yet." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await User.create({
    name: parsed.data.name,
    email: parsed.data.email,
    passwordHash,
    roleId: role._id,
    department: parsed.data.department,
    phone: parsed.data.phone,
    isActive: true,
  });

  redirect("/login?registered=1");
}

export async function signOutUser() {
  await signOut({ redirectTo: "/login" });
}
